import React, { useState, useEffect } from "react"
import {
  Table,
  Button,
  Drawer,
  Form,
  Input,
  Tree,
  Checkbox,
  Space,
  Divider,
  Card,
  Typography,
  Row,
  Col,
  Tabs,
  Modal,
  Switch,
  Badge,
  Tooltip,
  Popconfirm,
} from "antd"
import { system } from "@/api"
import { notify } from "@/utils"
import { parseTime } from "@mvmoo/us"
import { usePaginated } from "@mvmoo/react"
// import { usePaginated } from "@/hooks"
import { OperatingArea, Icon, SearchForm, AuthWrap } from "@/components"

const RoleManager = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingRole, setEditingRole] = useState(null)
  const [checkedMenuIds, setCheckedMenuIds] = useState([])
  const [menuTree, setMenuTree] = useState([])

  const {
    data: dataRows,
    loading,
    pagination,
    onSearch,
    onChangePage,
    reload,
  } = usePaginated(system.roles.rows, {
    defaultParams: {},
    manual: false,
  })

  /* 获取菜单树 */
  const fetchMenus = async () => {
    const res = await system.menus.rowsAuth()
    setMenuTree(res.data)
  }

  const openDrawer = (role = null) => {
    setEditingRole(role)
    setCheckedMenuIds(role?.menu_ids)
    setDrawerOpen(true)
  }

  const closeDrawer = () => {
    setEditingRole(null)
    setDrawerOpen(false)
    setCheckedMenuIds([])
  }

  /* 设置角色权限 */
  const handleSave = async () => {
    const { _id } = editingRole
    notify.task({
      text: "权限设置中...",
      final: async () => {
        await system.roles.authorize(_id, { menu_ids: checkedMenuIds })
        reload()
        return "角色权限设置成功"
      },
      errorText: "角色权限设置失败",
    })
    closeDrawer()
  }

  /* 弹窗 */
  const [roleInfo, setRoleInfo] = useState({})

  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = (options) => {
    setRoleInfo(options ? options : {})
    ROLEINFOFORM.resetFields()
    setIsModalOpen(true)

    options?._id
      ? ROLEINFOFORM.setFieldsValue(options)
      : ROLEINFOFORM.setFieldValue("status", 1)
  }
  const handleRoleInfoCancel = () => {
    setIsModalOpen(false)
  }

  const [ROLEINFOFORM] = Form.useForm()
  const handleRoleInfoOk = () => {
    ROLEINFOFORM.validateFields().then((values) => {
      values.status = values.status ? 1 : 0
      console.log("角色信息:", values)
      const { _id, ...args } = values
      notify.task({
        text: "处理中...",
        final: async () => {
          _id
            ? await system.roles.update(_id, args)
            : await system.roles.create(values)
          reload()
          return `角色${_id ? "编辑" : "添加"}成功`
        },
        errorText: `角色${_id ? "编辑" : "添加"}失败`,
      })
      handleRoleInfoCancel()
    })
  }

  /* 删除角色 */
  const delateRole = async (id) => {
    notify.task({
      text: "处理中...",
      final: async () => {
        await system.roles.delete(id)
        reload()
        return "删除成功"
      },
      errorText: "删除失败",
    })
  }

  useEffect(() => {
    fetchMenus()
  }, [])

  return (
    <>
      <OperatingArea
        title="角色管理"
        desc="为不同角色分配访问菜单和操作按钮权限"
      >
        <SearchForm
          right={
            <AuthWrap permission="sgc:system:roles:post">
              <Button type="primary" onClick={() => showModal()}>
                添加角色
              </Button>
            </AuthWrap>
          }
        >
          <Input.Search
            placeholder="搜索角色名称"
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
          { title: "角色名称", dataIndex: "name", align: "center" },
          { title: "角色编码", dataIndex: "code", align: "center" },
          {
            title: "描述",
            dataIndex: "remark",
            align: "center",
            render: (text) => (
              <Tooltip title={text || "暂无描述"}>
                <Typography.Text ellipsis>{text || "暂无描述"}</Typography.Text>
              </Tooltip>
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
            title: "创建时间",
            align: "center",
            dataIndex: "create_time",
            render: (text) => parseTime(text),
          },
          {
            title: "操作",
            fixed: "right",
            align: "center",
            render: (_, record) => (
              <Space>
                <AuthWrap permission="sgc:system:roles:put">
                  <Button type="link" onClick={() => showModal(record)}>
                    编辑
                  </Button>
                </AuthWrap>

                <AuthWrap permission="sgc:system:roles:authorize:put">
                  <Button type="link" onClick={() => openDrawer(record)}>
                    权限设置
                  </Button>
                </AuthWrap>
                <AuthWrap permission="sgc:system:roles:delete">
                  <Popconfirm
                    title="删除角色"
                    description="所有关联该角色的用户登录信息将立即失效, 是否要继续?"
                    onConfirm={() => delateRole(record._id)}
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
        title={roleInfo?._id ? "编辑角色" : "添加角色"}
        open={isModalOpen}
        onOk={handleRoleInfoOk}
        onCancel={handleRoleInfoCancel}
      >
        <Form
          layout="vertical"
          form={ROLEINFOFORM}
          autoComplete="off"
          style={{ padding: "16px 0" }}
        >
          <Form.Item name="_id" noStyle />
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: "请输入角色名称" }]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>

          <Form.Item
            name="code"
            label="角色编码"
            rules={[
              { required: true, message: "请输入角色编码" },
              {
                pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/, // 必须以字母或下划线开头
                message: "只能输入英文字母、数字或下划线，不能以数字开头",
              },
            ]}
          >
            <Input placeholder="请输入角色编码" />
          </Form.Item>

          <Form.Item name="remark" label="角色描述">
            <Input.TextArea
              rows={2}
              placeholder="例如：运营后台管理员、只读权限"
            />
          </Form.Item>

          <Form.Item name="status" label="是否启用" required>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title="设置角色权限"
        width={720}
        open={drawerOpen}
        onClose={closeDrawer}
        extra={
          <Button color="primary" variant="filled" onClick={handleSave}>
            保存
          </Button>
        }
      >
        <Tree
          checkable
          defaultExpandAll
          fieldNames={{ title: "title", key: "_id", children: "children" }}
          treeData={menuTree}
          checkedKeys={checkedMenuIds}
          checkStrictly={true}
          onCheck={(keys) => {
            setCheckedMenuIds(keys.checked)
          }}
          titleRender={(node) => (
            <Space align="start">
              {node.title}
              {node.type === 2 && (
                <Icon
                  name="anquanicon"
                  style={{
                    color: "#fff",
                    width: "12px",
                    height: "12px",
                    background: "#0400ff",
                    transform: "translateY(-15%)",
                  }}
                />
              )}
            </Space>
          )}
        />
      </Drawer>
    </>
  )
}

export default RoleManager
