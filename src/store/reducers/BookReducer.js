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