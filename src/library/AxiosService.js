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

    console.log("ERRO no axios ");
    console.log(error);


         //rrend Testar se tenho authorization..
         //rrend Obter o token antigo..
         if ( error.response ) { 
                           let originalRequest = error.config;

                                                         console.log("axios error");
                                                         //console.log(error.response.data);
                                                         //console.log(error.response.status);
                                                         //console.log(error.response.headers);
                                                         console.log( originalRequest.url +" - " );
                                                         var errorData = JSON.parse( error.response.data );

                                                         console.log( errorData );
                                                         console.log("Original reqquest: ");
                                                         console.log( originalRequest );

                              if (  error.response.status == 401 && errorData.code == "token_not_valid" 
                                 &&  originalRequest.headers['Authorization'] != null  && originalRequest.url.indexOf("token/refresh") < 0 ){


                                            /*
                                                                                            {
                                                    "detail": "Given token not valid for any token type",
                                                    "code": "token_not_valid",
                                                    "messages": [
                                                        {
                                                            "token_class": "AccessToken",
                                                            "token_type": "access",
                                                            "message": "Token is invalid or expired"
                                                        }
                                                    ]
                                                } */

                                                console.log("Tentando renovar o token..");

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

                                         return error;  //Um aoutra situação de erro qualquer.
                                  }




              } else {
                           return error;
              }
  }
});