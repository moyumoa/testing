// // var jweixin = require('jweixin-module');
// // const wx = require('jweixin-module');
// // const jssdk = require(['./jssdk'])

// const jsweixin = require('jweixin-module');

// export const wexinPay = (data, oderid, type) => {
// 	console.log('支付被调用了', jsweixin);
// 	jsweixin.config({
// 		debug: false,
// 		appId: data.appId,
// 		timestamp: data.timeStamp,
// 		nonceStr: data.nonceStr,
// 		signature: data.paySign,
// 		jsApiList: ['chooseWXPay']

// 	});

// 	jsweixin.ready(function() {
// 		jsweixin.chooseWXPay({
// 			timestamp: data.timeStamp,//这个字段是为字符串后端返回时需检查
// 			nonceStr: data.nonceStr,
// 			package: data.package,
// 			signType: data.signType,
// 			paySign: data.paySign,
// 			success(res) {
// 				uni.showToast({
// 					title: '支付成功',
// 					icon: 'success',
// 				})
// 			},
// 			fail(res) {
// 				uni.showToast({
// 					title: '支付失败',
// 					icon: 'error'
// 				})
// 			}
// 		});
// 	});

// 	jsweixin.error(function(res) {
// 		uni.showToast({
// 			title: '支付失败',
// 			icon: 'error'
// 		})
// 	});

// }