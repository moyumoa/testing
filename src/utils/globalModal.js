let modalInstance = null;

export function setGlobalModal (instance) {
  modalInstance = instance;
}

export const showModal = {
  confirm (options) {
    modalInstance?.confirm(options);
  },
  info (options) {
    modalInstance?.info(options);
  },
  success (options) {
    modalInstance?.success(options);
  },
  warning (options) {
    modalInstance?.warning(options);
  },
  error (options) {
    modalInstance?.error(options);
  }
};
