// utils/menu.js
export const getOpenKeysFromPath = (pathname) => {
  const segments = pathname.split('/').filter(Boolean);

  const openKeys = [];
  for (let i = 1; i < segments.length; i++) {
    openKeys.push('/' + segments.slice(0, i).join('/'));
  }

  return openKeys;
};
