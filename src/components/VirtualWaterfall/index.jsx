import React, { useCallback, useEffect, useRef, useState } from "react"

// === 常量定义 ===
const GUTTER = 16
const VIEWPORT_BUFFER = 1000
const VERTICAL_GAP = 16
const HORIZONTAL_GAP = 16
const MAX_REMOVED_ITEMS = 2000 // 移除上限

export default function VirtualWaterfallCursor({
  fetchPage,          // 异步分页加载函数 ({ limit, clt, cli, ...params })
  getItemId,          // 获取 item 唯一标识的函数
  getImageSrc,        // 获取图片地址
  renderItem,         // 渲染 item 的函数 (item, { remove }) => ReactNode
  pageSize = 20,
  columnCount = 4,
  params = {},
}) {
  const containerRef = useRef(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [scrollTop, setScrollTop] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight)
  const [, forceRerender] = useState(0)

  const imgRatiosRef = useRef({})       // 图片宽高比
  const extraHeightRef = useRef({})     // 每个 item 图片下方内容区域的高度
  const itemsRef = useRef([])           // 所有已加载数据项
  const removedIdsRef = useRef(new Set()) // 软删除 ID 列表
  const loadingRef = useRef(false)

  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [nextCursor, setNextCursor] = useState(null)

  // === 计算列宽 ===
  const columnWidth =
    (containerWidth - (columnCount - 1) * HORIZONTAL_GAP) / columnCount

  // === 加载更多数据 ===
  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore || loadingRef.current) return
    loadingRef.current = true
    setIsLoading(true)

    try {
      const lastItem = nextCursor || itemsRef.current[itemsRef.current.length - 1]
      const res = await fetchPage({
        limit: pageSize,
        clt: lastItem?.create_time,
        cli: lastItem?._id,
        ...params,
      })

      const list = res?.data?.rows || res?.data?.list || res?.data || []
      if (list.length < pageSize) setHasMore(false)
      if (res?.next_cursor) setNextCursor(res.next_cursor)

      itemsRef.current.push(...list)
      forceRerender(n => n + 1)
    } finally {
      loadingRef.current = false
      setIsLoading(false)
    }
  }, [fetchPage, hasMore, isLoading, nextCursor, pageSize, params])

  // === 软删除函数 ===
  const removeItem = useCallback((id) => {
    removedIdsRef.current.add(id)
    forceRerender(n => n + 1)

    if (removedIdsRef.current.size > MAX_REMOVED_ITEMS) {
      // 👉 超出上限，触发彻底清理
      console.log("🧹 执行彻底清理")
      itemsRef.current = itemsRef.current.filter(
        item => !removedIdsRef.current.has(getItemId(item))
      )
      imgRatiosRef.current = Object.fromEntries(
        Object.entries(imgRatiosRef.current).filter(
          ([key]) => !removedIdsRef.current.has(key)
        )
      )
      extraHeightRef.current = Object.fromEntries(
        Object.entries(extraHeightRef.current).filter(
          ([key]) => !removedIdsRef.current.has(key)
        )
      )
      removedIdsRef.current.clear()
    }
  }, [getItemId])

  // === 初始加载 ===
  useEffect(() => {
    if (containerWidth > 0 && itemsRef.current.length === 0) {
      loadMore()
    }
  }, [containerWidth, loadMore])

  // === 监听容器尺寸变化 ===
  useEffect(() => {
    const resizeObserver = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width)
    })
    if (containerRef.current) resizeObserver.observe(containerRef.current)
    return () => resizeObserver.disconnect()
  }, [])

  // === 滚动监听，触发懒加载 ===
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = el.scrollTop
          setScrollTop(y)
          setViewportHeight(el.clientHeight)

          const lastItem = positionedItemsRef.current.at(-1)
          if (
            hasMore &&
            lastItem &&
            lastItem.top < y + el.clientHeight + VIEWPORT_BUFFER
          ) {
            loadMore()
          }

          ticking = false
        })
        ticking = true
      }
    }
    el.addEventListener("scroll", onScroll)
    return () => el.removeEventListener("scroll", onScroll)
  }, [loadMore, hasMore])

  // === 图片加载后记录比例 ===
  const onImageLoad = (id, e) => {
    const { naturalWidth, naturalHeight } = e.target
    if (naturalWidth === 0) return
    const ratio = naturalHeight / naturalWidth
    if (imgRatiosRef.current[id] !== ratio) {
      imgRatiosRef.current[id] = ratio
      forceRerender(n => n + 1)
    }
  }

  // === 过滤被删除的数据项 ===
  const allItems = itemsRef.current.filter(
    item => !removedIdsRef.current.has(getItemId(item))
  )

  // === 计算布局（瀑布流） ===
  const cols = Array.from({ length: columnCount }, () => 0)
  const positionedItems = allItems.map(item => {
    const id = getItemId(item)
    const ratio = imgRatiosRef.current[id] || 1.5
    const imgHeight = columnWidth * ratio
    const extra = extraHeightRef.current[id] ?? 0
    const height = imgHeight + extra

    const col = cols.indexOf(Math.min(...cols))
    const top = cols[col]
    const left = col * (columnWidth + HORIZONTAL_GAP)
    cols[col] += height + VERTICAL_GAP

    return { ...item, _id: id, top, left, height, imgHeight }
  })

  const positionedItemsRef = useRef([])
  positionedItemsRef.current = positionedItems

  const containerHeight =
    Math.max(...positionedItems.map(i => i.top + i.height), 0) + 48

  const visibleItems = positionedItems.filter(
    i =>
      i.top + i.height >= scrollTop - VIEWPORT_BUFFER &&
      i.top <= scrollTop + viewportHeight + VIEWPORT_BUFFER
  )

  // === 额外内容区域测量 ===
  const measureExtra = (id, node) => {
    if (node && extraHeightRef.current[id] !== node.offsetHeight) {
      extraHeightRef.current[id] = node.offsetHeight
      forceRerender(n => n + 1)
    }
  }

  // === 渲染 ===
  return (
    <div
      ref={containerRef}
      style={{
        height: "100%",
        overflowY: "auto",
        background: "#fafafa",
      }}
    >
      <div
        style={{
          position: "relative",
          width: containerWidth,
          maxWidth: columnCount * (columnWidth + GUTTER) - GUTTER,
          margin: "0 auto",
          height: containerHeight,
        }}
      >
        {visibleItems.map(item => (
          <div
            key={item._id}
            style={{
              position: "absolute",
              top: item.top,
              left: item.left,
              width: columnWidth,
              background: "#fff",
              borderRadius: 8,
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <img
              src={getImageSrc(item)}
              alt=""
              style={{ display: "block", width: "100%" }}
              onLoad={e => onImageLoad(item._id, e)}
              loading="lazy"
            />
            <div
              ref={el => measureExtra(item._id, el)}
              style={{ padding: 8 }}
            >
              {renderItem(item, { remove: () => removeItem(item._id) })}
            </div>
          </div>
        ))}
      </div>

      {isLoading && allItems.length === 0 && (
        <div style={{ textAlign: "center", padding: 48, color: "#aaa" }}>
          正在加载中...
        </div>
      )}

      {!hasMore && allItems.length > 0 && (
        <div style={{ textAlign: "center", padding: 24, color: "#999" }}>
          到底啦～
        </div>
      )}
    </div>
  )
}
