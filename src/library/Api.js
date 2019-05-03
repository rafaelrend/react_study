import React from 'react';
import axios from 'axios';
import Constants from '../views/App/Constants.jsx'
import db from './mydatabase';

class ApiHttp {


			  constructor() {
			  	// url_api
			    //this.firstname = firstname;
			    //this.lastname = lastname;

			    this.access_token = "";
			    this.refresh_token = "";
			  }

			  CallPublic(tipo, method, data){

	                     let promise1 = new Promise( (resolve, reject) => {


				                        let url =  Constants.URL_API2 +  tipo; 

	                     		  axios({
										  method: method,
										  url: url,
										  data: data  }).
	                     		     then((response) => {

	                     		     	 resolve(response);

							          })
									    .catch((error) => {

											 reject(error);
								     })				

			                      });

	                     return promise1 
	          }
	          getTokenUser(prop){
                       
 /*
                       var collection = await db.user.where('id').equals(1);
                       var token = {};

                       collection.each(function(item) {

                       	       console.log("found"); console.log( item );
                       	       return item;
                       	      // token = item[prop];
						     //console.log('Found: ' + friend.name + ' with phone number ' + friend.phone);
						});

                       return token;

                       */


                      return new Promise ( function ( resolve  ) { 


                                            var collection = db.user;

                                             collection.each(function(item) {

						                       	       console.log("found"); console.log( item );
						                       	       resolve( item ) ;
						                       	      // token = item[prop];
												     //console.log('Found: ' + friend.name + ' with phone number ' + friend.phone);
												});


                                          //  resolve(  collection[0]  ) ;

                                        }

                       	);


                /*
                        

							var users = await db.user.first().then((item) => {

								   if ( item ){

                                              return item[prop];

								   }
                                   else
                                   {

                                   	       return "";

                                   }
                                                     

							});

                          */

	          }

	          storeUser( user ){

                user["id"] = 1;
	          	console.log("vou tentar salvar..");
	          	console.log(user);


	          	      db.user.put( user);
	          }

			  Call( tipo , method, data ) {

                   //fn_success, fn_error
				   //usar indexedDb.

               
				let promise1 = new Promise( (resolve, reject) => {

				this.getTokenUser("access_token").then ( 

				                 (user) => {

				                 	console.log("Tentando mostrar promisse ");

				                 	console.log(user);


											                        let url =  Constants.URL_API2 +  tipo; 
											                        var token = user.access_token;

													                console.log("Token enviado: " + 'Bearer '+token );



																	        axios({
																					  method: method,
																					  url: url,
																					  data: data,
																				      headers: {
													                                          Authorization:'Bearer '+token,
																						      "Content-Type": "application/json"
																				      }
																					})
																		    .then((response) => {

								                     		     	                    resolve(response);
																		    })
																		    .catch((error) => {
																		        // Error
																		        if (error.response) {
																		        	//console.log( error.response );

																		        	if ( error.response.status == 401){
																		        		//Token já vou expirado.. vamos chamar a renovação do token.
																		        		  console.log("Erro 401 de Token Expirado, vamos renovar o token");
																		        		 
																		        	}

																		        	reject( error );

																		        	//   console.log(error.response.data);
																		            // console.log(error.response.status);
																		            // console.log(error.response.headers);
																		            // The request was made and the server responded with a status code
																		            // that falls out of the range of 2xx
																		          
																		        } else if (error.request) {

																		        	reject( error );
																		        } else {
																		            // Something happened in setting up the request that triggered an Error

																		        	reject( error );
																		        }
																		        console.log(error.config);
																		    });
														});




				                 });

						 return promise1;

	                 

			  }

}

let Api = new ApiHttp();

export { Api };