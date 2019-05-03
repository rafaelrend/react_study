import { GRID_PAGE, GRID_ORDER } from '../action/actionTypes.js';

/*
export const clickButton = function(event, id_button , item) {

           type: id_button,
           item: item,
           lastEvent: event,
}
*/


export const clickStoreButton = (event, id_button , item) => ({
           type: id_button,
           item: item,
           lastEvent: event,
});