import { VirtualWaterfall } from "@/components"
import { glimseekr } from "@/api"

export default function PageImageList() {
  return (
    <VirtualWaterfall
      fetchPage={glimseekr.tempImgList}
      getItemId={(item) => item._id}
      getImageSrc={(item) => item.thumb_url}
      columnCount={5}
      renderItem={(item) => (
        <>
          <div>{item.name}</div>
          <div>{item.name}</div>
          <div>{item.name}</div>
          <div>{item.name}</div>
          <div>{item.name}</div>
          <div>{item.name}</div>
          <div style={{ color: "#aaa", fontSize: 12 }}>{item.create_time}</div>
        </>
      )}
    />
  )
}
