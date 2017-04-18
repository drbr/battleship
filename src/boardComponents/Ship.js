const React = require('react');
const { DragSource } = require('react-dnd');

const DraggableTypes = require('../client/DraggableTypes');

const SHIP_CHAR = "🚢";

const dragSourceSpec = {
  beginDrag: (props) => ({
    size: props.size
  })
};

function dragSourceCollect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }
}

function ShipImage(props) {
  return (
    <span style={{ display: 'inline-block' }}>
      { new Array(props.size).fill(SHIP_CHAR) }
    </span>
  );
}

class Ship extends React.Component {

  render() {
    this.props.connectDragPreview(<div>HELLO WORLD</div>);
    // this.props.connectDragPreview(<div><ShipImage {...this.props} /></div>);
    return this.props.connectDragSource(
      <span><ShipImage {...this.props} /></span>
    );
  }
}

Ship.propTypes = {
  size: React.PropTypes.number
};

module.exports = DragSource(DraggableTypes.Ship, dragSourceSpec, dragSourceCollect)(Ship);