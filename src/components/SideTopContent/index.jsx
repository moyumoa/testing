import { useSelector } from "react-redux"
import styles from "./index.module.scss"
const Index = () => {
  const { SgcAgingTime } = useSelector((state) => state.user)

  return (
    <div className={styles.side_top_content}>
      {SgcAgingTime ? (
        <div className={styles.title}>
          <span className={styles.title_t1}>登录凭证</span>
          <span className={styles.title_t2}>{SgcAgingTime}</span>
          <span className={styles.title_t1}>内有效</span>
        </div>
      ) : (
        <div className={styles.title}>· SigoHub · Platform ·</div>
      )}
    </div>
  )
}
export default Index
