import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import SelectProdukReducer from './SelectProdukReducer';
import SelectHistoryReducer from './SelectHistoryReducer';
import CartReducer from './CartReducer';

export default combineReducers({ 
    auth: AuthReducer,
    selectedProduk: SelectProdukReducer,
    selectedHistory: SelectHistoryReducer,
    loadOfCart: CartReducer
});