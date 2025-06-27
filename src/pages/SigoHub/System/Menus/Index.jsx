// import { useRouterControl } from "@/router/RouterContext"
import React, { useState, useEffect } from "react"

import { system } from "@/api"
import { notify } from "@/utils"
import { AuthWrap, Icon, OperatingArea } from "@/components"
import { PlusOutlined } from "@ant-design/icons"
import {
  Tree,
  Button,
  Col,
  InputNumber,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  Space,
  Radio,
  Switch,
  Typography,
  Popconfirm,
  Spin,
} from "antd"

const Index = () => {
  const [treeData, setTreeData] = useState([])
  const [loadingTree, setLoadingTree] = useState(true)

  /* 获取菜单 */
  const getMenus = async () => {
    setLoadingTree(true)
    const res = await system.menus.rows()
    setTreeData(res.data)
    setLoadingTree(false)
  }

  /* 编辑 目录/菜单/权限 */
  const editMenu = (_, { node }) => {
    const text = node.title
    setDrawerTitle(`编辑 ${text}`)
    showDrawer()
    formEl && formEl.setFieldsValue(node)
  }

  /* 操作抽屉 */
  const [drawerTitle, setDrawerTitle] = useState("")
  const [open, setOpen] = useState(false)
  const showDrawer = () => {
    formEl.resetFields()
    setOpen(true)
  }
  const onClose = () => {
    setOpen(false)
  }

  /* 添加 目录/菜单/权限 */
  const addSubMenu = ({ title, node }) => {
    console.log("添加菜单:", node)

    setDrawerTitle(title)
    showDrawer()
    formEl.setFieldsValue({
      type: node.type || 1,
      is_enable: true,
      is_show: true,
      ...(node._id && { parent_id: node._id, sort: node.children?.length + 1 }),
      ...(node.type === 2 && { parent_id: node.nodeData._id }),
      ...(node?.children?.length > 0 && { children: node?.children || [] }),
    })
  }

  /* 删除菜单 */
  const delMenus = (row) => {
    console.log("删除菜单:", row)
    if (row.children && row.children.length > 0) {
      notify.msg.error("请先删除子菜单")
      return
    }

    notify.task({
      text: "正在删除菜单...",
      final: async () => {
        await system.menus.delete(row._id)
        await getMenus()
        return "删除成功"
      },
    })
  }

  /* 表单操作 */
  const [formEl] = Form.useForm()
  const isMenuChildren = Form.useWatch("children", formEl)
  const menuType = Form.useWatch("type", formEl)
  // const isId = Form.useWatch("_id", formEl)
  const onSubmit = () => {
    formEl
      .validateFields()
      .then((values) => {
        console.log("校验成功:", values)
        notify.task({
          text: "数据处理中...",
          final: async () => {
            // 删除values.children
            const { children: _children, ...args } = values
            args.icon = args.icon || ""
            if (args?._id) {
              await system.menus.update(args._id, args)
              // 手动修改 treeData 中的那一项
              const newTree = updateNode(treeData, args._id, args)
              setTreeData(newTree)
            } else {
              await system.menus.create(args)
              await getMenus()
            }
            setTimeout(() => onClose(), 0)
            return args?._id ? "编辑成功" : "添加成功"
          },
        })
      })
      .catch(() => {
        notify.msg.error("请检查表单数据")
      })
  }

  /* 图标列表 */
  const [iconNames, setIconNames] = useState([])

  useEffect(() => {
    getMenus()

    const icons = import.meta.glob("@/assets/svg/*.svg")
    const iconNames = Object.keys(icons).map((filePath) => {
      // 提取文件名（不包括路径和扩展名
      const fileName = filePath.split("/").pop().split(".")[0]
      return {
        icon: fileName,
        label: (
          <span>
            <Icon name={fileName} style={{ marginRight: "5px" }} />
            {fileName}
          </span>
        ),
      }
    })
    setIconNames(iconNames)
  }, [])

  /* 手动更新菜单 */
  const updateNode = (list, id, newData) => {
    return list.map((item) => {
      if (item._id === id) {
        return {
          ...item,
          ...newData, // 只更新你传过来的字段
        }
      }
      if (item.children) {
        return {
          ...item,
          children: updateNode(item.children, id, newData),
        }
      }
      return item
    })
  }

  return (
    <>
      <OperatingArea title="菜单管理" desc="动态路由菜单, 操作权限标识">
        <AuthWrap permission="sgc:system:menus:post">
          <Button
            color="primary"
            variant="filled"
            onClick={() => addSubMenu({ title: "添加菜单", node: {} })}
            icon={<PlusOutlined />}
          >
            添加菜单
          </Button>
        </AuthWrap>
      </OperatingArea>

      <Spin spinning={!treeData.length}>
        {!loadingTree ? (
          <Tree
            showLine
            defaultExpandAll
            treeData={treeData}
            fieldNames={{
              title: "title",
              key: "_id",
              children: "children",
            }}
            titleRender={(nodeData) => {
              return (
                <Space>
                  <Space>
                    {nodeData?.icon && <Icon name={nodeData.icon} />}
                    <Typography.Text>{nodeData.title}</Typography.Text>
                    <Typography.Text type="secondary">
                      {nodeData.path}
                    </Typography.Text>
                    {nodeData?.component && (
                      <Typography.Text type="secondary">
                        组件地址: {nodeData.component}
                      </Typography.Text>
                    )}
                  </Space>

                  <AuthWrap permission="sgc:system:menus:put">
                    <Button
                      color="primary"
                      variant="link"
                      onClick={() => editMenu(null, { node: nodeData })}
                    >
                      编辑
                    </Button>
                  </AuthWrap>

                  {nodeData.type !== 2 ? (
                    <>
                      <AuthWrap permission="sgc:system:menus:post">
                        <Button
                          color="primary"
                          variant="link"
                          onClick={(e) => {
                            e.stopPropagation()
                            addSubMenu({
                              title: `${nodeData.title}丨添加子菜单`,
                              node: nodeData,
                            })
                          }}
                        >
                          添加子菜单
                        </Button>
                      </AuthWrap>

                      <AuthWrap permission="sgc:system:menus:put">
                        <Button
                          color="primary"
                          style={{ color: "#52c41a" }}
                          variant="link"
                          onClick={(e) => {
                            e.stopPropagation()
                            addSubMenu({
                              title: `${nodeData.title}丨设置操作权限`,
                              node: { type: 2, nodeData },
                            })
                          }}
                        >
                          操作权限
                        </Button>
                      </AuthWrap>
                    </>
                  ) : (
                    <Icon
                      name="anquanicon"
                      style={{
                        color: "#fff",
                        width: "12px",
                        height: "12px",
                        background: "#52c41a",
                        transform: "translateY(-15%)",
                      }}
                    />
                  )}
                  <AuthWrap permission="sgc:system:menus:put">
                    <Popconfirm
                      title={`删除${["目录", "菜单", "权限"][nodeData.type]} ?`}
                      description="此操作将不可逆, 请再次确认?"
                      onPopupClick={(e) => e.stopPropagation()}
                      onConfirm={() => {
                        delMenus(nodeData)
                      }}
                      onCancel={() => {}}
                      okType="danger"
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button variant="link" color="danger">
                        删除
                      </Button>
                    </Popconfirm>
                  </AuthWrap>
                </Space>
              )
            }}
            // onSelect={editMenu}
          />
        ) : (
          <span style={{ padding: "var(--distance)" }}>菜单构建中...</span>
        )}
      </Spin>

      <Drawer
        title={drawerTitle}
        width={720}
        placement="right"
        onClose={onClose}
        open={open}
        // getContainer={false}
        extra={
          <Button color="primary" variant="filled" onClick={onSubmit}>
            保存
          </Button>
        }
      >
        <Form layout="vertical" form={formEl} autoComplete="off">
          <Form.Item name="_id" noStyle />
          <Form.Item name="parent_id" noStyle />
          <Form.Item name="children" noStyle />
          <Row gutter={12}>
            <Col span={8}>
              <Form.Item
                name="type"
                label="类型"
                rules={[{ required: true, message: "请选择菜单类型" }]}
              >
                <Radio.Group>
                  <Radio value={0} disabled={menuType === 2}>
                    目录
                  </Radio>
                  <Radio value={1} disabled={menuType === 2}>
                    菜单
                  </Radio>
                  <Radio value={2} disabled={menuType !== 2}>
                    权限
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="title"
                label="名称"
                rules={[{ required: true, message: "请输入名称" }]}
              >
                <Input placeholder="请输入名称" />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="sort" label="排序" initialValue={1}>
                <InputNumber style={{ width: "100%" }} min={0} max={99999} />
              </Form.Item>
            </Col>
          </Row>
          {menuType !== 2 && (
            <Row gutter={12}>
              <Col span={8}>
                <Form.Item name="icon" label="图标">
                  <Select
                    fieldNames={{ label: "label", value: "icon" }}
                    showSearch
                    optionFilterProp="icon"
                    placeholder="请选择图标"
                    allowClear
                    options={iconNames}
                  />
                </Form.Item>
              </Col>
              <Col span={16}>
                <Form.Item
                  name="path"
                  label="访问路径 (一级菜单以 '/' 开头)"
                  rules={[{ required: true, message: "请输入访问路径" }]}
                >
                  <Input placeholder="请输入访问路径" />
                </Form.Item>
              </Col>
            </Row>
          )}

          <Row gutter={12}>
            {menuType === 0 && (
              <Col span={8}>
                <Form.Item name="redirect" label="重定向地址">
                  <Select
                    placeholder="请选择重定向地址(redirect)"
                    fieldNames={{
                      label: "title",
                      value: "path",
                      children: "children",
                    }}
                    allowClear
                    options={isMenuChildren || []}
                  />
                </Form.Item>
              </Col>
            )}

            {menuType === 1 && (
              <Col span={16}>
                <Form.Item
                  name="component"
                  label="组件地址 (@/pages/)"
                  rules={[{ required: true, message: "请输入组件地址" }]}
                >
                  <Input placeholder="请输入组件地址" />
                </Form.Item>
              </Col>
            )}
            {menuType === 2 && (
              <Col span={16}>
                <Form.Item
                  name="permission"
                  label="权限标识"
                  rules={[{ required: true, message: "请输入权限标识" }]}
                >
                  <Input placeholder="例如: system:user:view" />
                </Form.Item>
              </Col>
            )}
            <Col span={4}>
              <Form.Item name="is_enable" label="是否启用" required>
                <Switch />
              </Form.Item>
            </Col>
            {menuType !== 2 && (
              <Col span={4}>
                <Form.Item name="is_show" label="是否显示" required>
                  <Switch />
                </Form.Item>
              </Col>
            )}
            {/* {isId && (
              <Col span={4}>
                <Form.Item name="is_delete" label="是否删除">
                  <Switch />
                </Form.Item>
              </Col>
            )} */}
          </Row>
        </Form>
      </Drawer>
    </>
  )
}
export default Index
