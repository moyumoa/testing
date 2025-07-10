// utils/getLocation.js

export function getLocationAndAddress () {
  return new Promise((resolve, reject) => {
    if (!window.AMapLoader) {
      const script = document.createElement('script');
      script.src = 'https://webapi.amap.com/loader.js';
      script.onload = () => initAMap(resolve, reject);
      document.head.appendChild(script);
      // 添加安全密钥
      window._AMapSecurityConfig = {
        securityJsCode: "45fb0caa3553e12ed9ace2b379f95dcf",
      };
    } else {
      initAMap(resolve, reject);
    }
  });
}

function initAMap (resolve, reject) {
  window.AMapLoader.load({
    key: 'bde7f71ec382c143406b73f80dbf1e49', // 替换为你的Key
    version: '2.0',
    plugins: ['AMap.Geolocation', 'AMap.Geocoder']
  }).then((AMap) => {
    const geolocation = new AMap.Geolocation({
      enableHighAccuracy: true,
      timeout: 10000
    });

    geolocation.getCurrentPosition((status, result) => {
      if (status === 'complete') {
        const { lng, lat } = result.position;
        const geocoder = new AMap.Geocoder();

        geocoder.getAddress([lng, lat], (status, result) => {
          if (status === 'complete' && result.regeocode) {
            const address = result.regeocode.formattedAddress;
            const regeocode = result.regeocode.addressComponent;
            resolve({ lng, lat, address, regeocode });
          } else {
            console.log('地址解析失败', result);
            reject(new Error('地址解析失败'));
          }
        });
      } else {
        console.log('定位失败', result);
        reject(new Error('定位失败'));
      }
    });
  }).catch(reject);
}