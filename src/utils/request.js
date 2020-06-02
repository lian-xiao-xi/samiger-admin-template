import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Samiger-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

const whiteUrl = ['/api/auth/login', '/api/auth/logout']
// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    if (res.code) {
      if (res.code === 'not-logged-in' && !whiteUrl.includes(response.config.url)) {
        MessageBox.confirm('您已退出, 可以取消停留在当前页面,或者重新登录', '注销', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal: false,
        }).then(() => {
          store.dispatch('login/resetToken').then(() => {
            location.reload()
          })
        }).catch(() =>{});
        return Promise.reject(new Error(res.code))
      } else if (/^subject-does-not.*/.test(res.code)) {
        Message({
          message: '缺少权限 : ' + (res.msg || ''),
          type: 'error',
          duration: 3 * 1000
        })
        return Promise.reject(new Error(res.code))
      } else {
        return res
      }
    } else {
      return res
    }
  },
  error => {
    console.log('请求异常 --- ', error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
