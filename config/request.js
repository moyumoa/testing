import { envs } from './index.js'

let baseUrlH5 = '/f' // h5配置了反向代理 解决跨域问题
// let urls

// get/post/put/delete 请求 (第一个参数 url , 第二个参数 请求方式 , 第三个参数 携带的参数 , 第四个参数 是否需要token)
// url, method, data, tkn = false
export function server ({ params, loading, popTips, ...args }) {
  // uni.showLoading({ title:'加载中' })
  let promise = new Promise((resolve, reject) => {
    // 这里是获取 token
    const token = uni.getStorageSync('mtttoken') || ''
    args.url = envs.baseUrl + args.url

    loading && uni.showLoading({ mask: true })
    popTips && uni.$emit('popTips', true, true)
    uni.request({
      ...args,
      data: params,
      dataType: "json",
      header: {
        'content-type': args.method === 'POST' || args.method === 'PUT' ? 'application/json;charset=UTF-8' : 'x-www-form-urlencoded; charset=UTF-8',
        'Token': token,
      },

      // 当请求成功时调用的函数。这个函数会得到一个参数：从服务器返回的数据。当请求成功时调用函数，即status==200。
      success: function (res) {
        if (res.statusCode !== 200) {
          uni.showToast({ title: res?.data?.msg || '服务器异常', duration: 2000, icon: 'none', position: 'top' })
          setTimeout(() => {
            uni.hideLoading()
            uni.stopPullDownRefresh() // 收回下拉
          }, 3000)
          reject(res)
          popTips && uni.$emit('popTipsFail', true)
          return
        }
        resolve(res.data)

        // 判断如果有token就更新token
        // if (res.header.Token) {
        //   uni.setStorageSync('mtttoken', res.header.Token)
        // }
        // if (res.data.code !== 200) {

        //   setTimeout(() => {
        //     uni.hideLoading()
        //     uni.hideNavigationBarLoading()//关闭导航条加载动画
        //     uni.stopPullDownRefresh()//收回下拉
        //   }, 1000)

        //   if (res.data.code === 500) {
        //     reject(res.data)
        //     return uni.showToast({ title: res.data.message || '服务异常', duration: 2000, icon: 'none', position: 'top' })
        //   }

        //   if (res.data.code === 401) return uni.$rf.logout()

        //   if (res.data.code === -1) return setTimeout(() => {
        //     uni.navigateBack()
        //   }, 500)

        //   uni.showToast({ title: res.data.message || '服务器连接失败', duration: 2000, icon: 'none', position: 'top' })

        //   reject(res.data)
        //   popTips && uni.$emit('popTipsErr', true)
        // } else {
        //   resolve(res.data)
        //   loading && uni.hideLoading()
        //   popTips && uni.$emit('popTips', false, true)
        // }
      },
      fail: function (err) {
        console.warn("请求异常", err)
        uni.showToast({ title: '服务器异常', duration: 2000, icon: 'none', position: 'top' })
        setTimeout(() => {
          uni.hideLoading()
          uni.stopPullDownRefresh()
        }, 3000)
        reject(err)
        popTips && uni.$emit('popTipsFail', true)
      },
    });
  });
  return promise;
}


// 针对文件类型(图片)请求单独处理
export function upLoad (url, params, tkn = true) {
  console.log('上传地址', params);
  // uni.showLoading({ title:'加载中' })
  let promise = new Promise((resolve, reject) => {
    // 这里是获取 token
    let token = uni.getStorageSync("mtttoken")
    uni.uploadFile({
      // #ifdef H5
      url: baseUrlH5 + '/api/front' + url,// H5下
      // #endif

      // #ifndef H5
      url: envs.baseUrl + '/api/front' + url, // 非H5下 小程序和app
      // #endif
      fileType: "image", //ZFB必填,不然报错
      filePath: params, //这个就是我们上面拍照返回或者先中照片返回的数组

      formData: {
        // 'sign': getSign(params),
        // 'appKey': envs.appKey,
        // 'reqTime': envs.reqTime,
        model: "compress",
        pid: 1,
      },
      // name: 'file',
      name: 'multipart',
      header: {
        'Authorization': tkn ? token : ''
      },
      success: (uploadFileRes) => {
        const data = JSON.parse(uploadFileRes.data)
        if (data.code !== 200) {
          uni.$toast(data.message)
        }
        resolve(data)
        // uni.hideLoading();
      },
      fail: function (res) {
        console.warn("请求异常", res)
        reject(res)
        setTimeout(() => {
          uni.hideLoading()
        }, 8000)
        // typeof(obj.fail) == 'function' && obj.fail(res.data);
      },
    });
  });
  return promise;
}

// 直传七牛云
export const uploadToQiniu = (filePath, fileName, token) => {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: 'https://upload-cn-east-2.qiniup.com',
      filePath: filePath,
      name: 'file',
      formData: {
        'key': fileName,
        'token': token
      },
      success: (res) => {
        if (res.statusCode === 200) {
          console.log('上传成功', res)
          resolve(res.data);
        } else {
          reject(new Error(`上传失败 ${res}`));
        }
      },
      fail: (err) => {
        console.log('上传失败', err)
        reject(err);
      }
    });
  });
}