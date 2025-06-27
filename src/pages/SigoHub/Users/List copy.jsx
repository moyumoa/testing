import React, { useState, useEffect } from "react"
import {
  App,
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
  Select,
  InputNumber,
  List,
  Avatar,
} from "antd"
import {
  SearchOutlined,
  RedoOutlined,
  EditOutlined,
  SettingOutlined,
  EllipsisOutlined,
  DeleteOutlined,
} from "@ant-design/icons"
import { system, userReq } from "@/api"
import { notify } from "@/utils"
import { formatSmartTime, parseTime } from "@mvmoo/us"
import { usePaginated } from "@mvmoo/react"
import { AuthWrap, OperatingArea, SearchForm, Icon } from "@/components"

const UsersList = () => {
  /* 临时信息(Table单行内容) */
  const [tempInfo, setTempInfo] = useState(null)
  /* 表单: 弹窗内实例 */
  const [USERINFOFORM] = Form.useForm()
  /* 角色列表内容 */
  const [roleList, setRoleList] = useState([])

  /* 分页hook */
  const {
    data: dataRows,
    loading,
    pagination,
    onSearch,
    onChangePage,
    reload,
  } = usePaginated(userReq.ulist.rows, {
    defaultParams: {},
    manual: false,
  })

  /* 获取角色列表 */
  const fetchRoles = async () => {
    const res = await system.roles.rows()
    const datas = res.data.map(({ _id, name, code }) => ({
      _id,
      name: `${name} (${code})`,
    }))
    setRoleList(datas)
  }

  /* 弹窗: 显示|关闭 */
  const [isModalOpen, setIsModalOpen] = useState(false)
  /* 打开弹窗: 新增用户|编辑用户 */
  const showModal = (options) => {
    console.log("options", options)

    setTempInfo(options ? options : null)
    USERINFOFORM.resetFields()
    setIsModalOpen(true)

    options?._id
      ? USERINFOFORM.setFieldsValue(options)
      : USERINFOFORM.setFieldsValue({
          status: 1,
          password: "123456",
        })
  }
  /* 弹窗: 点击取消按钮 */
  const handleModalCancel = () => {
    setIsModalOpen(false)
  }
  /* 弹窗: 点击确定按钮 */
  const handleModalOk = () => {
    USERINFOFORM.validateFields().then((values) => {
      values.status = values.status ? 1 : 0
      const { _id, ...args } = values
      notify.task({
        text: "处理中...",
        final: async () => {
          _id
            ? await userReq.ulist.update(_id, args)
            : await userReq.ulist.create(values)
          reload()
          return `用户${_id ? "编辑" : "添加"}成功`
        },
        errorText: `用户${_id ? "编辑" : "添加"}失败`,
      })
      handleModalCancel()
    })
  }

  /* 删除用户 */
  const delateRole = async (id) => {
    notify.task({
      text: "处理中...",
      final: async () => {
        await userReq.ulist.delete(id)
        reload()
        return "删除成功"
      },
      errorText: "删除失败",
    })
  }

  /* 修改密码 */
  const { modal } = App.useApp()
  const changePassword = (record) => {
    let newPwd = ""

    modal.confirm({
      // 不显示图标
      icon: null,
      title: `为用户 ${record.username} 修改密码`,
      content: (
        <Input.Password
          style={{ margin: "16px 0" }}
          autoFocus
          placeholder="密码仅能包含6-16位字母、数字和下划线"
          onChange={(e) => {
            newPwd = e.target.value
          }}
        />
      ),
      okText: "确认修改",
      onOk: () => {
        if (!newPwd) {
          modal.error({ title: "错误", content: "密码不能为空" })
          return Promise.reject()
        }
        if (!/^[a-zA-Z0-9_]{6,16}$/.test(newPwd)) {
          modal.error({
            title: "修改失败",
            content: "密码仅能包含字母、数字和下划线，长度为6-16位",
          })
          return Promise.reject()
        }
        return notify.task({
          text: "修改中...",
          final: async () => {
            await userReq.ulist.update(record._id, { password: newPwd })
            return "密码修改成功"
          },
          errorText: "修改失败",
        })
      },
    })
  }

  /* 封禁用户 */
  const banuser = (record) => {
    let timer = 60
    let reason = `用户 ${record.nickname} 因违规操作被封禁`
    modal.confirm({
      icon: null,
      title: `封禁用户: ${record.nickname} (${record.username})`,
      content: (
        <Space
          direction="vertical"
          size={24}
          style={{ display: "flex", margin: "16px 0" }}
        >
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            封禁后该用户将无法登录系统，封禁时长为分钟数，最小1分钟,
            最大1440分钟, 0为永久封禁。封禁原因将记录在用户信息中。
          </Typography.Text>
          <Space>
            <Typography.Text type="warning">封禁时长</Typography.Text>
            <InputNumber
              style={{ width: 256 }}
              autoFocus
              placeholder="封禁时长(分钟), 0为永久封禁"
              defaultValue={timer}
              min={1}
              max={1440}
              onChange={(e) => {
                timer = e
              }}
            />
            <Typography.Text type="warning">分钟</Typography.Text>
          </Space>
          <Space>
            <Typography.Text type="warning">封禁原因</Typography.Text>
            <Input.TextArea
              style={{ width: 256 }}
              rows={2}
              placeholder="请输入封禁原因"
              defaultValue={reason}
              onChange={(e) => {
                if (e.target.value.length > 200) {
                  modal.error({
                    title: "封禁失败",
                    content: "封禁原因不能超过200个字符",
                  })
                  return
                }
                reason = e.target.value
              }}
            />
          </Space>
        </Space>
      ),
      okText: "确认封禁",
      okType: "danger",
      onOk: () => {
        return notify.task({
          text: "封禁中...",
          final: async () => {
            await userReq.banusers(record._id, { status: 0, timer, reason })
            reload()
            return "封禁成功: 用户已被强制下线"
          },
        })
      },
    })
  }

  useEffect(() => {
    fetchRoles()
  }, [])

  return (
    <>
      <OperatingArea title="用户管理" desc="SigoHub用户中心">
        <SearchForm
          onSearch={onSearch}
          right={
            <Button type="primary" onClick={() => showModal()}>
              添加用户
            </Button>
          }
        >
          <Form.Item name="nickname">
            <Input placeholder="用户昵称" allowClear />
          </Form.Item>
          <Form.Item name="username">
            <Input placeholder="用户账号" allowClear />
          </Form.Item>
        </SearchForm>
      </OperatingArea>

      <List
        grid={{ gutter: 16, column: 4 }}
        style={{ margin: "0 calc(var(--distance) * 2)" }}
        loading={loading}
        dataSource={dataRows}
        pagination={{
          current: pagination.page,
          pageSize: pagination.limit,
          total: pagination.total,
          showSizeChanger: true,
          onChange: onChangePage,
        }}
        renderItem={(item) => (
          <List.Item key={item._id}>
            <Badge.Ribbon
              text={item?.status ? "启用" : "停用"}
              color={item?.status ? "green" : "#555"}
            >
              <Card
                size="small"
                title={
                  <Space style={{ padding: "8px 0" }}>
                    <Avatar
                      src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${item._id}`}
                    />
                    <Typography.Text strong>
                      {`${item.nickname || "暂无昵称"} (${item.username})`}
                    </Typography.Text>
                  </Space>
                }
                actions={[
                  <EditOutlined key="edit" onClick={() => showModal(item)} />,
                  <a
                    key="list-loadmore-more"
                    onClick={() => changePassword(item)}
                  >
                    修改密码
                  </a>,
                  <AuthWrap permission="sigo:system:user:ban">
                    <Button
                      color="danger"
                      variant="link"
                      onClick={() => banuser(item)}
                    >
                      封禁
                    </Button>
                  </AuthWrap>,
                  <Popconfirm
                    title="删除用户"
                    description="所有关联该用户的用户登录信息将立即失效, 是否要继续?"
                    onConfirm={() => delateRole(item._id)}
                    onCancel={() => {}}
                    okText="确认删除"
                    okType="danger"
                    cancelText="取消"
                  >
                    <DeleteOutlined
                      style={{ color: "#f00" }}
                      onClick={() => delateRole(item._id)}
                    />
                  </Popconfirm>,
                ]}
              >
                <Space direction="vertical" size={16}>
                  <Typography.Text type="secondary">
                    ID: {item._id}
                  </Typography.Text>
                  <Typography.Text type="secondary">
                    手机号: {item.phone || "--"}
                  </Typography.Text>
                  <Typography.Text type="secondary">
                    描述: {item?.remark || "--"}
                  </Typography.Text>
                  <Space>
                    <Typography.Text code type="secondary">
                      注册时间:{" "}
                      {item?.create_time
                        ? formatSmartTime(item?.create_time, "/")
                        : "--:--"}
                    </Typography.Text>
                    <Typography.Text code type="secondary">
                      Token时效:{" "}
                      {item?.token_expire_at
                        ? parseTime(item?.token_expire_at)
                        : "--:--"}
                    </Typography.Text>
                  </Space>
                </Space>
              </Card>
            </Badge.Ribbon>
          </List.Item>
        )}
      />

      <Modal
        title={tempInfo?._id ? "编辑用户" : "添加用户"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        afterOpenChange={(open) => {
          if (!open) {
            USERINFOFORM.resetFields()
            setTempInfo(null)
          }
        }}
      >
        <Form
          layout="vertical"
          form={USERINFOFORM}
          autoComplete="off"
          style={{ padding: "16px 0" }}
          // variant="borderless"
          // disabled={true}
        >
          <Form.Item name="_id" noStyle />
          <Form.Item
            name="username"
            label="账号"
            rules={[{ required: true, message: "请输入账号" }]}
          >
            <Input placeholder="请输入账号" />
          </Form.Item>

          <Form.Item
            name="nickname"
            label="用户昵称"
            rules={[{ required: true, message: "请输入用户昵称" }]}
          >
            <Input placeholder="请输入用户昵称" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="手机号"
            rules={[
              // { required: true, message: "请输入手机号" },
              {
                pattern: /^(1[3-9]\d{9}|[0-9]{3,4}-[0-9]{7,8})$/,
                message: "请输入正确的手机号",
              },
            ]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item name="role_ids" label="角色信息">
            <Select
              mode="multiple"
              maxCount={3}
              fieldNames={{ label: "name", value: "_id" }}
              showSearch
              optionFilterProp="name"
              placeholder="请选择角色"
              allowClear
              options={roleList}
            />
          </Form.Item>
          {!tempInfo?._id && (
            <Form.Item
              name="password"
              label="密码"
              rules={[
                { required: true, message: "请输入登录密码" },
                {
                  pattern: /^[a-zA-Z0-9_]{6,16}$/,
                  message: "密码仅能包含字母、数字和下划线，长度为6-16位",
                },
              ]}
            >
              <Input placeholder="请输入登录密码" />
            </Form.Item>
          )}

          <Form.Item name="remark" label="用户描述">
            <Input.TextArea rows={2} placeholder="用户描述信息" />
          </Form.Item>

          <Form.Item name="status" label="是否启用" required>
            <Switch disabled={tempInfo?.is_banned} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

// export default UsersList
// <Badge.Ribbon
//             text={
//               { free: "免费", paid: "付费" }[item?.space?.package_type] || "无"
//             }
//             color={
//               { free: "green", paid: "blue" }[item?.space?.package_type] ||
//               "#e6e6e6"
//             }
//           >
//             <Card
//               title={
//                 <Space style={{ padding: "8px 0" }}>
//                   <Avatar
//                     src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${item._id}`}
//                   />
//                   <Typography.Text strong>
//                     {`${item.nickname || "暂无昵称"} (${item.phone})`}
//                   </Typography.Text>
//                 </Space>
//               }
//               size="small"
//             >
//               <Space
//                 direction="vertical"
//                 size={16}
//                 style={{
//                   width: "100%",
//                 }}
//               >
//                 <Typography.Text type="secondary">
//                   ID: {item._id}
//                 </Typography.Text>
//                 <Space size={12}>
//                   <Typography.Text type="secondary">
//                     <Icon
//                       name="flshuju"
//                       style={{ margin: "0 3px 3px 0", width: 14 }}
//                     />
//                     总空间 {item?.space?.total_storage_limit || "0"}
//                   </Typography.Text>
//                   <Typography.Text type="secondary">
//                     <Icon
//                       name="liuliang1"
//                       style={{ margin: "0 3px 3px 0", width: 14 }}
//                     />
//                     已使用 {item?.space?.total_storage_limit || "0"}
//                   </Typography.Text>
//                   <Typography.Text type="secondary">
//                     <Icon
//                       name="gongxiangliuliangbao"
//                       style={{ margin: "0 3px 3px 0", width: 14 }}
//                     />
//                     资源包 {item?.space?.total_storage_limit || "0"}
//                   </Typography.Text>
//                 </Space>
//                 <Space
//                   style={{
//                     width: "100%",
//                     justifyContent: "space-between",
//                   }}
//                 >
//                   <Typography.Text code type="secondary">
//                     注册时间:{" "}
//                     {item?.create_time
//                       ? parseTime(item?.create_time)
//                       : "--:--:--"}
//                   </Typography.Text>
//                   <a key="list-loadmore-more">操作</a>
//                 </Space>
//               </Space>
//             </Card>
//           </Badge.Ribbon>