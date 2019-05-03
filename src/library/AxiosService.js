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


                                                           console.log(error.response.data);
                                                         console.log(error.response.status);
                                                         console.log(error.response.headers);

                           let originalRequest = error.config;
                              if (  error.response.status == 401 &&  originalRequest.headers['Authorization'] != null && false ){
                                
                                           let token_refresh = Api.getTokenUser("refresh_token"); //pegar a chave de refresh que veio do método TOKEN.

                                            return new Promise( (resolve, reject) => {

                                                                Api.Call("token/refresh/", "POST", { refresh: token_refresh }).then((response) => {

                                                                        if (response.status == 200) {
                                                                                  //Armazenamos o novo Token novo.
                                                                                  originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
                                                                        }

                                                                      resolve(response);

                                                                }).catch(e => {
                                                                      reject(error); //Vou retornar o erro 401 mesmo..
                                                                })

                                            }).then( (response) => {
                                                       return axios(originalRequest);
                                            }).catch(e => {
                                                       return error;
                                                       //app.router.push('/login');
                                            });

                                  }else{

                                         return error;  //Um aoutra situação de erro qualquer.
                                  }




              } else {
                           return error;
              }
  }
});