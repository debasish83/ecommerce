import {createStore, combineReducers, applyMiddleware} from 'redux'
import {thunk} from 'redux-thunk'
import {composeWithDevTools} from '@redux-devtools/extension'
import {cartReducer} from './reducers/cartReducers'
import { 
    userLoginReducer, 
    userRegisterReducer, 
    userDetailsReducer, 
    userUpdateProfileReducer,
} from './reducers/userReducers'

import {
    orderCreateReducer,
    orderDetailsReducer,
    orderPayReducer,
    orderListMyReducer,
} from './reducers/orderReducers'

const reducer = combineReducers({
    cart: cartReducer,
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderPay:  orderPayReducer,
    orderListMy: orderListMyReducer,
})

const cartItemsFromStorage = localStorage.getItem('cartItems') && localStorage.getItem('cartItems') !== 'undefined'? 
    JSON.parse(localStorage.getItem('cartItems')) : []

const userInfoFromStorage = localStorage.getItem('userInfo') && localStorage.getItem('userInfo') !== 'undefined'?
    JSON.parse(localStorage.getItem('userInfo')) : null

const shippingAddressFromStorage = localStorage.getItem('shippingAddress') && localStorage.getItem('shippingAddresss') !== 'undefined' ? 
    JSON.parse(localStorage.getItem('shippingAddress')) : {};

const initialState = {
    cart: {
        cartItems: cartItemsFromStorage, 
        shippingAddress: shippingAddressFromStorage
    },
    userLogin: {userInfo: userInfoFromStorage},
}

const middleware = [thunk]

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))

export default store
