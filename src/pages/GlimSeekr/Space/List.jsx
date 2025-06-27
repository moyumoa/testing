import { VirtualMasonry } from "@/components"
import { glimseekr } from "@/api"

export default function PageImageList() {
  return (
    <VirtualMasonry
      fetchPage={glimseekr.tempImgList}
      getItemId={(item) => item._id}
      pageSize={4}
      columnCount={4}
      renderItem={(item) => (
        <>
          <img
            src={item.thumb_url}
            alt=""
            style={{ width: "100%", display: "block" }}
          />
          <div style={{ padding: 8 }}>
            <div>{item.name}</div>
            <div style={{ color: "#999", fontSize: 12 }}>
              {item.create_time}
            </div>
          </div>
        </>
      )}
    />
  )
}
