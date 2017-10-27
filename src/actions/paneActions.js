/**
 * Created by twi18192 on 17/09/15.
 */

import AppDispatcher from '../dispatcher/appDispatcher';
import appConstants from '../constants/appConstants';

let paneActions = {

  dropdownMenuSelect: function(tab){
    AppDispatcher.handleViewAction({
      actionType: appConstants.DROPDOWN_SELECT,
      item:tab
    })
  },
  deviceSelect: function(tab){
    AppDispatcher.handleViewAction({
      actionType: appConstants.DEVICE_SELECT,
      item: tab
    })
  },
  favTabOpen: function(item){
    AppDispatcher.handleViewAction({
      actionType: appConstants.FAVTAB_OPEN,
      item: item
    })
  },
  configTabOpen: function(item){
    AppDispatcher.handleViewAction({
      actionType: appConstants.CONFIGTAB_OPEN,
      item: item
    })
  },
  blockLookupTableTabOpen: function(item){
    AppDispatcher.handleViewAction({
      actionType: appConstants.BLOCKLOOKUPTABLETAB_OPEN,
      item: item
    })
  },

  openBlockTab: function(BlockId){
    AppDispatcher.handleViewAction({
      actionType: appConstants.OPEN_BLOCKTAB,
      item: BlockId
    })
  },
  removeBlockTab: function(item){
    AppDispatcher.handleViewAction({
      actionType: appConstants.REMOVE_BLOCKTAB,
      item: item
    })
  },

  toggleSidebar: function(item){
    AppDispatcher.handleViewAction({
      actionType: appConstants.TOGGLE_SIDEBAR,
      item: item
    })
  },

  openEdgeTab: function(item){
    AppDispatcher.handleViewAction({
      actionType: appConstants.OPEN_EDGETAB,
      item: item
    })
  },

  openModalDialogBox: function(item){
    AppDispatcher.handleViewAction({
      actionType: appConstants.MODAL_DIALOG_BOX_OPEN,
      item: item
    })
  },

  closeModalDialogBox: function(item){
    AppDispatcher.handleViewAction({
      actionType: appConstants.MODAL_DIALOG_BOX_CLOSE,
      item: item
    })
  },

};

export default paneActions;
