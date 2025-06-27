import React, { useState, forwardRef, useCallback } from "react"
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
import { parseTime } from "@mvmoo/us"
import { usePaginated } from "@/hooks"
import { OperatingArea, SearchForm, Icon } from "@/components"
import { VirtuosoGrid } from "react-virtuoso"

const GSUsersList = () => {
  const [USERINFOFORM] = Form.useForm()

  const {
    data: dataRows,
    loading,
    pagination,
    onSearch,
    loadNextPage,
    hasMore,
  } = usePaginated(glimseekr.ulist.rows, {
    defaultParams: {},
    manual: false,
    defaultPagination: {
      page: 1,
      limit: 9,
    },
  })

  // ✅ 自定义 List 和 Item 组件
  const gridComponents = {
    List: forwardRef(({ style, children, ...props }, ref) => (
      <div
        ref={ref}
        {...props}
        style={{
          display: "flex",
          flexWrap: "wrap",
          margin: "0 calc(var(--distance) * 1)",
          ...style,
        }}
      >
        {children}
      </div>
    )),
    Item: ({ children, ...props }) => (
      <div
        {...props}
        style={{
          width: "33.3333%",
          padding: "0 calc(var(--distance) * 1) calc(var(--distance) * 1)",
          boxSizing: "border-box",
        }}
      >
        {children}
      </div>
    ),
    Footer: () => (loading ? <Spin /> : null),
  }

  const [headerHeight, setHeaderHeight] = useState(0)
  return (
    <>
      <OperatingArea
        title="用户管理"
        desc="芥光寻影 · 中台 · 用户中心"
        onHeightChange={(h) => setHeaderHeight(h)}
      >
        <SearchForm
          onSearch={onSearch}
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

      <VirtuosoGrid
        style={{ height: `calc(100% - ${headerHeight}px)` }}
        data={dataRows}
        components={gridComponents}
        endReached={() => {
          if (hasMore && !loading) loadNextPage()
        }}
        itemContent={useCallback(
          (index, item) => (
            <Badge.Ribbon
              text={
                { free: "免费", paid: "付费" }[item?.space?.package_type] ||
                "无"
              }
              color={
                { free: "green", paid: "blue" }[item?.space?.package_type] ||
                "#e6e6e6"
              }
            >
              <Card
                title={
                  <Space>
                    <Avatar
                      src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${item._id}`}
                    />
                    <Typography.Text strong>
                      {headerHeight}
                      {`${item.nickname || "暂无昵称"} (${item.phone})`}
                    </Typography.Text>
                  </Space>
                }
                size="small"
                style={{ width: "100%" }}
              >
                <Space direction="vertical" size={16} style={{ width: "100%" }}>
                  <Typography.Text type="secondary">
                    ID: {item._id}
                  </Typography.Text>
                  <Space size={12}>
                    <Typography.Text type="secondary">
                      <Icon
                        name="flshuju"
                        style={{ marginRight: 4, width: 14 }}
                      />
                      总空间 {item?.space?.total_storage_limit || "0"}
                    </Typography.Text>
                    <Typography.Text type="secondary">
                      <Icon
                        name="liuliang1"
                        style={{ marginRight: 4, width: 14 }}
                      />
                      已使用 {item?.space?.total_storage_limit || "0"}
                    </Typography.Text>
                    <Typography.Text type="secondary">
                      <Icon
                        name="gongxiangliuliangbao"
                        style={{ marginRight: 4, width: 14 }}
                      />
                      资源包 {item?.space?.total_storage_limit || "0"}
                    </Typography.Text>
                  </Space>
                  <Space
                    style={{ width: "100%", justifyContent: "space-between" }}
                  >
                    <Typography.Text code type="secondary">
                      注册时间:{" "}
                      {item?.create_time
                        ? parseTime(item?.create_time)
                        : "--:--:--"}
                    </Typography.Text>
                    <a>操作</a>
                  </Space>
                </Space>
              </Card>
            </Badge.Ribbon>
          ),
          []
        )}
      />
    </>
  )
}

export default GSUsersList
