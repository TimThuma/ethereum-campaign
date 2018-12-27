import React, { Component } from 'react';
import jdenticon from 'jdenticon';

class Jdenticon extends Component {
  componentDidMount() {
    jdenticon();
  }

  render() {
    return (
      <svg width={this.props.size} height={this.props.size} data-jdenticon-value={this.props.value}></svg>
    );
  }
}

export default Jdenticon;
