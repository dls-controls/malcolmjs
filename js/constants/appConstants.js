/**
 * Created by twi18192 on 25/08/15.
 */

var appConstants = {
  /*mainPaneStore use*/
  FOOTER_TOGGLE: "FOOTER_TOGGLE",
  CONFIG_TOGGLE: "CONFIG_TOGGLE",
  FAV_TOGGLE: "FAV_TOGGLE",

  /*paneStore use*/

  REMOVE_TAB: "REMOVE_TAB",
  DROPDOWN_SELECT: "DROPDOWN_SELECT",
  FAVTAB_OPEN: "FAVTAB_OPEN",
  CONFIGTAB_OPEN: "CONFIGTAB_OPEN",
  BLOCKLOOKUPTABLETAB_OPEN: 'BLOCKLOOKUPTABLETAB_OPEN',

  OPEN_BLOCKTAB: "OPEN_BLOCKTAB",
  REMOVE_BLOCKTAB: "REMOVE_BLOCKTAB",
  OPEN_EDGETAB: "OPEN_EDGETAB",


  /*sidePaneStore use*/
  DROPDOWN_SHOW: "DROPDOWN_SHOW",
  DROPDOWN_HIDE: "DROPDOWN_HIDE",
  PASS_SIDEPANE: "PASS_SIDEPANE",



  TEST_WEBSOCKET: "TEST_WEBSOCKET",

  /* WebAPI use */

  SERVER_REQUESTPENDING: 'SERVER_REQUESTPENDING',
  TEST_DATAFETCH:'TEST_DATAFETCH',
  TEST_SUBSCRIBECHANNEL: 'TEST_SUBSCRIBECHANNEL',
  TEST_WRITE_SUCCESS: 'TEST_WRITE_SUCCESS',
  TEST_WRITE_FAILURE: 'TEST_WRITE_FAILURE',
  TEST_INITIALDATAFETCH_PENDING: 'TEST_INITIALDATAFETCH_PENDING',
  TEST_INITIALDATAFETCH_SUCCESS: 'TEST_INITIALDATAFETCH_SUCCESS',
  TEST_INITIALDATAFETCH_FAILURE: 'TEST_INITIALDATAFETCH_FAILURE',
  TEST_FETCHINITIALBLOCKOBJECT_SUCCESS: 'TEST_FETCHINITIALBLOCKOBJECT_SUCCESS',
  TEST_FETCHINITIALBLOCKOBJECT_FAILURE: 'TEST_FETCHINITIALBLOCKOBJECT_FAILURE',
  GET_BLOCKLIST_SUCCESS: 'GET_BLOCKLIST_SUCCESS',
  GET_BLOCKLIST_FAILURE: 'GET_BLOCKLIST_FAILURE',
  MALCOLM_GET_SUCCESS: 'MALCOLM_GET_SUCCESS',
  MALCOLM_GET_FAILURE: 'MALCOLM_GET_FAILURE',
  MALCOLM_SUBSCRIBE_SUCCESS: 'MALCOLM_SUBSCRIBE_SUCCESS',
  MALCOLM_SUBSCRIBE_FAILURE: 'MALCOLM_SUBSCRIBE_FAILURE',
  MALCOLM_CALL_SUCCESS: 'MALCOLM_CALL_SUCCESS',
  MALCOLM_CALL_FAILURE: 'MALCOLM_CALL_FAILURE',

  INITIALISE_FLOWCHART_START: 'INITIALISE_FLOWCHART_START',
  INITIALISE_FLOWCHART_END: 'INITIALISE_FLOWCHART_END',
  INITIALISE_FLOWCHART_FAILURE: 'INITIALISE_FLOWCHART_FAILURE',

  /* Constants from flowChart added here */

  /* BLOCK use */

  ADDTO_ALLBLOCKINFO: "ADDTO_ALLBLOCKINFO",
  INTERACTJS_DRAG: "INTERACTJS_DRAG",
  ADD_ONESINGLEEDGETOALLBLOCKINFO: "ADD_ONESINGLEEDGETOALLBLOCKINFO",
  DELETE_EDGE: "DELETE_EDGE",

  FETCHINITIAL_BLOCKDATA: "FETCHINITIAL_BLOCKDATA",


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
};

module.exports = appConstants;
