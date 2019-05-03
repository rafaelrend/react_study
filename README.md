
# REDUX 
90% esta na pasta src/store

* [a relative link](src/store/reducers/BookReducer.js)
```javascript
import { GRID_PAGE, GRID_ORDER } from '../action/actionTypes.js';


const initialState = {
          grid_order: "id", grid_order_type: 'asc', lastEvent: null,
          page: 1
};


//{order_type: order_type, column_id: column_id }

export const BookReducer = (state = initialState, action) => {

   console.log("Reducer Teste: " + action.type);

    console.log( state );

  switch (action.type) {
  
    case GRID_PAGE:
      return {
        ...state,
        page: action.page,
        lastEvent: action.event
      };
    case GRID_ORDER:
      return {
        ...state,
        grid_order_type: action.item.order_type,
        grid_order: action.item.column_id,
        lastEvent: action.event
      };


    default:
      return state;
  }
}; 
```
* [a relative link](src/store/reducers/index.js)
```javascript
import { BookReducer } from './BookReducer';
// import { OtherReducer } from './otherReducer';


import { combineReducers } from 'redux';

export const Reducers = combineReducers({
  BookState: BookReducer
     // , otherState: otherReducer
});
```

* [a relative link](src/store/index.js)
```javascript
import { createStore } from 'redux';
import { Reducers } from './reducers';

export const Store = createStore(Reducers);
```


* [a relative link](src/views/App/book/book.jsx) 
```javascript
 //imports
 import { GRID_PAGE, GRID_ORDER } from "../../../store/action/actionTypes.js"
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { clickStoreButton } from '../../../store/action';
(...)
 
//Clicou no botão, chama o action que esta mapeado no props. 
ClickButtonGrid(event, id_button , item){

    this.props.clickStoreButton(event, id_button, item);
	
}
(....)
//Mapeamentos feitos no final do arquivo
const mapStateToProps = store => ({
    CurrentColumnOrder: store.BookState.CurrentColumnOrder,
    CurrentColumnOrderType: store.BookState.CurrentColumnOrderType,
    page: store.BookState.CurrentColumnOrderType
});

//CurrentColumnOrder: "id", CurrentColumnOrderType: 'asc'
const mapDispatchToProps = dispatch =>
  bindActionCreators({ clickStoreButton }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Book);
```
*  [a relative link](src/store/store_show.js)  Simples componente para mostrar quando a store tem seus valores modificados.
```javascript
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

		//BookState foi criado em /store/reducers/index.js
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
```


# INDEXEDDB
* [a relative link](src/library/mydatabase.js) 
```javascript
//Definindo a estrutura dos dados que serão armazenados.
import Dexie from 'dexie';

const db = new Dexie('myDb');
db.version(1).stores({
    user: `id, login, access_token, refresh_token`
});

export default db;
```
* [a relative link](src/library/Api.js) 
```javascript
   //Salvando um objeto (coloquei uma id para ter um identificador local, mas não é a id do usuário.
      storeUser( user ){

                      user["id"] = 1;
	          	      db.user.put( user);
	          }
   
   (...)
   
   //Obtendo os dados de um usuário já salvo antes.
       getTokenUser(prop){
                       

                      return new Promise ( function ( resolve, reject  ) { 


                                            var collection = db.user;

                                             collection.each(function(item) {
						                       	       resolve( item ) ;
												});

                                              collection.count( function(count) {

                                              	if ( count <= 0 ){
                                              		reject({error: "empty user"} );
                                              	}

                                              } );
                                        }

                       	);

	          }


```

# AXIOS - MIDDLEWARE para renovar o Token.

* [a relative link](src/library/AxiosService.js) 
```javascript
import axios from 'axios';
import { Service } from 'axios-middleware';
import { Api } from './Api';

const service = new Service(axios);

service.register({
  onRequest(config) {
    console.log('onRequest');
    return config;
  },
  onSync(promise) {
    //console.log('onSync');
    return promise;
  },
  onResponse(response) {
    //console.log('onResponse');
    return response;
  },
  onResponseError(error){

         //rrend Testar se tenho authorization..
         //rrend Obter o token antigo..
         if ( error.response ) { 
                           let originalRequest = error.config;
                           let errorData = JSON.parse( error.response.data );

                              if (  error.response.status == 401 && errorData.code == "token_not_valid" 
                                 &&  originalRequest.headers['Authorization'] != null  && originalRequest.url.indexOf("token/refresh") < 0 ){


                                     Api.getTokenUser("access_token").then ( 

                                               (user) => {

                                
                                                               let token_refresh = user.refresh_token; //pegar a chave de refresh que veio do método TOKEN.

                                                                return new Promise( (resolve, reject) => {

                                                                                    console.log("Vou passar pra ele o novo token: " + token_refresh );

                                                                                    Api.Call("token/refresh/", "POST", { refresh: token_refresh }).then((response) => {

                                                                                            if (response.status == 200) {
                                                                                                      console.log("Token Renovado!");

                                                                                                      //Armazenamos o novo Token novo.
                                                                                                      originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;

                                                                                                      user.token_acess = response.data.access;
                                                                                                      console.log("Registrando o usuário no indexedDB");
                                                                                                      Api.storeUser( user );
                                                                                            }

                                                                                          resolve(response);

                                                                                    }).catch(e => {
                                                                                          reject(error); //Vou retornar o erro 401 mesmo..
                                                                                    })

                                                                }).then( (response) => {
                                                                           console.log("Returnando o axios? ");
                                                                           return  axios(originalRequest) ;
                                                                }).catch(e => {
                                                                           return error;
                                                                           //app.router.push('/login');
                                                                });

                                                }).catch( (caterror) => { return error ;  } );//não achou token.

                                  }else{

                                         return error;  //Um outra situação de erro qualquer.
                                  }




              } else {
                           return error;
              }
  }
});
```

* [a relative link](src/index.js) 
```javascript
     //Chama o middleware para configurar o axios.
     require('./library/AxiosService.js');

```


* [a relative link](src/views/App/login/login-teste.jsx) 
```javascript
    (...)
     //Método de Login
       login(event){

                 if ( this.state.item.login != "" &&  this.state.item.senha != "" ){

                         Api.CallPublic("token/","POST", {username:  this.state.item.login, password: this.state.item.senha }).
                                    then((response) => {

                                         console.log("Sucesso!")
	                     		     	 console.log(response);

	                     		     	 this.setState( {retorno: JSON.stringify(  response.data ) , botao_usuario: true } );

	                     		     	 var user = {login:this.state.item.login, access_token: response.data.access, refresh_token:  response.data.refresh }

	                     		     	 Api.storeUser( user );


							          }).catch((error) => {

                                         console.log("Erro!")
	                     		     	 console.log(error);
								     });				

                 }

  }
  
  //Buscando usuários com o Authentication
  clickUser(event){

             Api.Call("api/users/","GET",{}).then(
                      (response) => {


                                 if ( response != undefined && response.data != undefined ){
                                              this.setState( {retorno2: JSON.stringify(  response.data )  } );

                                 }else{
                                               this.setState( {retorno2: "data vazio?"  } );

                                 }
                               
                      }
             	);
  }

```

# Referências

https://blog.bam.tech/developper-news/4-ways-to-dispatch-actions-with-redux

http://rendti.com.br/react/dashboard/

https://emileber.github.io/axios-middleware/#/

https://gist.github.com/mkjiau/650013a99c341c9f23ca00ccb213db1c#gistcomment-2576767    com interceptor

https://stackoverflow.com/questions/51230501/how-can-we-maintain-user-logged-in-when-access-token-expires-and-we-need-to-logi

# algumas instalações utilizadas.
npm install dexie

npm install react-detect-offline

<img src="http://www.rendti.com.br/react/demo_react2.gif" />
