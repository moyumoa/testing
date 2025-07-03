export const login = () => {
  uni.login({
    provider: 'weixin',
    success: (loginRes) => {
      const {code} = loginRes
      uni.getUserInfo({
        provider: 'weixin',
        success: async (infoRes) => {
          const userInfo = infoRes.userInfo;
          const encryptedData = infoRes.encryptedData;
          const iv = infoRes.iv;
          const rawData = JSON.parse(infoRes.rawData);

          // 授权获取用户信息
          const uinfo = await uni.$api.wxLogin({code: code, encryptedData, iv, rawData})
          const {data: {user}} = uinfo
          uni.setStorageSync('userInfo', JSON.stringify(user))
        },
        fail: (error) => {
          console.error('获取用户信息失败：', error);
        }
      });
    }, fail: (error) => {
      console.error('一键登录失败：', error);
    }
  });
}