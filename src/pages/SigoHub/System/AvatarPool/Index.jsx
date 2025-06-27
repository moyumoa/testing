import React, { useState, useCallback } from "react"
import {
  Button,
  Form,
  Input,
  Space,
  Card,
  Typography,
  Avatar,
  Badge,
  Spin,
  Modal,
  Image,
} from "antd"
import { system } from "@/api"
import { notify } from "@/utils"
import {
  OperatingArea,
  SearchForm,
  AuthWrap,
  VirtualMasonry,
} from "@/components"
import styles from "./index.module.scss"
import { EditOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons"
import { useImageUploader } from "@/hooks"

const AvatarPool = () => {
  const [refreshKey, setRefreshKey] = useState(0)
  const { open, uploading } = useImageUploader()
  const handleUpload = () => {
    open({
      multiple: true,
      onComplete: async (results) => {
        console.log("上传结果", results)
        // for (const file of results) {
        //   try {
        //     await system.avatarPool.upload(file)
        //   } catch (err) {
        //     console.error("上传失败", err)
        //     notify.error("头像上传失败")
        //   }
        // }
        setRefreshKey((k) => k + 1) // 🚀 触发刷新
      },
      onEachComplete: async (img) => {
        try {
          await system.avatarPool.upload(img)
        } catch (err) {
          console.error("上传失败", err)
          notify.error("头像上传失败")
        }
      },
    })
  }

  const [deleteLoading, setDeleteLoading] = useState(false)
  const deleteAvatar = async (item, remove) => {
    setDeleteLoading(true)
    await notify.task({
      text: "正在删除头像，请稍候...",
      final: async () => {
        await system.avatarPool.delete(item._id)
        // setRefreshKey((k) => k + 1)
        // 手动从列表中删除
        await remove(item._id)
        return "头像删除成功"
      },
    })
    setDeleteLoading(false)
  }

  const [previewUrl, setPreviewUrl] = useState(null)

  const previewAvatar = useCallback((item) => {
    const url = `${item.url}?imageMogr2/interlace/1`
    if (url) setPreviewUrl(url)
  }, [])

  const RenderItem = React.memo(({ item, remove }) => {
    const ratio =
      item.originalWidth && item.originalHeight
        ? `${item.originalWidth}/${item.originalHeight}`
        : "1/1"
    return (
      <div className={styles.avatar_item}>
        <img
          src={`${item.url}?imageMogr2/interlace/1`}
          alt=""
          style={{
            width: "100%",
            aspectRatio: ratio,
            objectFit: "cover",
            // borderRadius: "var(--distance)",
          }}
          className={styles.avatar_item_img}
        />
        <div className={styles.avatar_item_active}>
          <Space>
            <Button
              color="#"
              style={{ color: "#fff", fontSize: 18 }}
              variant="text"
              icon={<EyeOutlined />}
              iconPosition="start"
              onClick={() => previewAvatar(item)}
            ></Button>
            <AuthWrap permission="sgc:system:avatar:delete">
              <Button
                loading={deleteLoading}
                color="#"
                style={{ color: "#f00", fontSize: 17 }}
                variant="text"
                icon={<DeleteOutlined />}
                iconPosition="start"
                onClick={() => deleteAvatar(item, remove)}
              ></Button>
            </AuthWrap>
          </Space>
        </div>
      </div>
    )
  })
  const [queryParams] = useState({})
  const [headerHeight, setHeaderHeight] = useState(0)
  return (
    <>
      <OperatingArea
        title="系统头像池"
        desc="头像池中的头像将会被随机分配给全平台新注册用户"
        onHeightChange={(h) => setHeaderHeight(h)}
      >
        <SearchForm
          right={
            <AuthWrap permission="sgc:system:avatar:post">
              <Button
                type="primary"
                loading={uploading}
                onClick={() => handleUpload()}
              >
                上传头像
              </Button>
            </AuthWrap>
          }
        >
          {/* <Input.Search
            placeholder="头像名称"
            style={{ width: 240 }}
            allowClear
            onSearch={(val) => setQueryParams({ name: val })}
          /> */}
        </SearchForm>
      </OperatingArea>

      <VirtualMasonry
        style={{
          height: `calc(100% - ${headerHeight}px)`,
          padding: "var(--distance) calc(var(--distance) * 2)",
        }}
        fetchPage={system.avatarPool.rows}
        // defaultParams={queryParams}
        defaultParams={{ ...queryParams, t: refreshKey }}
        getItemId={(item) => item._id}
        pageSize={20}
        columnCount={5}
        renderItem={(item, { remove }) => (
          <RenderItem item={item} remove={remove} />
        )}
      />

      {previewUrl && (
        <Modal
          open={!!previewUrl}
          footer={null}
          onCancel={() => setPreviewUrl(null)}
          centered
          closable={false}
          className="no-padding-modal"
          // width={400}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              // height: 360,
            }}
          >
            <Image
              src={previewUrl}
              // 不显示预览按钮
              preview={false}
              alt="头像预览"
              style={{ maxWidth: "100%", borderRadius: 'var(--distance)' }}
            />
          </div>
        </Modal>
      )}
    </>
  )
}

export default AvatarPool
