import React, {Component} from 'react';
import './Box.css';
class Box extends Component{
  render(){
  	var i = this.props.x;
  	var j = this.props.y;
    return (
      <div className={this.props.boxClass} onClick = {()=>{this.props.selectBox(i,j)}}>
      </div>
    );
  };
}

export default Box;