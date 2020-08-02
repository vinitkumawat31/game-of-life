import React, {Component} from 'react';
//import './grid.css';
import Box from './box';
class Grid extends Component{

  constructor(props, context){
  	super(props, context);

  	this.state = {
  		generation:0,
  		gridArray: Array(this.props.rows).fill().map(() => Array(this.props.cols).fill(0)),
  		active: new Map()
  	}
  	this.intervalId = 0;
  	//this.active = new Map();
  }

  selectBox = (i,j) => {
  	var gridArray = this.state.gridArray;
  	var active = this.state.active;
  	if(gridArray[i][j] === 0){
  		gridArray[i][j] = 1;
  	}
  	else{
  		gridArray[i][j] = 0;
  	}
  	if(active.has(i)){
  			if(active.get(i).has(j)){
  				active.get(i).delete(j);
	  			if(active.get(i).size === 0)
	  				active.delete(i);
  			}
  			else{
  				active.get(i).set(j,1);
  			}
  		}
	else{
		active.set(i,new Map());
		active.get(i).set(j,1);
	}

  	this.setState({
  		gridArray:gridArray,
  		active:active
  	});
  }

  reset = () =>{
  	this.setState({
  		generation:0,
  		gridArray:Array(this.props.rows).fill().map(() => Array(this.props.cols).fill(0)),
  		active: new Map()
  	});
  }

  startEvolution = () =>{
  	var gen = this.state.generation;
  	var active = this.state.active;
  	var rows = this.props.rows;
  	var cols = this.props.cols;
  	var nbr = new Map();
  	var gA = Array(rows).fill().map(() => Array(cols).fill(0));
  	//store neighbours of active cells
  	for (let i of active.keys()){
  		var M = active.get(i);
  		for(let j of M.keys()){
  			if(nbr.has(i)){
				if(!nbr.get(i).has(j)){
					nbr.get(i).set(j,0);
				}
			}
			else{
				nbr.set(i,new Map());
				nbr.get(i).set(j,0);
			}
  			for(var x=-1;x<=1;x++){
				for(var y=-1;y<=1;y++){
					if(!(y===0&&x===0)){
						if(nbr.has(i+x)){
							if(nbr.get(i+x).has(j+y)){
								var n = nbr.get(i+x).get(j+y);
								nbr.get(i+x).set(j+y,n+1);
							}
							else{
								nbr.get(i+x).set(j+y,1);
							}
						}
						else{
							nbr.set(i+x,new Map());
							nbr.get(i+x).set(j+y,1);
						}
					}
				}
			}
  		}
  	}
  	//add or remove from active according to survival rules
  	for (let i of nbr.keys()){
  		var M = nbr.get(i);
  		for(let j of M.keys()){
  			var n = M.get(j);
  			var alive = 0;
  			if(active.has(i)){
  				if (active.get(i).has(j))
  					alive = 1;
  			}
  			if(alive === 1){
   				if(n<2 || n>3){
   					active.get(i).delete(j);
		  			if(active.get(i).size === 0)
		  				active.delete(i);
   				}
   			}
   			else{
   				if(n === 3){
					if(active.has(i)){
			  			active.get(i).set(j,1);
			  		}
			  		else{
			  			active.set(i,new Map());
			  			active.get(i).set(j,1);
			  		}
   				}
   			}
  		}
  	}
  	//console.log(this.active);
  	for (let i of active.keys()){
  		var M = active.get(i);
  		for(let j of M.keys()){
  			if(i>=0&&i<rows){
  				if(j>=0&&j<cols){
  					gA[i][j] = 1;
  				}
  			}
  		}
  	}
  	gen++;
   	this.setState({
   		gridArray: gA,
   		generation: gen,
   		active:active
   	});
  }
  evolve = () =>{
  	clearInterval(this.intervalId);
  	this.intervalId = setInterval(this.startEvolution,200);
  }

  stop = ()=>{
  	clearInterval(this.intervalId);
  }

  render(){
  	const width = this.props.cols*17;
  	var box_array = [];
	for(var i=0;i<this.props.rows;i++){
   		for( var j=0;j<this.props.cols;j++){
   			//var id = i+"_"+j;
   			if(this.state.gridArray[i][j] === 0)
   				box_array.push(<Box boxClass="box off" x={i} y={j} selectBox={this.selectBox}/>);
   			else
   				box_array.push(<Box boxClass="box on" x={i} y={j} selectBox={this.selectBox}/>);
   		}
       }
    return (
    	<div>
	      <div className="row" style={{marginBottom:10}}>
		      <div className="col-md-1"></div>
		      <div className="col-md-2">
		      	<button type="button" className="btn btn-primary" onClick={this.reset}>Reset</button>
		      </div>
		      <div className="col-md-2">
		      	<button type="button" className="btn btn-success" onClick={this.evolve}>Start</button>
		      </div>
		      <div className="col-md-2">
		      	<button type="button" className="btn btn-danger" onClick={this.stop}>Stop</button>
		      </div>
		      <div className="col-md-3"><h3 style={{margin:"auto" }}>Generation : {this.state.generation}</h3></div>
		   	  <div className="col-md-2"></div>
		   </div>
		   <hr/>
	      <div className="row">
	      	  <div className="col-md-12" >
			      <div className="grid row" style={{width:width,margin:"auto",lineHeight:0}}>
			     		{box_array}
			      </div>
		      </div>
	      </div>
	      <hr/>
      </div>
    );
  };
}

export default Grid;


 /*startEvolution = () =>{
  	var gen = this.state.generation;
  	var rows = this.props.rows;
  	var cols = this.props.cols;
	var gA = this.state.gridArray;
	var nbr = Array(rows).fill().map(() => Array(cols).fill(0));
	for(var i=0;i<rows;i++){
		for( var j=0;j<cols;j++){
			for(var x=-1;x<=1;x++){
				for(var y=-1;y<=1;y++){
					if(!(y===0&&x===0)){
						if(gA[(i+x+rows)%rows][(j+y+cols)%cols] === 1)
							nbr[i][j]++;
					}
				}
			}
		}
    }
    for(i=0;i<rows;i++){
   		for(j=0;j<cols;j++){
   			if(gA[i][j] === 1){
   				if(nbr[i][j]<2)
   					gA[i][j] = 0;
   				else if(nbr[i][j]>3){
   					gA[i][j] = 0;
   				}
   			}
   			else{
   				if(nbr[i][j] === 3)
   					gA[i][j] = 1;
   			}
   		}
   	}
   	gen++;
   	this.setState({
   		gridArray: gA,
   		generation: gen
   	});
  }*/