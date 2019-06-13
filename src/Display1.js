import React, { Component } from 'react'
class Display1 extends Component {
  render() {
    const string = this.props.data;
    return <div className="Display1"> {string} </div>
  }
}
export default Display1
