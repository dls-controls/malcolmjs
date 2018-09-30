export const openParentPanelType = 'OPEN_PARENT_PANEL';
export const updateVersionNumerType = 'UPDATE_VERSION';
export const showFooterType = 'SHOW_FOOTER_TYPE';
export const snackbar = 'PUSH_SNACKBAR';
export const updateTheme = 'CREATE_NEW_THEME';
export const editTheme = 'EDIT_THEME';
export const setTheme = 'SET_THEME_PROPS';

export const openParentPanel = open => ({
  type: openParentPanelType,
  openParentPanel: open,
});

export const snackbarState = (open, message) => ({
  type: snackbar,
  snackbar: {
    open,
    message,
  },
});

export const updateVersionNumber = (version, title) => ({
  type: updateVersionNumerType,
  payload: {
    version,
    title,
  },
});

export const showFooterAction = footerHeight => ({
  type: showFooterType,
  payload: {
    footerHeight,
  },
});

export const updateThemeAction = () => ({
  type: updateTheme,
});

export const setThemeAction = (property, value) => ({
  type: setTheme,
  payload: {
    property,
    value,
  },
});

export const editThemeAction = open => ({
  type: editTheme,
  payload: {
    open,
  },
});

export default {
  openParentPanel,
};
