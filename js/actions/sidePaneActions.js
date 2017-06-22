/**
 * Created by twi18192 on 01/09/15.
 */

import AppDispatcher from '../dispatcher/appDispatcher';
import appConstants from '../constants/appConstants';

let sidePaneActions = {

  dropdownMenuShow: function(item){
    AppDispatcher.handleViewAction({
      actionType: appConstants.DROPDOWN_SHOW,
      item: item
    })
  },
  dropdownMenuHide: function(item){
    AppDispatcher.handleViewAction({
      actionType: appConstants.DROPDOWN_HIDE,
      item: item
    })
  },

};

export {sidePaneActions as default}
