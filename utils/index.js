// 深拷贝
export const deepClone = (obj) => {
  // console.log('diaoyongl ');
  // 根据传入对象判断是对象还是数组 并创建
  let objClone = Array.isArray(obj) ? [] : {}
  if (obj && typeof obj === 'object') {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        //判断ojb的子元素是否为对象，如果是对象，递归拷贝
        if (obj[key] && typeof obj[key] === 'object') {
          objClone[key] = deepClone(obj[key])
        } else {
          //如果不是，简单复制
          objClone[key] = obj[key]
        }
      }
    }
  }
  return objClone
}

// 获取当前月第一天
export const firstDay = () => {
  var date = new Date();
  date.setDate(1);
  var month = parseInt(date.getMonth() + 1);
  var day = date.getDate();
  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }
  return date.getFullYear() + '-' + month + '-' + day
}

// 获取几天前的时间
export const getBeforeDate = (n) => {
  // var n = n;
  let d = new Date();
  let year = d.getFullYear();
  let mon = d.getMonth() + 1;
  let day = d.getDate();
  if (day <= n) {
    if (mon > 1) {
      mon = mon - 1;
    } else {
      year = year - 1;
      mon = 12;
    }
  }
  d.setDate(d.getDate() - n);
  year = d.getFullYear();
  mon = d.getMonth() + 1;
  day = d.getDate();
  let s = year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day);
  return s;
}

export const parseTime = (time, cFormat) => {
  if (!time) return ''
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}


function getStartOfWeek () {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is Sunday
  return new Date(now.setDate(diff));
}

/**
 *
 * @param {*} timestamp
 * @returns
 * 当天24点前的时间 显示 时:分
 * 超过当天24点并且在2天内的时间 显示 昨天 时:分
 * 超过昨天24点并且在3天内的时间 显示 前天 时:分
 * 大于3天且在本周范围内的时间 显示 星期x
 * 大于3天且在当年内的时间 显示 月:日
 * 超过一年的时间 显示 年:月:日
 */
export const formatTimestamp = (timestamp) => {
  const now = new Date();
  const date = new Date(timestamp);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const beforeYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2);
  const thisYear = now.getFullYear();

  if (timestamp >= today.getTime()) {
    // 当天24点前的时间
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  } else if (timestamp >= yesterday.getTime()) {
    // 超过当天24点并且在2天内的时间
    return `昨天 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  } else if (timestamp >= beforeYesterday.getTime()) {
    // 超过昨天24点并且在3天内的时间
    return `前天 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  } else if (timestamp >= getStartOfWeek().getTime() && timestamp < today.getTime()) {
    // 大于3天且小于本周的时间
    const dayOfWeek = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
    return `星期${dayOfWeek} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  } else if (timestamp >= new Date(thisYear, 0, 1).getTime()) {
    // 大于3天且在当年内的时间
    return `${String(date.getMonth() + 1).padStart(2, '0')}月${String(date.getDate()).padStart(2, '0')}日 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  } else {
    // 超过一年的时间
    return `${String(date.getFullYear())}年${String(date.getMonth() + 1).padStart(2, '0')}月${String(date.getDate()).padStart(2, '0')}日 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }
}


// 随机生成一个颜色
export const randomColor = () => {
  const colors = ['#ffe4e1', '#48d1cc', '#b0c4de', '#dcdcdc', '#e6e6fa', '#ffb6c1', '#90ee90', '#87ceeb', '#ffdead', '#0dd2e4']; // 随机颜色数组
  return colors[Math.floor(Math.random() * colors.length)]; // 随机选择一种颜色
}

// app端图片转base64
export const pathToBase64 = (url) => {
  const reader = new plus.io.FileReader()
  return new Promise((resolve, reject) => {
    plus.io.resolveLocalFileSystemURL(url, entry => {
      entry.file(file => {
        reader.onloadend = e => {
          resolve(e.target.result)
        };
        reader.readAsDataURL(file)
      }, function (e) {
        console.log(e.message);
      })
    }, e => {
      console.log(e)
    })
  })
}

// 预览图片
export const previewImage = (url, index = 0) => {
  console.log(Array.isArray(url))
  uni.previewImage({
    indicator: 'default',
    urls: Array.isArray(url) ? url : [url],
    current: index
  })
}

var IosOrAndroid = 0;
// 判断是安卓还是ios
export const isIos = () => {
  const { platform } = uni.getSystemInfoSync()
  if (platform == 'ios') {
    IosOrAndroid = 1
    return 1
  } else if (platform == 'android') {
    IosOrAndroid = 0
    return 0
  }
}


// 让手机发生短暂的振动
export const vibrate = (callback) => {
  const { platform } = uni.getSystemInfoSync()
  if (platform == 'ios') {
    let UIImpactFeedbackGenerator = plus.ios.importClass('UIImpactFeedbackGenerator');
    let impact = new UIImpactFeedbackGenerator();
    impact.prepare();
    impact.init(2); // 代表振动的时间，可选0~3，0最轻，3最重
    impact.impactOccurred();
    callback && callback()
  } else if (platform == "android") {
    uni.vibrateShort()
  }
}

// 校验缓存开关
export const checkSettings = (type) => {
  return new Promise((resolve, reject) => {
    const settings = JSON.parse(uni.getStorageSync('settings') || `{"${type}":"true"}`);
    if (settings[type]) {
      resolve(settings[type])
      return
    }
    reject()
  })
}

// 检查是否有小程序权限 (限小程序内使用)
export const checkMiniProgramPermission = (type) => {
  return new Promise((resolve, reject) => {
    uni.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          uni.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => {
              resolve()
            },
            fail: () => {
              uni.showModal({
                title: '授权提示',
                content: '保存图片或视频到您的相册',
                cancelText: '取消',
                confirmText: '去授权',
                success: (res) => {
                  if (res.confirm) {
                    uni.openSetting()
                  }
                }
              })
            }
          })
        } else {
          resolve()
        }
      }
    })
  })
}


// 获取图片宽高信息 Promise
export const computedImg = (imageUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = imageUrl

    img.onload = function () {
      const width = img.width
      const height = img.height
      const aspectRatio = (width / height)

      resolve({ width, height, aspectRatio })
    }

    img.onerror = function () {
      reject('Failed to load the image')
    }
  })
}

// 获取图片宽高信息 async
export const computedImgSync = (imageUrl) => {
  const img = new Image();
  img.src = imageUrl;

  if (img.complete && img.naturalWidth > 0) {
    const width = img.width;
    const height = img.height;
    const aspectRatio = width / height;
    return { width, height, aspectRatio };
  } else {
    return null; // 或其他错误值
  }
};

// 截取价格
export const split_price = (price) => {
  return price ? [price.split('.')[0], price.split('.')[1]] : ['', '']
}

// 格式化数字变成 k w 亿
// export const formatNum = (num) => {
//   return num >= 1e3 && num < 1e4
//     ? Math.floor(num / 1e3 * 100) / 100 + 'k'
//     : num >= 1e4 && num < 1e8
//       ? Math.floor(num / 1e4 * 100) / 100 + 'w'
//       : num >= 1e8
//         ? Math.floor(num / 1e8 * 100) / 100 + '亿'
//         : num;
// }

export const formatNum = (num) => {
  const addUnit = (val, unit) => `${val}${unit}`;

  if(!num) return 0

  if (num >= 1e3 && num < 1e4) {
    const formattedNum = (num / 1e3).toFixed(2);
    return addUnit(formattedNum.includes('.') ? formattedNum.replace(/\.?0*$/, '') : formattedNum, 'k');
  } else if (num >= 1e4 && num < 1e8) {
    const formattedNum = (num / 1e4).toFixed(2);
    return addUnit(formattedNum.includes('.') ? formattedNum.replace(/\.?0*$/, '') : formattedNum, 'w');
  } else if (num >= 1e8) {
    const formattedNum = (num / 1e8).toFixed(2);
    return addUnit(formattedNum.includes('.') ? formattedNum.replace(/\.?0*$/, '') : formattedNum, '亿');
  } else {
    return num.toString();
  }
};


// 复制到粘贴板
export const copy = (data) => {
  uni.setClipboardData({
    data, success: () => {
      uni.$toast('复制成功')
    }
  })
}
