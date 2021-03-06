import MockCircularBuffer from './malcolm/reducer/attribute.reducer.mocks';
import blockUtils from './malcolm/blockUtils';
import { ARCHIVE_REFRESH_INTERVAL } from './malcolm/reducer/malcolmReducer';

const buildDefaultLayoutEngine = () => ({
  diagramModel: {
    offsetX: 10,
    offsetY: 20,
    zoom: 30,
  },
});

export const buildTestState = () => ({
  // redux router information about the current url
  router: {
    location: {
      pathname: '/gui/PANDA',
    },
  },
  // all information about malcolm and the state of the server
  malcolm: {
    messagesInFlight: {},
    counter: 1,
    navigation: {
      navigationLists: [],
      rootNav: {
        path: '',
        children: [],
      },
    },
    // see addBlock for more details
    blocks: {
      '.blocks': { children: {} },
    },
    blockArchive: {},
    parentBlock: undefined,
    mainAttribute: undefined,
    childBlock: undefined,
    layout: {
      blocks: [],
    },
    layoutEngine: buildDefaultLayoutEngine(),
    layoutState: {
      selectedBlocks: [],
    },
  },
  // all the state purely about the MalcolmJS interface
  viewState: {
    openParentPanel: true,
    openChildPanel: true,
    openHeaderBar: true,
    snackbar: {
      message: '',
      open: false,
    },
    theme: { primary: 'blue', type: 'dark', muiTheme: {} },
    footerHeight: 0,
    transitionParent: false,
    mobileViewIndex: undefined,
    version: undefined,
  },
});

export const buildLocalState = (attribute, length, labels) => {
  const dummy = [];
  for (let i = 0; i < length; i += 1) {
    dummy[i] = '';
  }
  const dummyRow = {};
  labels.forEach(label => {
    dummyRow[label] = '';
  });
  return {
    value: dummy.map(() => dummyRow),
    meta: JSON.parse(JSON.stringify(attribute.raw.meta)),
    labels,
    userChanges: {},
    flags: {
      rows: dummy.map(() => ({})),
      table: {
        dirty: false,
        fresh: true,
        timeStamp:
          attribute.raw.timeStamp !== undefined
            ? JSON.parse(JSON.stringify(attribute.raw.timeStamp))
            : undefined,
        extendable:
          attribute.raw.meta.writeable &&
          !labels.some(label => !attribute.raw.meta.elements[label].writeable),
      },
    },
  };
};

export const addMessageInFlight = (id, path, malcolmState) => {
  const updatedState = malcolmState;
  updatedState.messagesInFlight[id] = {
    id,
    path,
  };
};

export const addBlockArchive = (mri, attributes, malcolmState) => {
  const updatedState = malcolmState;
  updatedState.blockArchive[mri] = {
    // see buildBlockArchiveAttribute for more details
    attributes,
  };
};

export const addBlock = (name, attributes, malcolmState, children = {}) => {
  const updatedState = malcolmState;
  updatedState.blocks[name] = {
    typeid: 'malcolm:core/BlockMeta:1.0',
    name,
    loading: true,
    // see buildAttribute for more details
    attributes,
    children,
    orphans: [],
  };
  updatedState.blocks['.blocks'].children[name] = {
    label: name.replace(':', 'ing '),
  };
};

export const buildMeta = (
  tags = [],
  writeable = true,
  label = '',
  typeid = '',
  elements
) => ({
  tags,
  writeable,
  label,
  typeid,
  elements,
});

const buildMethodMeta = (
  takes = { required: {} },
  returns = {},
  writeable = true,
  label = '',
  version = 1.1
) => ({
  writeable,
  label,
  typeid: `malcolm:core/MethodMeta:${version}`,
  takes,
  returns,
});

export const buildAttribute = (
  name,
  path,
  value,
  alarm = 0,
  meta = buildMeta(),
  children = {},
  loading = false,
  typeid
) => ({
  // the data coming back from the server is always stored in raw
  raw: {
    value,
    alarm: {
      severity: alarm,
    },
    meta,
    typeid,
  },
  // other additional properties are stored in calculated
  calculated: {
    name,
    loading,
    path,
    pending: false,
    children,
  },
});

export const buildMethod = (
  name,
  path,
  takes = { elements: {} },
  took = { value: {}, present: [] },
  returns = { elements: {} },
  returned = { value: {} },
  alarm = 0,
  loading = false
) => ({
  // the data coming back from the server is always stored in raw
  raw: {
    took,
    returned,
    alarm: {
      severity: alarm,
    },
    meta: buildMethodMeta(takes, returns),
  },
  // other additional properties are stored in calculated
  calculated: {
    name,
    loading,
    path,
    pending: false,
    isMethod: true,
  },
});

export const buildBlockArchiveAttribute = (name, size) => ({
  name,
  meta: {},
  value: new MockCircularBuffer(size),
  alarmState: new MockCircularBuffer(size),
  plotValue: new MockCircularBuffer(size),
  timeStamp: new MockCircularBuffer(size),
  timeSinceConnect: new MockCircularBuffer(size),
  connectTime: -1,
  counter: 0,
  refreshRate: ARCHIVE_REFRESH_INTERVAL,
  plotTime: 0,
});

export const updatePanels = (parent, child, malcolmState) => {
  const updatedState = malcolmState;
  updatedState.parentBlock = parent;
  updatedState.childBlock = child;
};

export const addNavigationLists = (navList, malcolmState) => {
  const updatedState = malcolmState;
  updatedState.navigation.navigationLists = navList.map(n => ({ path: n }));
};

export const addSimpleLocalState = (
  malcolmState,
  blockName,
  attributeName,
  value
) => {
  const updatedState = malcolmState;
  const attributeIndex = blockUtils.findAttributeIndex(
    updatedState.blocks,
    blockName,
    attributeName
  );
  if (attributeIndex > -1) {
    updatedState.blocks[blockName].attributes[
      attributeIndex
    ].localState = value;
  }
  return updatedState;
};

export const addTableLocalState = (
  malcolmState,
  blockName,
  attributeName,
  labels,
  length
) => {
  const updatedState = malcolmState;
  const attributeIndex = blockUtils.findAttributeIndex(
    updatedState.blocks,
    blockName,
    attributeName
  );
  const attribute = blockUtils.findAttribute(
    updatedState.blocks,
    blockName,
    attributeName
  );

  if (attributeIndex > -1) {
    updatedState.blocks[blockName].attributes[
      attributeIndex
    ].localState = buildLocalState(attribute, length, labels);
    if (
      updatedState.blocks[blockName].attributes[attributeIndex].raw.value ===
      undefined
    ) {
      updatedState.blocks[blockName].attributes[attributeIndex].raw.value = {};
      labels.forEach(label => {
        updatedState.blocks[blockName].attributes[attributeIndex].raw.value[
          label
        ] = [];
      });
    }
  }
  return updatedState;
};

export const setAttributeFlag = (
  malcolmState,
  blockName,
  attributeName,
  flagType,
  flagValue
) => {
  const updatedState = malcolmState;
  const attributeIndex = blockUtils.findAttributeIndex(
    updatedState.blocks,
    blockName,
    attributeName
  );
  if (attributeIndex > -1) {
    updatedState.blocks[blockName].attributes[attributeIndex].calculated[
      flagType
    ] = flagValue;
  }
  return updatedState;
};

export const setTableFlag = (
  malcolmState,
  blockName,
  attributeName,
  flagType,
  flagValue
) => {
  const updatedState = malcolmState;
  const attributeIndex = blockUtils.findAttributeIndex(
    updatedState.blocks,
    blockName,
    attributeName
  );
  if (attributeIndex > -1) {
    updatedState.blocks[blockName].attributes[
      attributeIndex
    ].localState.flags.table[flagType] = flagValue;
  }
  return updatedState;
};

export const buildMockDispatch = getState => {
  const actions = [];
  const dispatch = action => {
    if (typeof action === 'function') {
      action(dispatch, getState);
    } else {
      actions.push(action);
    }
  };

  return {
    actions,
    dispatch,
    getState,
    subscribe: () => {},
  };
};

export default {
  buildTestState,
  addMessageInFlight,
  addBlockArchive,
  addBlock,
  buildAttribute,
  buildMeta,
  buildBlockArchiveAttribute,
  updatePanels,
  addNavigationLists,
  buildMockDispatch,
};
