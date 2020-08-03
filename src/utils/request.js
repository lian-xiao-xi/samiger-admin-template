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

let showTime = 0;
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
        // 避免短时间（1.5s）内重复弹窗；即如果1.5s内弹出过这个弹窗提醒则不再弹出
        if (Date.now() - showTime > 1500) {
          MessageBox.confirm('您已退出, 可以取消停留在当前页面,或者重新登录', '注销', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning',
            closeOnClickModal: false,
          }).then(() => {
            store.dispatch('user/resetToken').then(() => {
              location.reload()
            })
          }).catch(() => { });
        }
        return Promise.reject(new Error(res.code))
      } else if (/^subject-does-not.*/.test(res.code)) {
        if (Date.now() - showTime > 1500) {
          Message({
            message: '缺少权限 : ' + (res.msg || ''),
            type: 'error',
            duration: 2 * 1000
          })
        }
        return Promise.reject(new Error(res.code))
      } else {
        return res
      }
    }
    return res;
  },
  error => {
    console.log('请求异常 --- ', error) // for debug
    if (Date.now() - showTime > 1000) {
      Message({
        message: error.message,
        type: 'error',
        // duration: 1 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
