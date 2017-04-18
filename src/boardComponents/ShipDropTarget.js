const React = require('react');

const { DropTarget } = require('react-dnd');
const DraggableTypes = require('../client/DraggableTypes');

const DropTargetSpec = {
  drop(props, monitor) {
    let item = monitor.getItem();
    alert(`A ship of size ${item.size} has been dropped!`);
  }
};

function DropTargetCollect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

const defaultStyle = {
  width: 100,
  height: 100,
}

class ShipDropTarget extends React.Component {
  render() {
    let style = {...defaultStyle};
    style.backgroundColor = this.props.isOver ? 'red' : 'blue';
    return this.props.connectDropTarget(<div style={ style } />);
  }
}

module.exports = DropTarget(DraggableTypes.Ship, DropTargetSpec, DropTargetCollect)(ShipDropTarget);
