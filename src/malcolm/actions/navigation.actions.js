/* eslint no-unused-expressions: ["error", { "allowTernary": true }] */
import { replace, push } from 'react-router-redux';
import NavTypes from '../NavTypes';
import {
  malcolmClearLayoutSelect,
  malcolmNewBlockAction,
  malcolmSubscribeAction,
} from '../malcolmActionCreators';
import blockUtils from '../blockUtils';
import { Widget } from '../../malcolmWidgets/attributeDetails/attributeSelector/attributeSelector.component';

const findBlockIndex = (navList, blockMri) => {
  const navLength = navList.length;
  const navListTrim =
    navLength && !(navLength % 2) ? navList.slice(-2) : navList.slice(-3);
  const index = navListTrim.findIndex(
    nav => nav.navType === NavTypes.Block && nav.blockMri === blockMri
  );
  return index !== -1 ? navLength - navListTrim.length + index : -1;
};

const subscribeToNewBlocksInRoute = () => (dispatch, getState) => {
  const state = getState().malcolm;
  const { navigationLists } = state.navigation;
  const { blocks } = state;

  const blocksInRoute = navigationLists.filter(
    nav => nav.navType === NavTypes.Block
  );
  const unsubscribedBlocks = blocksInRoute.filter(nav => !blocks[nav.blockMri]);
  unsubscribedBlocks.forEach(nav => {
    dispatch(malcolmNewBlockAction(nav.blockMri, false, false));
    dispatch(malcolmSubscribeAction([nav.blockMri, 'meta']));
  });
};

const subscribeToChildren = () => (dispatch, getState) => {
  const state = getState().malcolm;
  const { navigationLists } = state.navigation;

  const lastNav = navigationLists.slice(-1)[0];
  if (lastNav.navType === NavTypes.Attribute) {
    const attribute = blockUtils.findAttribute(
      state.blocks,
      lastNav.parent.blockMri,
      lastNav.path
    );
    if (blockUtils.attributeHasTag(attribute, Widget.FLOWGRAPH)) {
      attribute.raw.value.visible.forEach((visible, i) => {
        const child = attribute.raw.value.mri[i];
        if (visible && !state.blocks[child]) {
          dispatch(malcolmNewBlockAction(child, false, false));
          dispatch(malcolmSubscribeAction([child, 'meta']));
        }
      });
    }
  }
};

const navigateToAttribute = (blockMri, attributeName) => (
  dispatch,
  getState
) => {
  const state = getState().malcolm;

  const attribute = blockUtils.findAttribute(
    state.blocks,
    blockMri,
    attributeName
  );

  // subscribe to layout blocks
  if (blockUtils.attributeHasTag(attribute, Widget.FLOWGRAPH)) {
    dispatch(malcolmClearLayoutSelect());
    attribute.raw.value.visible.forEach((visible, i) => {
      if (visible) {
        const blockName = attribute.raw.value.mri[i];
        if (!state.blocks[blockName]) {
          dispatch(malcolmNewBlockAction(blockName, false, false));
          dispatch(malcolmSubscribeAction([blockName, 'meta']));
        }
      }
    });
  }

  const { navigationLists, viewType } = state.navigation;
  const matchingBlockNav = findBlockIndex(navigationLists, blockMri);
  if (matchingBlockNav > -1) {
    const newPath = `/${viewType}/${navigationLists
      .filter((nav, i) => i <= matchingBlockNav)
      .map(nav => nav.path)
      .join('/')}/${attributeName}`;
    getState().viewState.popout
      ? window.open(
          `${window.location.protocol}//${window.location.host}${newPath}`,
          `${blockMri}.${attributeName}`
        )
      : dispatch(push({ pathname: newPath, search: window.location.search }));
  }
};

const navigateToInfo = (blockMri, attributeName, subElement) => (
  dispatch,
  getState
) => {
  const state = getState().malcolm;
  const { navigationLists, viewType } = state.navigation;
  const matchingBlockNav = findBlockIndex(navigationLists, blockMri);

  const goTo = path =>
    getState().viewState.popout
      ? window.open(
          `${window.location.protocol}//${window.location.host}${path}`,
          `${blockMri}.${attributeName}`
        )
      : dispatch(push({ pathname: path, search: window.location.search }));

  if (matchingBlockNav > -1) {
    if (subElement !== undefined) {
      const newPath = `/${viewType}/${navigationLists
        .filter((nav, i) => i <= matchingBlockNav)
        .map(nav => nav.path)
        .join('/')}/${attributeName}.${subElement}/.info`;
      goTo(newPath);
    } else {
      const newPath = `/${viewType}/${navigationLists
        .filter((nav, i) => i <= matchingBlockNav)
        .map(nav => nav.path)
        .join('/')}/${attributeName}/.info`;
      goTo(newPath);
    }
  } else {
    const newPath = `/${viewType}/${blockMri}/${attributeName}/.info`;
    goTo(newPath);
  }
};

const navigateToSubElement = (blockMri, attributeName, subElement) => (
  dispatch,
  getState
) => {
  const state = getState().malcolm;
  const { navigationLists, viewType } = state.navigation;

  const matchingBlockNav = findBlockIndex(navigationLists, blockMri);

  if (matchingBlockNav > -1) {
    if (subElement) {
      const newPath = `/${viewType}/${navigationLists
        .filter((nav, i) => i <= matchingBlockNav)
        .map(nav => nav.path)
        .join('/')}/${attributeName}.${subElement}/${navigationLists
        .filter(
          (nav, i) => i > matchingBlockNav + 1 && nav.navType === NavTypes.Info
        )
        .map(nav => nav.path)
        .join('/')}`;
      dispatch(replace({ pathname: newPath, search: window.location.search }));
    } else {
      const newPath = `/${viewType}/${navigationLists
        .filter((nav, i) => i <= matchingBlockNav)
        .map(nav => nav.path)
        .join('/')}/${attributeName}/${navigationLists
        .filter((nav, i) => i > matchingBlockNav + 1)
        .map(nav => nav.path)
        .join('/')}`;
      dispatch(replace({ pathname: newPath, search: window.location.search }));
    }
  }
};

const navigateToPalette = () => (dispatch, getState) => {
  const state = getState().malcolm;
  const { navigationLists, viewType } = state.navigation;

  const lastAttributeNav = [...navigationLists]
    .reverse()
    .findIndex(nav => nav.navType === NavTypes.Attribute);
  if (lastAttributeNav > -1) {
    const routeEnding =
      navigationLists[navigationLists.length - 1].navType === NavTypes.Palette
        ? ''
        : '.palette';

    const newPath = `/${viewType}/${navigationLists
      .filter((nav, i) => i <= navigationLists.length - 1 - lastAttributeNav)
      .map(nav => nav.path)
      .join('/')}/${routeEnding}`;
    dispatch(push({ pathname: newPath, search: window.location.search }));
  }
};

const isChildPanelNavType = navType =>
  navType === NavTypes.Block ||
  navType === NavTypes.Info ||
  navType === NavTypes.Palette;

const closeChildPanel = () => (dispatch, getState) => {
  const state = getState().malcolm;
  const { navigationLists, viewType } = state.navigation;
  if (isChildPanelNavType(navigationLists.slice(-1)[0].navType)) {
    if (navigationLists.slice(-1)[0].navType === NavTypes.Info) {
      const { blockMri } = navigationLists.slice(-3)[0];
      const attributeName = state.mainAttribute;
      const { subElements } = navigationLists.slice(-2)[0];
      const { blocks } = getState().malcolm;
      const attribute = blockUtils.findAttribute(
        blocks,
        blockMri,
        attributeName
      );
      if (attribute && attribute.calculated && attribute.calculated.isMethod) {
        const newPath = `/${viewType}/${navigationLists
          .slice(0, -2)
          .map(nav => nav.path)
          .join('/')}/${state.mainAttribute}${
          subElements ? `.${subElements.join('.')}` : ''
        }`;
        dispatch(push({ pathname: newPath, search: window.location.search }));
      } else {
        const newPath = `/${viewType}/${navigationLists
          .slice(0, -1)
          .map(nav => nav.path)
          .join('/')}`;
        dispatch(push({ pathname: newPath, search: window.location.search }));
      }
    } else {
      const newPath = `/${viewType}/${navigationLists
        .slice(0, -1)
        .map(nav => nav.path)
        .join('/')}`;
      dispatch(push({ pathname: newPath, search: window.location.search }));
    }
  }
};

const updateChildPanel = newChild => (dispatch, getState) => {
  const state = getState().malcolm;
  const { navigationLists, viewType } = state.navigation;

  if (navigationLists.slice(-1)[0].path === newChild) {
    return; // nothing to do as the child panel is already newChild
  }

  let newPath;
  if (isChildPanelNavType(navigationLists.slice(-1)[0].navType)) {
    newPath = `/${viewType}/${navigationLists
      .slice(0, -1)
      .map(nav => nav.path)
      .join('/')}/${newChild}`;
  } else {
    newPath = `/${viewType}/${navigationLists
      .map(nav => nav.path)
      .join('/')}/${newChild}`;
  }
  dispatch(push({ pathname: newPath, search: window.location.search }));
};

const updateChildPanelWithLink = (blockMri, portName) => (
  dispatch,
  getState
) => {
  const state = getState().malcolm;
  const { navigationLists, viewType } = state.navigation;

  const layoutAttribute = blockUtils.findAttribute(
    state.blocks,
    state.parentBlock,
    state.mainAttribute
  );
  const blockIndex = layoutAttribute.raw.value.mri.findIndex(
    mri => mri === blockMri
  );
  const blockName =
    blockIndex > -1 ? layoutAttribute.raw.value.name[blockIndex] : blockMri;
  const newChild = `${blockName}.${portName}.link`;

  if (navigationLists.slice(-1)[0].path === newChild) {
    return; // nothing to do as the child panel is already newChild
  }

  let newPath;
  if (isChildPanelNavType(navigationLists.slice(-1)[0].navType)) {
    newPath = `/${viewType}/${navigationLists
      .slice(0, -1)
      .map(nav => nav.path)
      .join('/')}/${newChild}`;
  } else {
    newPath = `/${viewType}/${navigationLists
      .map(nav => nav.path)
      .join('/')}/${newChild}`;
  }
  dispatch(push({ pathname: newPath, search: window.location.search }));
};

const closeInfo = (blockMri, attributeName, subElement) => (
  dispatch,
  getState
) => {
  const { blocks, mainAttribute, navigation } = getState().malcolm;
  const { navigationLists, viewType } = navigation;
  const attribute = blockUtils.findAttribute(blocks, blockMri, attributeName);
  if (attribute && attribute.calculated && attribute.calculated.isMethod) {
    const newPath = `/${viewType}/${navigationLists
      .slice(0, -2)
      .map(nav => nav.path)
      .join('/')}/${mainAttribute}${subElement ? `.${subElement}` : ''}`;
    dispatch(push({ pathname: newPath, search: window.location.search }));
  } else {
    const newPath = `/${viewType}/${navigationLists
      .slice(0, -1)
      .map(nav => nav.path)
      .join('/')}`;
    dispatch(push({ pathname: newPath, search: window.location.search }));
  }
};

export default {
  subscribeToChildren,
  subscribeToNewBlocksInRoute,
  navigateToAttribute,
  navigateToInfo,
  navigateToSubElement,
  navigateToPalette,
  updateChildPanel,
  closeChildPanel,
  updateChildPanelWithLink,
  closeInfo,
};
