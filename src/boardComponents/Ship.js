const React = require('react');
const _ = require('underscore');

const SHIP_CHAR = "🚢";

class Ship extends React.Component {
  render() {
    return (
      <div>
        { new Array(this.props.size).fill(SHIP_CHAR) }
      </div>
    );
  }
}

Ship.propTypes = {
  size: React.PropTypes.number
};

module.exports = Ship;