import React, { Component } from 'react'
import { Form, Tooltip, Icon, Button, Input, Table, Avatar } from 'antd';
const formItemLayout = {
    labelCol: {
        xs: { span: 8 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};

const tailFormItemLayout = {
    wrapperCol: {
        sc: {
            span: 24,
            offset: 0
        },
        sm: {
            span: 16,
            offset: 8
        }
    }
}


class Home extends Component {

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let tableData = this.state.tableData.filter(item => item.name === values.name)
                this.setState({ tableData })
                console.log(values)
            }
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Form layout="inline" onSubmit={this.handleSubmit}>
                    <Form.Item label="Name">
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: 'Please input your name!', whitespace: true }],
                        })(
                            <Input />
                        )}
                    </Form.Item>
                    <Form.Item label={(
                        <span>NickName&nbsp;
                       <Tooltip title="What do you want other to call you">
                                <Icon type="question-circle-o" />
                            </Tooltip>
                        </span>
                    )}
                    >
                        {getFieldDecorator('nickname', {

                        })(
                            <Input />
                        )}
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">search</Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}

const WrappedRegistrationForm = Form.create({ name: 'register' })(Home);

export default WrappedRegistrationForm

{/* <Router>
            <Sider width={200} style={{ background: '#fff' }}>
              <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                style={{ height: '100%', borderRight: 0 }}
              >
                {menus.map(item =>
                  item.childs.length !== 0 ?
                    <SubMenu key={item.id} title={<span><Icon type={item.icon} />{item.name}</span>}>
                      {item.childs.map(child =>
                        <Menu.Item key={child.id}><Link to={`/${item.path}/${child.id}`} replace>{child.name}</Link></Menu.Item>
                      )}
                    </SubMenu>
                    :
                    <Menu.Item key={item.id}>
                      <Link to={`/${item.path}`} replace>
                        <Icon type={item.icon} />
                        <span>{item.name}</span>
                      </Link>
                    </Menu.Item>
                )
                }
              </Menu>
            </Sider>
          </Router> */}