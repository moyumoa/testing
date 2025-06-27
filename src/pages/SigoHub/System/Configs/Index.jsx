import React, { useState } from "react"
import {
  Table,
  Button,
  Drawer,
  Form,
  Input,
  Space,
  Modal,
  Popconfirm,
  Typography,
  Switch,
  Badge,
} from "antd"
import { system } from "@/api"
import { notify } from "@/utils"
import { parseTime } from "@mvmoo/us"
import { usePaginated } from "@mvmoo/react"
import { OperatingArea, SearchForm, AuthWrap } from "@/components"

const SysConfigs = () => {
  const {
    data: dataRows,
    loading,
    pagination,
    onSearch,
    onChangePage,
    reload,
  } = usePaginated(system.configs.rows, {
    defaultParams: {},
    manual: false,
  })

  /* 弹窗 */
  const [tempInfo, setTempInfo] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [DIALOGFORM] = Form.useForm()

  const showModal = (options) => {
    setTempInfo(options || {})
    DIALOGFORM.resetFields()
    setIsModalOpen(true)

    if (options?._id) {
      // 如果有 _id 说明是编辑状态
      const formattedValue = Object.entries(options.value).map(
        ([key, value]) => ({
          key,
          value,
        })
      )
      DIALOGFORM.setFieldsValue({
        ...options,
        value: formattedValue,
      })
    } else {
      // 如果是新增状态，设置默认值
      DIALOGFORM.setFieldValue("status", 1)
    }
  }

  const handleRoleInfoCancel = () => {
    setIsModalOpen(false)
  }

  const handleRoleInfoOk = () => {
    DIALOGFORM.validateFields().then((values) => {
      values.status = values.status ? 1 : 0
      const { _id, value, ...args } = values
      notify.task({
        text: "处理中...",
        final: async () => {
          // 处理 value 为对象的情况
          const formattedValue = value.reduce((acc, curr) => {
            acc[curr.key] = curr.value
            return acc
          }, {})

          const finalData = { ...args, value: formattedValue }

          if (_id) {
            await system.configs.update(_id, finalData)
          } else {
            await system.configs.create(finalData)
          }
          reload()
          return `资源${_id ? "编辑" : "添加"}成功`
        },
        errorText: `资源${_id ? "编辑" : "添加"}失败`,
      })
      handleRoleInfoCancel()
    })
  }

  /* 删除 */
  const delateRow = async (id) => {
    notify.task({
      text: "处理中...",
      final: async () => {
        await system.configs.delete(id)
        reload()
        return "删除成功"
      },
      errorText: "删除失败",
    })
  }

  return (
    <>
      <OperatingArea title="资源配置" desc="为系统所使用第三方资源信息进行配置">
        <SearchForm
          right={
            <AuthWrap permission="sgc:system:configs:post">
              <Button type="primary" onClick={() => showModal()}>
                添加资源配置
              </Button>
            </AuthWrap>
          }
        >
          <Input.Search
            placeholder="搜索资源名称"
            style={{ width: 240 }}
            allowClear
            onSearch={(val) => onSearch({ name: val })}
          />
        </SearchForm>
      </OperatingArea>

      <Table
        rowKey="_id"
        scroll={{ x: "max-content" }}
        tableLayout="fixed"
        loading={loading}
        dataSource={dataRows}
        pagination={{
          current: pagination.page,
          pageSize: pagination.limit,
          total: pagination.total,
          showSizeChanger: true,
          onChange: onChangePage,
        }}
        columns={[
          { title: "Id", dataIndex: "_id", align: "center" },
          { title: "配置名称", dataIndex: "name", align: "center" },
          { title: "所属类型", dataIndex: "type", align: "center" },
          {
            title: "描述",
            dataIndex: "remark",
            align: "center",
            render: (text) => (
              <Typography.Text ellipsis>{text || "暂无描述"}</Typography.Text>
            ),
          },
          {
            title: "状态",
            dataIndex: "status",
            align: "center",
            render: (text) => (
              <Space>
                <Badge status={text ? "success" : "default"} />
                <Typography.Text>{text ? "启用" : "停用"}</Typography.Text>
              </Space>
            ),
          },
          {
            title: "更新时间",
            align: "center",
            dataIndex: "update_time",
            render: (text) => parseTime(text),
          },
          {
            title: "操作",
            fixed: "right",
            align: "center",
            render: (_, record) => (
              <Space>
                <AuthWrap permission="sgc:system:configs:put">
                  <Button type="link" onClick={() => showModal(record)}>
                    编辑
                  </Button>
                </AuthWrap>
                <AuthWrap permission="sgc:system:configs:delete">
                  <Popconfirm
                    title="删除资源"
                    description="所有关联该资源的配置项将立即失效, 是否要继续?"
                    onConfirm={() => delateRow(record._id)}
                    onCancel={() => {}}
                    okText="确认删除"
                    okType="danger"
                    cancelText="取消"
                  >
                    <Button color="danger" variant="link">
                      删除
                    </Button>
                  </Popconfirm>
                </AuthWrap>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title={tempInfo?._id ? "编辑资源" : "添加资源"}
        open={isModalOpen}
        onOk={handleRoleInfoOk}
        onCancel={handleRoleInfoCancel}
      >
        <Form
          layout="vertical"
          form={DIALOGFORM}
          autoComplete="off"
          style={{ margin: "16px 0" }}
        >
          <Form.Item name="_id" noStyle />
          <Form.Item
            name="name"
            label="资源名称"
            rules={[{ required: true, message: "请输入资源名称" }]}
          >
            <Input placeholder="请输入资源名称" />
          </Form.Item>

          <Form.Item
            name="type"
            label="资源类型"
            rules={[
              { required: true, message: "请输入资源类型" },
              {
                pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/,
                message: "只能输入英文字母、数字或下划线，不能以数字开头",
              },
            ]}
          >
            <Input placeholder="请输入资源类型" />
          </Form.Item>

          <Form.Item name="value" label="资源配置项">
            <Form.List
              name="value"
              rules={[
                {
                  validator: async (_, names) => {
                    if (!names || names.length < 1) {
                      return Promise.reject(new Error("至少添加一项配置"))
                    }
                  },
                },
              ]}
            >
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      style={{ display: "flex", marginBottom: 8 }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "key"]}
                        rules={[
                          { required: true, message: "请输入配置项的key" },
                        ]}
                      >
                        <Input placeholder="请输入配置项的key" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "value"]}
                        rules={[
                          { required: true, message: "请输入配置项的value" },
                        ]}
                      >
                        <Input placeholder="请输入配置项的value" />
                      </Form.Item>
                      <Button type="link" onClick={() => remove(name)}>
                        删除
                      </Button>
                    </Space>
                  ))}

                  <Form.Item>
                    <Button type="dashed" onClick={() => add()}>
                      添加配置项
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>

          <Form.Item name="remark" label="资源描述">
            <Input.TextArea rows={2} placeholder="请输入资源描述" />
          </Form.Item>

          <Form.Item name="status" label="是否启用" required>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default SysConfigs
