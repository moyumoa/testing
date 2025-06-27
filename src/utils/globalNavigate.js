// utils/globalNavigate.js
let _navigate = null;

export function setNavigate(n) {
  _navigate = n;
}

export function getNavigate() {
  return _navigate;
}
