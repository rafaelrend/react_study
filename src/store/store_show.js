import React from 'react';
import {Store} from './index.js'

class StoreShow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
    };

    Store.subscribe(() => {
      // When state will be updated(in our case, when items will be fetched), 
      // we will update local component state and force component to rerender 
      // with new data.
        var s = Store.getState();
        var arr = [];

        Object.keys(s.BookState).map(function(data){
               arr[arr.length] = s.BookState[data]; // {title: s.BookState[data]} ;
        });

       //  var out = Object.keys(s).map(function(data){
       //        return [data,s[data]];
       // });




      this.setState({
              items: arr // Store.getState().BookState
      });


        console.log("A store recebeu algo? ");
        console.log( Store.getState() ); console.log( arr );
    });
  }

  render() {

    const listItems = this.state.items.map((item) =>
       <div>{item}</div>
       );


    return (
      <div><h4>Exibindo dados da STORE REDUX
         {listItems}
      </h4>
       
      </div>
    );
  }
};

export default  StoreShow;