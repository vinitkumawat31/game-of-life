import React, {Component} from 'react';
import './App.css';
import Grid from './grid';
class App extends Component{
  render(){
    return (
      <div className="container">
      <div className="App">
            <div className="page-header text-center" style={{marginTop:"20px",paddingTop:"9px",borderTop:"1px solid #eee"}}>
              <h1>GAME OF LIFE</h1>  
            </div>
        <div>
        <Grid rows={25} cols={25}/>
        </div>
      </div>
      </div>
    );
  };
}

export default App;