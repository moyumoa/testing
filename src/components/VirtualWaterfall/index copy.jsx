import React, { useCallback, useEffect, useRef, useState } from "react"

const PAGE_BUFFER = 3
const GUTTER = 16
const VIEWPORT_BUFFER = 1000
const VERTICAL_GAP = 16
const HORIZONTAL_GAP = 16

export default function VirtualWaterfall({
  fetchPage,
  getItemId,
  getImageSrc,
  renderItem,
  pageSize = 20,
  columnCount = 4,
}) {
  const containerRef = useRef(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [scrollTop, setScrollTop] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight)
  const [, forceRerender] = useState(0)
  const imgRatiosRef = useRef({})
  const extraHeightRef = useRef({})
  const pagesRef = useRef(new Map())
  const loadingRef = useRef(false)

  const columnWidth =
    (containerWidth - (columnCount - 1) * HORIZONTAL_GAP) / columnCount

  const loadPage = useCallback(
    async (page) => {
      if (pagesRef.current.has(page) || loadingRef.current) return
      loadingRef.current = true
      try {
        const res = await fetchPage({ page, limit: pageSize })
        const list = res?.data?.rows || res?.data?.list || res?.data || []
        pagesRef.current.set(page, list)
        forceRerender((n) => n + 1)
      } finally {
        loadingRef.current = false
      }
    },
    [fetchPage, pageSize]
  )

  useEffect(() => {
    const resizeObserver = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width)
    })
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }
    return () => resizeObserver.disconnect()
  }, [])

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
          const currentPage = Math.floor(y / 1600) + 1
          for (
            let i = currentPage - PAGE_BUFFER;
            i <= currentPage + PAGE_BUFFER;
            i++
          ) {
            if (i >= 1) loadPage(i)
          }
          ticking = false
        })
        ticking = true
      }
    }
    el.addEventListener("scroll", onScroll)
    return () => el.removeEventListener("scroll", onScroll)
  }, [loadPage])

  useEffect(() => {
    if (containerWidth > 0 && pagesRef.current.size === 0) {
      loadPage(1)
    }
  }, [containerWidth, loadPage])

  const onImageLoad = (id, e) => {
    const { naturalWidth, naturalHeight } = e.target
    const ratio = naturalHeight / naturalWidth
    if (imgRatiosRef.current[id] !== ratio) {
      imgRatiosRef.current[id] = ratio
      forceRerender((n) => n + 1)
    }
  }

  const allItems = Array.from(pagesRef.current.values()).flat()
  const cols = Array.from({ length: columnCount }, () => 0)

  const positionedItems = allItems.map((item) => {
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

  const containerHeight =
    Math.max(...positionedItems.map((i) => i.top + i.height), 0) + 48

  const visibleItems = positionedItems.filter(
    (i) =>
      i.top + i.height >= scrollTop - VIEWPORT_BUFFER &&
      i.top <= scrollTop + viewportHeight + VIEWPORT_BUFFER
  )

  const measureExtra = (id, node) => {
    if (node && extraHeightRef.current[id] !== node.offsetHeight) {
      extraHeightRef.current[id] = node.offsetHeight
      forceRerender((n) => n + 1)
    }
  }

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
        {visibleItems.map((item) => (
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
              onLoad={(e) => onImageLoad(item._id, e)}
              loading="lazy"
            />
            <div
              ref={(el) => measureExtra(item._id, el)}
              style={{ padding: 8 }}
            >
              {renderItem(item)}
            </div>
          </div>
        ))}
      </div>

      {allItems.length === 0 && (
        <div style={{ textAlign: "center", padding: 48, color: "#aaa" }}>
          正在加载中...
        </div>
      )}
    </div>
  )
}
