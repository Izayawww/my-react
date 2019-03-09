import axios from 'axios'

const service = axios.create({
    // 设置超时时间
    timeout: 60000,
    // baseURL: 'http://134.175.224.127:7003'
  })

export default service