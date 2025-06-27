import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react"
import styles from "./index.module.scss"
import { Icon } from "@/components"

const FlipCard = forwardRef(
  (
    {
      frontContent,
      backContent,
      backTitle,
      showBack = true,
      backButtonText = "返回",
      onBack,
    },
    ref
  ) => {
    const frontRef = useRef(null)
    const backRef = useRef(null)
    const [isFlipped, setIsFlipped] = useState(false)
    const [containerHeight, setContainerHeight] = useState(0)

    const updateHeight = useCallback(() => {
      const el = isFlipped ? backRef.current : frontRef.current
      if (el) {
        setContainerHeight(el.offsetHeight)
      }
    }, [isFlipped])

    // ✅ ResizeObserver 替代 window.resize
    useEffect(() => {
      const el = isFlipped ? backRef.current : frontRef.current
      if (!el) return

      const setupObserver = async () => {
        const ResizeObs =
          window.ResizeObserver ||
          (await import("resize-observer-polyfill")).default

        const observer = new ResizeObs(() => {
          updateHeight()
        })

        observer.observe(el)
        updateHeight()

        return () => {
          observer.disconnect()
        }
      }

      let cleanup

      setupObserver().then((cleanupFn) => {
        cleanup = cleanupFn
      })

      return () => {
        cleanup?.()
      }
    }, [isFlipped, updateHeight])

    // ✅ 暴露方法给父组件
    useImperativeHandle(ref, () => ({
      flipToFront: () => setIsFlipped(false),
      flipToBack: () => setIsFlipped(true),
      toggle: () => setIsFlipped((prev) => !prev),
    }))

    return (
      <div
        className={`${styles.cardContainer} ${isFlipped ? styles.flipped : ""}`}
        style={{ height: `${containerHeight}px` }}
      >
        <div
          className={`${styles.cardFace} ${styles.cardFront}`}
          ref={frontRef}
        >
          {typeof frontContent === "function"
            ? frontContent({
                flip: (payload) => {
                  console.log("front flip triggered with", payload)
                  setIsFlipped(true)
                },
              })
            : frontContent}
        </div>
        <div className={`${styles.cardFace} ${styles.cardBack}`} ref={backRef}>
          {showBack && (
            <>
              <div className={styles.backHeader}>
                <div
                  className={styles.backButton}
                  onClick={() => {
                    onBack?.()
                    setIsFlipped(false)
                  }}
                >
                  <i className={styles.backButton_icon}>
                    <Icon name="ah5taocan" size="14" />
                  </i>
                  <span className={styles.backButton_text}>
                    {backButtonText}
                  </span>
                </div>

                <div className={styles.backTitle}>{backTitle}</div>
                <div className={styles.backOper}>保存</div>
              </div>
              <div className={styles.backMain}>
                {typeof backContent === "function"
                  ? backContent({ flip: () => setIsFlipped(false) })
                  : backContent}
              </div>
            </>
          )}
        </div>
      </div>
    )
  }
)

export default FlipCard
