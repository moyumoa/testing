// hooks/useImageUploader.js
import { useCallback, useEffect, useRef, useState } from "react"
import { uploadToQiniu, qiniuToken as getQiniuTokenApi } from "@/api"
import Compressor from "compressorjs"
import { v4 as uuidv4 } from "uuid"
import { parseTime } from "@mvmoo/us"

// 全局 input 实例和上传锁
let sharedInput = null
let inputCreated = false
let isUploading = false

export function useImageUploader() {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  const uploadTokenRef = useRef("")
  const onCompleteRef = useRef(null)
  const onEachCompleteRef = useRef(null)
  const compressOptionsRef = useRef(null)

  // 初始化 input
  useEffect(() => {
    if (!inputCreated) {
      sharedInput = document.createElement("input")
      sharedInput.type = "file"
      sharedInput.style.display = "none"
      sharedInput.accept =
        "image/jpeg, image/png, image/gif, image/webp, image/svg+xml"
      document.body.appendChild(sharedInput)
      inputCreated = true
    }
    // 内联异步函数直接调用
    ;(async () => {
      const res = await getQiniuTokenApi()
      uploadTokenRef.current = res.data.uploadToken
    })()
  }, [])

  const isValidImage = (file) => {
    return (
      file.type.startsWith("image/") &&
      /\.(jpe?g|png|gif|webp|svg)$/i.test(file.name)
    )
  }

  const handleUpload = useCallback(async (files) => {
    if (isUploading) {
      setError("已有上传任务，请稍候再试")
      return
    }

    isUploading = true
    setUploading(true)
    setError(null)

    const resultList = []

    try {
      for (const file of files) {
        try {
          const result = await uploadToServer(file, {
            uploadToken: uploadTokenRef.current,
            compressOptions: compressOptionsRef.current,
          })
          resultList.push(result)

          // 🆕 新增：上传完成一张就通知外部
          if (typeof onEachCompleteRef.current === "function") {
            onEachCompleteRef.current(result) // 🔔 逐张通知
          }
        } catch (err) {
          console.error("上传失败:", err)
          setError(err.message || "上传失败")
        }
      }

      if (typeof onCompleteRef.current === "function") {
        onCompleteRef.current(resultList)
      }
    } finally {
      setUploading(false)
      isUploading = false
      sharedInput.value = null
    }
  }, [])

  const onSelect = useCallback(
    async (e) => {
      const files = Array.from(e.target.files || [])
      const validFiles = files.filter(isValidImage)
      if (!validFiles.length) {
        setError("请选择有效图片文件")
        return
      }

      await handleUpload(validFiles)
    },
    [handleUpload]
  )

  /**
   * open - 打开上传文件选择器
   *
   * @param {Object} options
   * @param {boolean} [options.multiple=true]
   * @param {function} options.onComplete 成功后的回调 (results) => void
   * @param {Object} [options.compressOptions] { quality: 0.8, maxWidth: 1440 }
   */
  const open = ({
    multiple = true,
    onComplete,
    onEachComplete,
    compressOptions = null,
  } = {}) => {
    if (isUploading) {
      setError("上传中，请等待完成")
      return
    }

    if (!sharedInput) {
      setError("上传组件初始化中，请稍候再试")
      console.warn("📛 sharedInput 尚未初始化完成")
      return
    }

    onCompleteRef.current = onComplete
    onEachCompleteRef.current = onEachComplete
    compressOptionsRef.current = compressOptions
    sharedInput.multiple = multiple

    sharedInput.onchange = null
    sharedInput.removeEventListener("change", onSelect)
    sharedInput.addEventListener("change", onSelect, { once: true })
    sharedInput.click()
  }

  return {
    open,
    uploading,
    error,
  }
}

function getImageSizeSafe(file, fallbackWidth = 800, fallbackHeight = 800) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = function (event) {
      const img = new Image()
      img.onload = function () {
        resolve({
          width: img.width,
          height: img.height,
          source: "local",
        })
      }
      img.onerror = function () {
        console.warn("⚠️ 图片加载失败，使用默认尺寸")
        resolve({
          width: fallbackWidth,
          height: fallbackHeight,
          source: "fallback",
        })
      }
      img.src = event.target.result
    }
    reader.onerror = function () {
      console.warn("⚠️ 文件读取失败，使用默认尺寸")
      resolve({
        width: fallbackWidth,
        height: fallbackHeight,
        source: "fallback",
      })
    }
    reader.readAsDataURL(file)
  })
}

// 上传核心逻辑
const mimeToExt = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/svg+xml": "svg",
}

async function uploadToServer(file, { uploadToken, compressOptions }) {
  const { name, size, type, lastModified } = file
  const ext = mimeToExt[type] || "jpg"
  const baseKey = `backstage/images/${parseTime(
    Date.now(),
    "{y}{m}{d}"
  )}/${uuidv4()}`
  const originalKey = `${baseKey}.${ext}`
  const thumbKey = `${baseKey}-thumb.${ext}`

  // ⭐️ 读取图片尺寸（原图）
  const { width, height, source: sizeSource } = await getImageSizeSafe(file)

  // 原图上传
  const originalRes = await uploadToQiniu(file, originalKey, uploadToken)
  const originalUrl = originalRes.key

  let thumbUrl = null
  let thumbSize = null
  let thumbWidth = null
  let thumbHeight = null

  if (compressOptions && compressOptions.quality) {
    const compressedFile = await new Promise((resolve, reject) => {
      new Compressor(file, {
        ...compressOptions,
        success: resolve,
        error: reject,
      })
    })

    const sizeInfo = await getImageSizeSafe(compressedFile)
    thumbWidth = sizeInfo.width
    thumbHeight = sizeInfo.height

    const thumbRes = await uploadToQiniu(compressedFile, thumbKey, uploadToken)
    thumbUrl = thumbRes.key
    thumbSize = compressedFile.size
  }

  return {
    name,
    size,
    type,
    ext,
    hash: originalRes.hash,
    lastModified,
    width,
    height,
    url: originalUrl,
    source: sizeSource,
    ...(compressOptions?.quality && {
      original_url: originalUrl,
      thumb_url: thumbUrl,
      thumb_size: thumbSize,
      thumb_width: thumbWidth,
      thumb_height: thumbHeight,
      thumb_source: sizeSource,
    }),
  }
}

/* 
使用示例
import { useImageUploader } from "@/hooks/useImageUploader"
const { open, uploading, error } = useImageUploader()
const handleUpload = () => {
    open({
      multiple: true,
      // compressOptions: {
      //   quality: 0.8,
      //   maxWidth: 1440,
      // },
      onEachComplete: (img) => {
      console.log("📸 单张完成：", img)
      // 这里可以插入 UI、发送数据、插入数据库等操作
      },
      onComplete: (all) => {
        console.log("✅ 所有图上传完成：", all)
      },
    })
  }
*/
