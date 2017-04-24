/**
 * Created by twi18192 on 25/08/15.
 */

var appConstants = {
  /*mainPaneStore use*/
  FOOTER_TOGGLE: "FOOTER_TOGGLE",
  CONFIG_TOGGLE: "CONFIG_TOGGLE",
  FAV_TOGGLE: "FAV_TOGGLE",

  /*paneStore use*/

  DROPDOWN_SELECT: "DROPDOWN_SELECT",
  FAVTAB_OPEN: "FAVTAB_OPEN",
  CONFIGTAB_OPEN: "CONFIGTAB_OPEN",
  BLOCKLOOKUPTABLETAB_OPEN: 'BLOCKLOOKUPTABLETAB_OPEN',

  OPEN_BLOCKTAB: "OPEN_BLOCKTAB",
  REMOVE_BLOCKTAB: "REMOVE_BLOCKTAB",
  OPEN_EDGETAB: "OPEN_EDGETAB",
  MODAL_DIALOG_BOX_OPEN: "MODAL_DIALOG_BOX_OPEN",
  MODAL_DIALOG_BOX_CLOSE: "MODAL_DIALOG_BOX_CLOSE",

  DEVICE_SELECT: "DEVICE_SELECT",

  /*sidePaneStore use*/
  DROPDOWN_SHOW: "DROPDOWN_SHOW",
  DROPDOWN_HIDE: "DROPDOWN_HIDE",




  /* WebAPI use */
  MALCOLM_REQUEST_SUBTYPE_BLOCK: "BLOCK",
  MALCOLM_REQUEST_SUBTYPE_LAYOUT: "LAYOUT",
  MALCOLM_REQUEST_SUBTYPE_GENERIC: "GENERIC",
  MALCOLM_GET_SUCCESS: 'MALCOLM_GET_SUCCESS',
  MALCOLM_GET_FAILURE: 'MALCOLM_GET_FAILURE',
  MALCOLM_SUBSCRIBE_SUCCESS: 'MALCOLM_SUBSCRIBE_SUCCESS',
  MALCOLM_SUBSCRIBE_FAILURE: 'MALCOLM_SUBSCRIBE_FAILURE',
  MALCOLM_SUBSCRIBE_SUCCESS_LAYOUT: 'MALCOLM_SUBSCRIBE_SUCCESS_LAYOUT',
  MALCOLM_SUBSCRIBE_FAILURE_LAYOUT: 'MALCOLM_SUBSCRIBE_FAILURE_LAYOUT',
  MALCOLM_SUBSCRIBE_SUCCESS_BLOCK: 'MALCOLM_SUBSCRIBE_SUCCESS_BLOCK',
  MALCOLM_SUBSCRIBE_FAILURE_BLOCK: 'MALCOLM_SUBSCRIBE_FAILURE_BLOCK',
  MALCOLM_CALL_SUCCESS: 'MALCOLM_CALL_SUCCESS',
  MALCOLM_CALL_FAILURE: 'MALCOLM_CALL_FAILURE',
  MALCOLM_CALL_PENDING: 'MALCOLM_CALL_PENDING',
  MALCOLM_PUT_SUCCESS: 'MALCOLM_PUT_SUCCESS',
  MALCOLM_PUT_FAILURE: 'MALCOLM_PUT_FAILURE',
  MALCOLM_POST_SUCCESS: 'MALCOLM_POST_SUCCESS',
  MALCOLM_POST_FAILURE: 'MALCOLM_POST_FAILURE',

  INITIALISE_FLOWCHART_START: 'INITIALISE_FLOWCHART_START',
  INITIALISE_FLOWCHART_END: 'INITIALISE_FLOWCHART_END',
  INITIALISE_FLOWCHART_FAILURE: 'INITIALISE_FLOWCHART_FAILURE',

  /* Protocol metadata string constants */
  MALCOLM_TYPE_BOOL:   'bool',
  MALCOLM_TYPE_INT32:  'int32',
  MALCOLM_TYPE_UINT32: 'uint32',
  MALCOLM_TYPE_INT8:   'int8',
  MALCOLM_TYPE_UINT8:  'uint8',
  MALCOLM_TYPE_FLOAT64:'float64',
  MALCOLM_VALUE_ZERO:  'ZERO',

  /* Constants from flowChart added here */

  /* BLOCK use */

  INTERACTJS_DRAG: "INTERACTJS_DRAG",

  GATEBLOCK_CHANGEPOSITION: "GATEBLOCK_CHANGEPOSITION",
  DRAGGED_ELEMENTID: "DRAGGED_ELEMENTID",
  DRAGGED_ELEMENT: "DRAGGED_ELEMENT",
  CHANGE_BLOCKPOSITION: "CHANGE_BLOCKPOSITION",



  /* FLOWCHART use */

  SELECT_BLOCK: "SELECT_BLOCK",
  DESELECT_ALLBLOCKS: "DESELECT_ALLBLOCKS",
  SELECT_EDGE: "SELECT_EDGE",
  DESELECT_ALLEDGES: "DESELECT_ALLEDGES",

  CHANGE_GRAPHPOSITION: "CHANGE_GRAPHPOSITION",
  GRAPH_ZOOM: "GRAPH_ZOOM",

  GETANY_EDGESELECTEDSTATE: "GETANY_EDGESELECTEDSTATE",
  CLICKED_EDGE: "CLICKED_EDGE",

  PASS_PORTMOUSEDOWN: "PASS_PORTMOUSEDOWN",
  STORING_FIRSTPORTCLICKED: "STORING_FIRSTPORTCLICKED",
  DESELECT_ALLPORTS: "DESELECT_ALLPORTS",



  ADD_EDGEPREVIEW: "ADD_EDGEPREVIEW",
  UPDATE_EDGEPREVIEWENDPOINT: "UPDATE_EDGEPREVIEWENDPOINT",




  PORT_MOUSEOVERLEAVETOGGLE: "PORT_MOUSEOVERLEAVETOGGLE",
  PREVIOUS_MOUSECOORDSONZOOM: "PREVIOUS_MOUSECOORDSONZOOM",

  //APPEND_EDGESELECTEDSTATE: "APPEND_EDGESELECTEDSTATE",
  //APPENDTO_BLOCKSELECTEDSTATES: 'APPENDTO_BLOCKSELECTEDSTATES',



  /* sidebar use */

  TOGGLE_SIDEBAR: "TOGGLE_SIDEBAR",
  WINDOWWIDTH_MEDIAQUERYCHANGED: "WINDOWWIDTH_MEDIAQUERYCHANGED",

  /* BlockCollection use */
  BLOCKS_UPDATED: "BLOCKS_UPDATED",
  BLOCK_UPDATED: "BLOCK_UPDATED",
  LAYOUT_UPDATED: "LAYOUT_UPDATED",

  /* Websocket EventEmitter */
  WEBSOCKET_STATE: "WEBSOCKET_STATE",
};

module.exports = appConstants;
