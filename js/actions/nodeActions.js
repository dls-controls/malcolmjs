/**
 * Created by twi18192 on 10/12/15.
 */

var AppDispatcher = require('../dispatcher/appDispatcher.js');
var appConstants = require('../constants/appConstants.js');

var nodeActions = {
  changeGateNodePosition: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.GATENODE_CHANGEPOSITION,
      item: item
    })
  },
  draggedElement: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.DRAGGED_ELEMENT,
      item : item
    })
  },
  draggedElementID: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.DRAGGED_ELEMENTID,
      item : item
    })
  },
  changeNodePosition: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.CHANGE_NODEPOSITION,
      item: item
    })
  },

  selectNode: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.SELECT_NODE,
      item: item
    })
  },
  deselectAllNodes: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.DESELECT_ALLNODES,
      item: item
    })
  },
  selectEdge: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.SELECT_EDGE,
      item: item
    })
  },
  deselectAllEdges: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.DESELECT_ALLEDGES,
      item: item
    })
  },

  //changeGate1Styling: function(item){
  //    AppDispatcher.handleAction({
  //        actionType: appConstants.CHANGE_GATE1STYLING,
  //        item: item
  //    })
  //}

  changeGraphPosition: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.CHANGE_GRAPHPOSITION,
      item: item
    })
  },

  graphZoom: function(item){
    AppDispatcher.handleViewAction({
      actionType: appConstants.GRAPH_ZOOM,
      item: item
    })
  },
  pushNodeToArray: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.PUSH_NODETOARRAY,
      item: item
    })
  },
  pushEdgeToArray: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.PUSH_EDGETOARRAY,
      item: item
    })
  },

  getAnyEdgeSelectedState: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.GETANY_EDGESELECTEDSTATE,
      item: item
    })
  },
  clickedEdge: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.CLICKED_EDGE,
      item: item
    })
  },

  addToAllNodeInfo: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.ADDTO_ALLNODEINFO,
      item: item
    })
  },
  addEdgeToAllNodeInfo: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.ADDEDGE_TOALLNODEINFO,
      item: item
    })
  }
};

module.exports = nodeActions;
