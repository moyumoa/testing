// import md5 from 'js-md5'

import {
	parseTime
} from '../utils'
let baseUrl, appKey, secretKey, publicUrl, webhUrl, IMSDKAppID, IMsecretKey

if (process.env.NODE_ENV === "development") {
	// baseUrl = 'http://test.dajiapaipai.com:8001'
	// baseUrl = 'http://test.dajiapaipai.com/f'
	// baseUrl = 'http://192.168.1.249:8201'
	// baseUrl = 'https://h5.dajiapaipai.com/f'
	// baseUrl = 'http://192.168.1.28:8201'
	// baseUrl = 'http://192.168.1.28:8201' // 才
	baseUrl = 'http://192.168.9.99:8090/v1' // 才
	// baseUrl = 'http://192.168.2.2:8201' // 飞
	// baseUrl = 'http://192.168.8.65:8201' // 飞
	// 13616551001

	// publicUrl = 'http://192.168.1.27:8080'
	publicUrl = 'https://dev.dajiapaipai.com/f'
	webhUrl = 'http://192.168.2.4:9020'
	// webhUrl = 'https://h5.dajiapaipai.com/dist'

	appKey = 'FLRGWXU5P6NYCKQVSHA8O0MIB3ZD2E41'
	secretKey = 'NVOTGR8BWPI06FY5PF02Z7D1LMFE2C7CMHKC43R159X39SBVVHHTTSSUQCCUUEA1'
} else if (process.env.NODE_ENV === "production") {
	// 正式环境

	baseUrl = 'https://h5.dajiapaipai.com/f'


	publicUrl = 'https://h5.dajiapaipai.com/h5'
	webhUrl = 'https://h5.dajiapaipai.com/dist'
	appKey = '2NYALH4DWRTS80BVCGPMZ1I6U3EKQ795'
	secretKey = 'L6GEVS98FTMYYX4S5X0ZPXDW36ZKETQKTUCXBORIOKN66W1W28IH8KSKXHHUUWA7'
} else {
	baseUrl = 'https://h5.dajiapaipai.com'

	publicUrl = 'https://h5.dajiapaipai.com/h5'
	webhUrl = 'https://h5.dajiapaipai.com/dist'
}


export const envs = {
	baseUrl: baseUrl,
	appKey: appKey,
	reqTime: parseTime(new Date()),
	publicUrl: publicUrl,
	webhUrl: webhUrl,
}

// export const getSign = (data) => {
// 	// 1.将参数按照key=value的格式，并按照参数名ASCII字典序排序如下：
// 	// 参数名ASCII码从小到大排序（字典序）；
// 	// 如果参数的值为空不参与签名；
// 	// 如果参数名有重复的，仅保留第一个字符出现的参数名；
// 	// 参数名区分大小写；
// 	// 2.将排序好的参数名和参数值用&字符连接起来，此时生成的字符串为待签名字符串；
// 	// 3.在待签名字符串后拼接上appSecret，得到待签名字符串；
// 	// 4.对待签名字符串进行两次md5加密，得到签名sign；
// 	// 5.将sign转换成大写，得到最终的签名sign。

// 	// console.log('data', data)
// 	let arr = []
// 	for (let key in data) {
// 		if (data[key] !== '') {
// 			arr.push(key)
// 		}
// 	}
// 	arr.sort()
// 	let str = ''
// 	for (let i = 0; i < arr.length; i++) {
// 		str += arr[i] + '=' + data[arr[i]] + '&'
// 	}
// 	str = str.substring(0, str.length - 1)
// 	str += `&secretKey=${secretKey}`
// 	// return md5(md5(str)).toUpperCase() // 32位大写
// 	// console.log('md5(md5(str)) === ',md5(md5(str)))
// 	return md5(md5(str))

// }