
import React, { Component } from 'react'
import { Avatar, Icon, List } from 'antd';

class CommentListComp extends Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
      }

    handleChange(e){
        this.props.onLikeChange(e.currentTarget.dataset.info)
    }

    render() {
        const {lists} = this.props
        return (
            <List
                itemLayout="vertical"
                size="small"
                dataSource={lists}
                pagination={{
                    pageSize: 10,
                    size: 'small',
                }}
                renderItem={(item,index) => (
                    <List.Item
                        key={item.time}
                        actions={[<span style={{ marginLeft: 80 }}>{new Date(item.time).toLocaleString()}</span>,
                        <span>
                            <Icon type='like-o' onClick={this.handleChange} data-info={`${item.commentId}-${item.liked?1:0}-${index}`} style={{ marginRight: 8, cursor: 'point' }} className={item.liked ? 'comment-like' : ''} />
                            {item.likedCount}
                        </span>]}
                    >
                        <List.Item.Meta
                            avatar={<Avatar shape="square" size={64} src={item.user.avatarUrl} />}
                            title={<span className='comment-nickname'>{item.user.nickname}</span>}
                            description={<span className='comment-nickname'>{item.content}</span>}
                        />
                    </List.Item>
                )}
            />
        )
    }
}

export default CommentListComp;