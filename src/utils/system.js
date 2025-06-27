export const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (
    c
  ) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const getOSAndVersion = () => {
  const userAgent = navigator.userAgent;
  if (/Windows NT (\d+\.\d+)/i.test(userAgent)) {
    const version = userAgent.match(/Windows NT (\d+\.\d+)/i)?.[1];
    return `Windows ${version}`;
  } else if (/Mac OS X (\d+_\d+(_\d+)?)/i.test(userAgent)) {
    const version = userAgent.match(/Mac OS X (\d+_\d+(_\d+)?)/i)?.[1]?.replace(/_/g, ".");
    return `MacOS ${version}`;
  } else if (/Android (\d+(\.\d+)?)/i.test(userAgent)) {
    const version = userAgent.match(/Android (\d+(\.\d+)?)/i)?.[1];
    return `Android ${version}`;
  } else if (/CPU (iPhone )?OS (\d+_\d+(_\d+)?)/i.test(userAgent)) {
    const version = userAgent.match(/CPU (iPhone )?OS (\d+_\d+(_\d+)?)/i)?.[2]?.replace(/_/g, ".");
    return `iOS ${version}`;
  } else if (/Linux/i.test(userAgent)) {
    return "Linux (version not available)";
  } else {
    return "Unknown OS and version";
  }
}

export const getBrandsFromUserAgent = () => {
  const userAgent = navigator.userAgent;

  if (/Chrome\/(\d+)/i.test(userAgent)) {
    const version = userAgent.match(/Chrome\/(\d+)/i)?.[1];
    return `Chrome ${version}`;
  } else if (/Firefox\/(\d+)/i.test(userAgent)) {
    const version = userAgent.match(/Firefox\/(\d+)/i)?.[1];
    return `Firefox ${version}`;
  } else if (/Safari\/(\d+)/i.test(userAgent) && !/Chrome/i.test(userAgent)) {
    const version = userAgent.match(/Version\/(\d+)/i)?.[1];
    return `Safari ${version}`;
  } else if (/Edge\/(\d+)/i.test(userAgent)) {
    const version = userAgent.match(/Edge\/(\d+)/i)?.[1];
    return `Edge ${version}`;
  } else {
    return "Unknown browser";
  }
}

export default class StorageService {
  constructor() {
    if (StorageService._instance) {
      throw new Error("Use StorageService.shared to access the singleton instance.");
    }
    StorageService._instance = this;
  }

  static shared = new StorageService();

  setItem(key, value) {
    localStorage.setItem(key, value);
  }

  getItem(key) {
    return localStorage.getItem(key);
  }
}

// Get or generate a device ID and store it in localStorage
export const getDeviceIdFromStorage = () => {
  let deviceId = StorageService.shared.getItem("deviceId");
  if (!deviceId || deviceId === "") {
    deviceId = generateUUID();
    StorageService.shared.setItem("deviceId", deviceId);
  }
  return deviceId;
};

export const getDeviceInfo = () => {
  const deviceId = getDeviceIdFromStorage();
  const deviceName = getOSAndVersion();
  const deviceModel = getBrandsFromUserAgent();
  return { deviceId, deviceName, deviceModel };
}