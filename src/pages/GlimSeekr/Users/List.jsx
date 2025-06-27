import React, { useState } from "react"
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
} from "antd"
import { glimseekr } from "@/api"
import { parseTime, formatBytes } from "@mvmoo/us"
import { OperatingArea, SearchForm, Icon, VirtualMasonry } from "@/components"

const GSUsersList = () => {
  const [USERINFOFORM] = Form.useForm()

  const RenderItem = React.memo(({ item }) => (
    <Badge.Ribbon
      text={{ free: "免费", paid: "付费" }[item?.space?.package_type] || "无"}
      color={
        { free: "green", paid: "blue" }[item?.space?.package_type] || "#e6e6e6"
      }
    >
      <Card
        title={
          <Space>
            <Avatar
              src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${item._id}`}
            />
            <Typography.Text strong>
              {`${item.nickname || "暂无昵称"} (${item.phone})`}
            </Typography.Text>
          </Space>
        }
        size="small"
        style={{ width: "100%" }}
      >
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          <Typography.Text type="secondary">ID: {item._id}</Typography.Text>
          {item?.space?.bucket && (
            <Typography.Text type="secondary">
              桶: {item?.space?.bucket}
            </Typography.Text>
          )}

          <Space size={12}>
            <Typography.Text type="secondary">
              <Icon name="flshuju" style={{ margin: '0 4px 3px 0', width: 14 }} />
              总空间 {formatBytes(item?.space?.total_storage_limit)}
            </Typography.Text>
            <Typography.Text type="secondary">
              <Icon name="liuliang1" style={{ margin: '0 4px 3px 0', width: 14 }} />
              已使用 {formatBytes(item?.space?.used_storage)}
            </Typography.Text>
            <Typography.Text type="secondary">
              <Icon
                name="gongxiangliuliangbao"
                style={{ margin: '0 4px 3px 0', width: 14 }}
              />
              资源包 {formatBytes(item?.space?.extra_storage)}
            </Typography.Text>
          </Space>
          <Space style={{ width: "100%", justifyContent: "space-between" }}>
            <Typography.Text code type="secondary">
              注册时间:{" "}
              {item?.create_time ? parseTime(item?.create_time) : "--:--:--"}
            </Typography.Text>
            <a>操作</a>
          </Space>
        </Space>
      </Card>
    </Badge.Ribbon>
  ))
  const [queryParams, setQueryParams] = useState({})
  const [headerHeight, setHeaderHeight] = useState(0)
  return (
    <>
      <OperatingArea
        title="用户管理"
        desc="芥光寻影 · 中台 · 用户中心"
        onHeightChange={(h) => setHeaderHeight(h)}
      >
        <SearchForm
          onSearch={(e) => setQueryParams(e)}
          right={
            <Button type="primary" onClick={() => {}}>
              添加用户
            </Button>
          }
        >
          <Form.Item name="nickname">
            <Input placeholder="用户昵称" allowClear />
          </Form.Item>
          <Form.Item name="phone">
            <Input placeholder="手机号" allowClear />
          </Form.Item>
        </SearchForm>
      </OperatingArea>

      <VirtualMasonry
        style={{
          height: `calc(100% - ${headerHeight}px)`,
          padding: "var(--distance) calc(var(--distance) * 2)",
        }}
        fetchPage={glimseekr.ulist.rows}
        defaultParams={queryParams}
        getItemId={(item) => item._id}
        pageSize={20}
        columnCount={3}
        renderItem={(item) => <RenderItem item={item} />}
      />
    </>
  )
}

export default GSUsersList
