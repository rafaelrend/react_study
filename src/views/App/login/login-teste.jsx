import React from 'react';
import ReactDOM from "react-dom";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import IconAdd  from "@material-ui/icons/Add";
import { Api }  from '../../../library/Api.js';


class LoginTeste extends React.Component {
        constructor(props){
        super(props);


         this.state = { item: { login: "rafaelrend@gmail.com", senha: "rrend1" } , retorno: "", list_users: "", botao_usuario: false }
         this.changeValue = this.changeValue.bind(this);

         this.clickUser = this.clickUser.bind(this);

  }

  changeValue(event, propertie){
                let novo = event.target.value;
                let item = this.state.item;

                item[propertie] = novo;
                this.setState({  item: item});
  }

  clickUser(event){

             Api.Call("api/users/","GET",{}).then(
                      (response) => {

                               
	                     		     	 this.setState( {retorno2: JSON.stringify(  response.data )  } );
                      }
             	);
  }

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


  render(){
                   var  style= { display: "none" }; 

                   if ( this.state.botao_usuario ){
                   	   style= {};
                   }


  	                        return (    
                                     <div>
                                        <div className="col-xs-12">
                                                 <TextField
                                                      label="Login"
                                                      id="margin-none" fullWidth={true}
                                                                               
                                                       onKeyPress={(e) => this.changeValue(e, "login")}
                                                      value={this.state.item.login}
                                                     
                                                    />

                                                      <TextField
                                                      label="Senha"
                                                      id="margin-none" fullWidth={true}
                                                                               
                                                       onKeyPress={(e) => this.changeValue(e, "senha")}
                                                      value={this.state.item.senha}
                                                     
                                                    />



                                                                 <Button color="primary" variant="outlined" 
                                                                   aria-label="new" onClick={(e) => this.login(e)}>
                                                                  Login
                                                                </Button>

                                                                {this.state.retorno}



                                                                   <Button color="primary" variant="outlined" 
                                                                   aria-label="new" style={style} onClick={(e) => this.clickUser(e)}>
                                                                  Lista de Usuários
                                                                </Button>


                                                                {this.state.retorno2}


                                        </div>

                              
                                     </div>
                              );


  }

}

export default LoginTeste;