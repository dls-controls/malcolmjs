/**
 * Created by twi18192 on 18/01/16.
 */

var React = require('../../node_modules/react/react');
var ReactDOM = require('../../node_modules/react-dom/dist/react-dom.js');
var blockStore = require('../stores/blockStore.js');
var blockActions = require('../actions/blockActions.js');

function getBlockRectanglesState(){
  return {
    //portThatHasBeenClicked: NodeStore.getPortThatHasBeenClicked(),
    //allNodeTypesStyling: NodeStore.getAllNodeTypesStyling(),
  }
}

var BlockRectangles = React.createClass({
  //getInitialState: function(){
  //  return getNodeRectanglesState();
  //},
  //componentDidMount: function(){
  //  NodeStore.addChangeListener(this._onChange);
  //},
  //componentWillUnmount: function(){
  //  NodeStore.removeChangeListener(this._onChange);
  //},
  //_onChange: function(){
  //  this.setState(getNodeRectanglesState());
  //},

  shouldComponentUpdate: function(nextProps, nextState){
    return (
      nextProps.selected !== this.props.selected
    )
  },

  render: function(){
    //console.log("render: blockRectangles");

    var blockStyling = this.props.blockStyling;

    return(
      <g>
        <rect id={this.props.blockId.concat("Rectangle")}
              height={blockStyling.outerRectangleHeight} width={blockStyling.outerRectangleWidth}
              x={0} y={0} rx={8} ry={8}
              style={{fill: 'white', 'strokeWidth': 2,
               stroke: this.props.selected ? '#797979' : 'black',
               cursor: this.props.portThatHasBeenClicked === null ? "move" : "default"
               }}
          //onClick={this.nodeClick} onDragStart={this.nodeDrag}
        />
        <rect id={this.props.blockId.concat("InnerRectangle")}
              height={blockStyling.innerRectangleHeight} width={blockStyling.innerRectangleWidth}
              x={3} y={3} rx={6} ry={6}
              style={{fill: 'rgba(230,238,240,0.94)',
                       cursor: this.props.portThatHasBeenClicked === null ? "move" : "default"
                       }}
        />
      </g>
    )
  }

});

module.exports = BlockRectangles;
