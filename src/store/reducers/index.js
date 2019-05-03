import { BookReducer } from './BookReducer';
// import { OtherReducer } from './otherReducer';


import { combineReducers } from 'redux';

export const Reducers = combineReducers({
  BookState: BookReducer
     // , otherState: otherReducer
});