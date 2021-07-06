import axios from 'axios'
import config from '../../../gem.config'
import { Message } from 'element-ui'
// 网页上方进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

let instance = axios.create({
  timeout: 50000,
  baseURL: config.BASE_URL
})

// 添加请求拦截器
instance.interceptors.request.use(
  config => {
    if (sessionStorage.getItem('refresh_token')) {
      config.headers.Authorization = 'Bearer ' + sessionStorage.getItem('refresh_token')
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器即异常处理
instance.interceptors.response.use(
  response => {
    return response.data
  },
  err => {
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = '请求出错'
          break
        case 401:
          Message.warning({
            message: '授权失败，请重新登录'
          })
          setTimeout(() => {
            window.location.reload()
          }, 1000)
          break
        case 403:
          err.message = '拒绝访问'
          break
        case 404:
          err.message = '请求错误,未找到该资源'
          break
        case 500:
          err.message = '服务器端出错'
          break
        case 504:
          err.message = '服务器超时或未响应'
          break
      }
    } else {
      err.message = '连接服务器失败'
    }
    Message.error({
      message: err.message
    })
    return Promise.reject(err.response)
  }
)

const httpServer = (opts, data) => {
  NProgress.start()
  // const Public = {}
  const params = data || {}
  const httpDefaultOpts = {
    method: opts.method,
    url: opts.url,
    headers: opts.headers || {
      "Content-Type": "application/json"
    }
  }

  if (opts.method === 'post') {
    httpDefaultOpts.data = params
  } else {
    httpDefaultOpts.params = params
  }
  // console.log(httpDefaultOpts)
  return new Promise((resolve, reject) => {
    instance(httpDefaultOpts)
      .then(response => {
        NProgress.done()
        if (response.code === '0') {
          resolve(response)
        } else {
          Message.error({
            message: response.message
          })
          reject(response)
        }
      })
      .catch(res => {
        reject(res)
        NProgress.done()
      })
  })
}

export default httpServer
