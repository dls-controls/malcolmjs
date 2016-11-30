/**
 * Created by twi18192 on 10/12/15.
 */

let AppDispatcher = require('../dispatcher/appDispatcher.js');
let appConstants  = require('../constants/appConstants.js');
let EventEmitter  = require('events').EventEmitter;
let assign        = require('../../node_modules/object-assign/index.js');

let MalcolmActionCreators = require('../actions/MalcolmActionCreators');
let attributeStore        = require('./attributeStore');

import config from "../utils/config";
import BlockItem from '../classes/blockItems';

let update = require('react-addons-update');

let CHANGE_EVENT = 'change';

let _stuff = {
  blockList: null
};

let allBlockInfo = null;

let initialEdgeInfo = {};

let blockPositions = {};

function appendToBlockPositions(BlockId, xCoord, yCoord)
  {
  blockPositions[BlockId] = {
    x: xCoord * 1 / flowChartStore.getGraphZoomScale(),
    y: yCoord * 1 / flowChartStore.getGraphZoomScale()
  }
  }

function interactJsDrag(BlockInfo)
  {

  //let oldBlockPositions = blockPositions;
  //let oldBlockPositionsObject = blockPositions[BlockInfo.target];
  //let oldCounter1BlockPositions = blockPositions['COUNTER1'];

  //blockPositions[BlockInfo.target] = {
  //  x: blockPositions[BlockInfo.target].x + BlockInfo.x * (1 / flowChartStore.getGraphZoomScale()),
  //  y: blockPositions[BlockInfo.target].y + BlockInfo.y * (1 / flowChartStore.getGraphZoomScale())
  //};

  //blockPositions[BlockInfo.target].x = blockPositions[BlockInfo.target].x +
  //    BlockInfo.x * (1/flowChartStore.getGraphZoomScale());

  /* This works to alter individual object key values */
  //blockPositions[BlockInfo.target] = update(blockPositions[BlockInfo.target],
  //  {$merge : {x: blockPositions[BlockInfo.target].x +
  //  BlockInfo.x * (1/flowChartStore.getGraphZoomScale())}});
  //
  //blockPositions[BlockInfo.target].y = blockPositions[BlockInfo.target].y +
  //  BlockInfo.y * (1/flowChartStore.getGraphZoomScale());


  /* Testing React's immutability helper 'update' */

  blockPositions[BlockInfo.target] = update(blockPositions[BlockInfo.target], {
    $set: {
      x: blockPositions[BlockInfo.target].x + BlockInfo.x * (1 / flowChartStore.getGraphZoomScale()),
      y: blockPositions[BlockInfo.target].y + BlockInfo.y * (1 / flowChartStore.getGraphZoomScale())
    }
  });

  }


/* Functions to do with data retrieval from the server */

/* So what will happen is that an action will tell the server we want new info, it'll fetch it, and then
 return it to blockStore in the form of an object of some sort. From there you can do all sorts of things like update
 the value of a specific port of an existing block, add a port to an existing block etc.

 Depending on the action that triggered the data fetch from the server I'll know which one of these various things
 it was that I needed to do, so hopefully then I can trigger the correct function in blockStore after the data has
 been returned/fetched to blockStore successfully?
 */
function addBlock(blockAttributesObject)
  {
  // Strip off the block type instance number to just leave the type.
  let blockType = blockAttributesObject['BLOCKNAME'].value.replace(/[0-9]/g, '');

  let inports  = [];
  let outports = [];

  /* The use of the three variables below is to take care of the
   case when a block that is connected to another is added, but
   the other block it is connected to doesn't yet exist in the GUI.

   Inports of blocks are checked to see if they are connected to
   ports of other blocks. If the other block exists then great, simply
   add the info to allBlockInfo to both blocks' ports to reflect
   the connection.

   However, if the other OUTPORT block doesn't exist, then to
   account for this I add the name of the block and port that
   doesn't yet exist (in the format blockName.portName) to the
   initialEdgeInfo object as the key, and the key value is the
   name of the block that is currently being processed in the
   function (again, in the same format of blockName.portName)

   Then in the outports part it checks each outport to see if
   that particular block & port combination is in the
   initialEdgeInfo object (meaning that earlier on we ran into
   a INPORT block that was connected to the current OUPORT block,
   but the OUTPORT block didn't yet exist). If so, proceed to update
   both blocks in allBlockInfo to show that they are connected.
   */

  let initialEdgeInfoKeyName;
  let initialEdgeInfoKeyValueName;
  let outportsThatExistInInitialEdgeInfo = [];


  for (let attribute in blockAttributesObject)
    {

    if (blockAttributesObject[attribute].tags !== undefined)
      {
      for (let i = 0; i < blockAttributesObject[attribute].tags.length; i++)
        {
        let inportRegExp  = /flowgraph:inport/;
        let outportRegExp = /flowgraph:outport/;
        if (inportRegExp.test(blockAttributesObject[attribute].tags[i]) === true)
          {
          let inportName = attribute;

          /* Find the type of the inport value too,
           via the flowgraph tag
           */

          let inportValueType = blockAttributesObject[attribute].tags[i]
            .slice('flowgraph:inport:'.length);

          /* Need to check if the inport is connected to
           anything as well, so then edges will be preserved
           on a window refresh!
           */
          let inportValue = blockAttributesObject[attribute].value;

          /* Initially, the port is always added as being disconnected,
           even if it is connected. This is to accomodate not being able
           to add any edges until we can be certain that both involved
           blocks exist within the GUI/store
           */

          if (allBlockInfo[inportValue.slice(0, inportValue.indexOf('.'))] === undefined)
            {

            inports.push(
              {
                name       : inportName,
                type       : inportValueType,
                value      : String(inportValue),
                connected  : false,
                connectedTo: null
              }
            );

            if (inportValue.indexOf('ZERO') !== -1)
              {
              /* Then the block is connected to a .ZERO port,
               ie, it's disconnected, so no need to do anything
               */
              }
            else if (inportValue.indexOf('ZERO') === -1)
              {
              /* The inport is connected to an outport,
               so need to do more here
               */

              initialEdgeInfoKeyValueName = blockAttributesObject['BLOCKNAME'].value + "." + attribute;

              initialEdgeInfo[inportValue] = initialEdgeInfoKeyValueName;

              }
            }
          else if (allBlockInfo[inportValue.slice(0, inportValue.indexOf('.'))] !== undefined)
            {
            /* Then the outport block already exists, so can
             simply push the inport like normal!
             */

            console.log("outport block already exists, so can just add the wire initially!");
            console.log(initialEdgeInfo);

            let outportBlockName = inportValue.slice(0, inportValue.indexOf('.'));
            let outportName      = inportValue.slice(inportValue.indexOf('.') + 1);

            inports.push(
              {
                name       : inportName,
                type       : inportValueType,
                value      : String(inportValue),
                connected  : true,
                connectedTo: {
                  block: outportBlockName,
                  port : outportName
                }
              }
            );

            }

          }
        else if (outportRegExp.test(blockAttributesObject[attribute].tags[i]) === true)
          {
          let outportName = attribute;

          let outportValueType = blockAttributesObject[attribute].tags[i]
            .slice('flowgraph:outport:'.length);

          let outportValue = blockAttributesObject[attribute].value;

          initialEdgeInfoKeyName = blockAttributesObject['BLOCKNAME'].value + '.' + attribute;

          if (initialEdgeInfo[initialEdgeInfoKeyName] !== undefined)
            {
            outportsThatExistInInitialEdgeInfo.push(initialEdgeInfoKeyName);
            }

          outports.push(
            {
              name       : outportName,
              type       : outportValueType,
              value      : String(outportValue),
              connected  : false,
              connectedTo: []
            }
          )
          }
        }
      }

    }

  allBlockInfo[blockAttributesObject['BLOCKNAME'].value] = {
    type    : blockType,
    label   : blockAttributesObject['BLOCKNAME'].value,
    iconURL : blockAttributesObject['ICON'].value,
    name    : '',
    inports : inports,
    outports: outports
  };

  /* Now to go through the outportsThatExistInInitialEdgeInfo array
   and update both blocks involved in the connection
   */

  if (outportsThatExistInInitialEdgeInfo !== undefined &&
    outportsThatExistInInitialEdgeInfo.length > 0)
    {
    for (let k = 0; k < outportsThatExistInInitialEdgeInfo.length; k++)
      {
      updateAnInitialEdge(outportsThatExistInInitialEdgeInfo[k]);
      }
    }

  }

function removeBlock(blockId)
  {
  delete allBlockInfo[blockId];
  delete blockPositions[blockId];
  }

function updateAnInitialEdge(initialEdgeInfoKey)
  {

  let initialEdgeInfoValue = initialEdgeInfo[initialEdgeInfoKey];

  let outportBlockName = initialEdgeInfoKey.slice(0, initialEdgeInfoKey.indexOf('.'));
  let outportName      = initialEdgeInfoKey.slice(initialEdgeInfoKey.indexOf('.') + 1);

  let inportBlockName = initialEdgeInfoValue.slice(0, initialEdgeInfoValue.indexOf('.'));
  let inportName      = initialEdgeInfoValue.slice(initialEdgeInfoValue.indexOf('.') + 1);

  /* Now to go through allBlockInfo and change the connected
   attributes of the inports and outports to true
   */

  for (let i = 0; i < allBlockInfo[inportBlockName].inports.length; i++)
    {
    if (allBlockInfo[inportBlockName].inports[i].name === inportName)
      {
      allBlockInfo[inportBlockName].inports[i].connectedTo = {
        block: outportBlockName,
        port : outportName
      };
      allBlockInfo[inportBlockName].inports[i].connected   = true;
      }
    }

  for (let j = 0; j < allBlockInfo[outportBlockName].outports.length; j++)
    {
    if (allBlockInfo[outportBlockName].outports[j].name === outportName)
      {
      allBlockInfo[outportBlockName].outports[j].connectedTo.push({
        block: inportBlockName,
        port : inportName
      });
      allBlockInfo[outportBlockName].outports[j].connected = true;
      }
    }

  /* Now delete that particular key in initialEdgeInfo, I don't
   think it's needed anymore?
   */

  delete initialEdgeInfo[initialEdgeInfoKey];

  }

function addEdgeViaMalcolm(Info)
  {
  //window.alert(allBlockInfo[Info.inportBlock.label]);
  for (let i = 0; i < allBlockInfo[Info.inportBlock].inports.length; i++)
    {
    if (allBlockInfo[Info.inportBlock].inports[i].name === Info.inportBlockPort)
      {
      let addEdgeToInportBlock                              = {
        block: Info.outportBlock,
        port : Info.outportBlockPort
      };
      allBlockInfo[Info.inportBlock].inports[i].connected   = true;
      allBlockInfo[Info.inportBlock].inports[i].connectedTo = addEdgeToInportBlock;
      }
    }

  for (let j = 0; j < allBlockInfo[Info.outportBlock].outports.length; j++)
    {
    if (allBlockInfo[Info.outportBlock].outports[j].name === Info.outportBlockPort)
      {
      let addEdgeToOutportBlock                             = {
        block: Info.inportBlock,
        port : Info.inportBlockPort
      };
      allBlockInfo[Info.outportBlock].outports[j].connected = true;
      allBlockInfo[Info.outportBlock].outports[j].connectedTo.push(addEdgeToOutportBlock);
      }
    }

  }

function removeEdgeViaMalcolm(Info)
  {
  /* This is specifically for when there's a connection to
   BITS.ZERO and it means a disconnection rather than connect
   to the BITS.ZERO port
   */

  for (let i = 0; i < allBlockInfo[Info.inportBlock].inports.length; i++)
    {
    if (allBlockInfo[Info.inportBlock].inports[i].name === Info.inportBlockPort)
      {
      allBlockInfo[Info.inportBlock].inports[i].connected   = false;
      allBlockInfo[Info.inportBlock].inports[i].connectedTo = null;
      }
    }

  /* The BITS block doesn't necessarily exist, and its
   ZERO port is used specifically to show disconnected
   blocks, so there's no need to remove the info from
   the BITS block in allBlockInfo since it's not
   necessarily there, and it's unneeded anyway
   */

  }

let flowChartStore = require('./flowChartStore');

let blockStore = assign({}, EventEmitter.prototype, {

  addChangeListener   : function (cb)
    {
    this.on(CHANGE_EVENT, cb)
    },
  removeChangeListener: function (cb)
    {
    this.removeListener(CHANGE_EVENT, cb)
    },
  emitChange          : function ()
    {
    this.emit(CHANGE_EVENT)
    },

  getAllBlockInfo: function ()
    {

    if (allBlockInfo === null)
      {
      allBlockInfo = {};

      MalcolmActionCreators.initialiseFlowChart(config.getDeviceName());

      return {};
      }
    else
      {
      return allBlockInfo;
      }
    },

  getBlockPositions: function ()
    {
    return blockPositions;
    }

});


blockStore.dispatchToken = AppDispatcher.register(
  function (payload)
  {
  let action = payload.action;
  let item   = action.item;

  switch (action.actionType)
  {

    /* BLOCK use */

    case appConstants.INTERACTJS_DRAG:
      interactJsDrag(item);
      blockStore.emitChange();
      break;

    /* WebAPI use */

    case appConstants.MALCOLM_GET_SUCCESS:

      //AppDispatcher.waitFor([flowChartStore.dispatchToken]);

      /* Check if it's the initial FlowGraph structure, or
       if it's something else
       */

      //console.log('blockStore MALCOLM_GET_SUCCESS: item.responseMessage:');
      //console.log(item.responseMessage);
      if (item.responseMessage.hasOwnProperty('layout'))
        {
        for (let i = 0; i < item.responseMessage.layout.value.name.length; i++)
          {
          /* Do the block adding to testAllBlockInfo stuff */

          let blockName = item.responseMessage.layout.value.name[i];
          let xCoord    = item.responseMessage.layout.value.x[i];
          let yCoord    = item.responseMessage.layout.value.y[i];

          /* Add the block to allBlockInfo! */

          //console.log('blockStore MALCOLM_GET_SUCCESS: item.responseMessage - iteration:');
          //console.log(blockName);

          //        if (item.responseMessage.layout.value.visible[i] === true)
          //          {
          //console.log('blockStore MALCOLM_GET_SUCCESS:' + '  name: ' + blockName + ' -- item.responseMessage...visible : true');
          appendToBlockPositions(blockName, xCoord, yCoord);
          /* Pass addBlock the block object from allBlockAttributes in attributeStore
           instead of relying on testAllBlockInfo
           */
          AppDispatcher.waitFor([attributeStore.dispatchToken]);
          let obj = attributeStore.getAllBlockAttributes()[blockName];
          //console.log('blockStore MALCOLM_GET_SUCCESS:  obj -> ');
          //console.log(obj);
          if (Object.keys(obj).length !== 0)
            {
            addBlock(obj);
            // TODO: This is not efficient. Should consider calling blockStore.emitChange outside for loop.
            // IJG: 23/11/16
            blockStore.emitChange();
            }
          }
        }

      break;

    case
    appConstants.MALCOLM_GET_FAILURE:
      console.log("blockStore MALCOLM GET ERROR!");
      blockStore.emitChange();
      break;

    case appConstants.MALCOLM_SUBSCRIBE_SUCCESS:
      console.log("blockStore malcolmSubscribeSuccess");


      /* Check the tags for 'widget:combo', it'll be
       indicating that a dropdown was used (it'll also
       cause things like the dropdowns with 'triggered'
       and stuff to emit a change, but for now that'll
       work just fine
       */

      /* UPDATE: could also search for the 'flowgraph' tag
       to make sure that it's a inport dropdown menu and
       not any other type of attribute
       */

      /* Need to listen for block coordinate/position changes too */

      /* When a block is hidden, an error appears saying that
       blockPositions[requestedData.blockName] is undefined,
       since the block has in fact been removed from that object.
       I basically need to start doing unsubscriptions I think,
       the other way is to simply put another if statement here
       */

      if (item.requestedData.attribute === 'X_COORD')
        {

        /* Should first check if the position of the block isn't
         already equal to the position grabbed from the server:
         this is essentially because the block positions are updated
         locally as well as from the server, changing the position
         via the server is for when you have't dragged a block in
         the GUI, but change it via the server in some other way
         */

        let responseMessage = JSON.parse(JSON.stringify(item.responseMessage));
        let requestedData   = JSON.parse(JSON.stringify(item.requestedData));

        /* Undoing the zoom scale multiplication to check against
         the server's unscaled coords */

        /* When a block is removed/hidden, its coords get reset to
         (0,0), so need to check if they still exist in blockPositions
         in case a coord change I catch here is due to removing a block
         */

        if (blockPositions[requestedData.blockName] !== undefined)
          {

          if (blockPositions[requestedData.blockName].x * flowChartStore.getGraphZoomScale() !==
            responseMessage.value)
            {

            blockPositions[requestedData.blockName] = update(blockPositions[requestedData.blockName],
              {x: {$set: responseMessage.value * 1 / flowChartStore.getGraphZoomScale()}});

            blockStore.emitChange();
            }
          }

        }
      else if (item.requestedData.attribute === 'Y_COORD')
        {

        let responseMessage = JSON.parse(JSON.stringify(item.responseMessage));
        let requestedData   = JSON.parse(JSON.stringify(item.requestedData));

        /* Undoing the zoom scale multiplication to check against
         the server's unscaled coords */

        if (blockPositions[requestedData.blockName] !== undefined)
          {

          if (blockPositions[requestedData.blockName].y * flowChartStore.getGraphZoomScale() !==
            responseMessage.value)
            {

            blockPositions[requestedData.blockName] = update(blockPositions[requestedData.blockName],
              {y: {$set: responseMessage.value * 1 / flowChartStore.getGraphZoomScale()}});

            blockStore.emitChange();
            }
          }

        }

      let isInportDropdown = false;
      let hasFlowgraphTag  = false;

      console.log('blockStore MALCOLM_SUBSCRIBE_SUCCESS: item.responseMessage:');
      console.log(item.responseMessage);

      if (item.responseMessage.tags !== undefined)
        {
        for (let p = 0; p < item.responseMessage.tags.length; p++)
          {
          if (item.responseMessage.tags[p].indexOf('widget:combo') !== -1)
            {
            isInportDropdown = true;
            }
          else if (item.responseMessage.tags[p].indexOf('flowgraph') !== -1)
            {
            hasFlowgraphTag = true;
            }
          else if (item.responseMessage.tags[p] === 'widget:toggle')
            {

            /* What about when a block's own visible attribute gets changed? */

            if (item.requestedData.blockName === 'VISIBILITY')
              {
              if (item.responseMessage.value === 'Show')
                {
                /* Trying to add a block when its visibility is
                 changed to 'Show'
                 */

                appendToBlockPositions(item.requestedData.attribute,
                  flowChartStore.getGraphPosition().x, flowChartStore.getGraphPosition().y);

                /* Pass addBlock the block object from allBlockAttributes in attributeStore
                 instead of relying on testAllBlockInfo
                 */
                let obj = attributeStore.getAllBlockAttributes()[item.requestedData.attribute];

                if (Object.keys(obj).length !== 0)
                  {
                  addBlock(obj);
                  blockStore.emitChange();
                  }
                }
              else if (item.responseMessage.value === 'Hide')
                {
                /* Should invoke a removeBlock function to remove
                 the info from allBlockInfo
                 */
                removeBlock(item.requestedData.attribute);
                blockStore.emitChange();
                }
              }
            }
          }
        }

      if (isInportDropdown === true && hasFlowgraphTag === true)
        {
        /* Then update allBlockInfo with the new edge! */

        let requestedData   = JSON.parse(JSON.stringify(item.requestedData));
        let responseMessage = JSON.parse(JSON.stringify(item.responseMessage));

        let inportBlock     = requestedData.blockName;
        let inportBlockPort = requestedData.attribute;

        let outportBlock     = responseMessage.value.slice(0, responseMessage.value.indexOf('.'));
        let outportBlockPort = responseMessage.value.slice(responseMessage.value.indexOf('.') + 1);

        if (responseMessage.value.indexOf('ZERO') === -1)
          {

          addEdgeViaMalcolm({
            inportBlock     : inportBlock,
            inportBlockPort : inportBlockPort,
            outportBlock    : outportBlock,
            outportBlockPort: outportBlockPort
          });
          }
        else if (responseMessage.value.indexOf('ZERO') !== -1)
          {
          /* Then the edge needs to be deleted! */

          /* Update: note that this could also occur when the
           block with the inport is REMOVED via a toggle switch,
           so then in that case the edge has been removed when the
           block got deleted from allBlockInfo, ie, there's no need
           to remove the edge in that case as it has effectively
           already been done implicitly via block removal
           */

          if (allBlockInfo[inportBlock] !== undefined)
            {
            removeEdgeViaMalcolm({
              inportBlock    : inportBlock,
              inportBlockPort: inportBlockPort,
            });
            //console.log(allBlockInfo[inportBlock]);
            }

          }

        blockStore.emitChange();
        }


      break;

    case
    appConstants.MALCOLM_SUBSCRIBE_FAILURE
    :
      console.log("malcolmSubscribeFailure");
      //blockStore.emitChange();
      break;

    case
    appConstants.MALCOLM_CALL_SUCCESS
    :
      console.log("malcolmCallSuccess");
      //blockStore.emitChange();
      break;

    case
    appConstants.MALCOLM_CALL_FAILURE
    :
      console.log("malcolmCallFailure");
      //blockStore.emitChange();
      break;

    case
    appConstants.INITIALISE_FLOWCHART_START
    :
      //console.log("initialise flowChart start blockStore");
      //blockStore.emitChange();
      break;

    default:
      return true;
  }
  return ( true );
  })
;


module.exports = blockStore;
