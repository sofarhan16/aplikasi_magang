// action creator
import axios from 'axios';
import {
    USER_LOGIN_SUCCESS, 
    AUTH_SYSTEM_ERROR, 
    AUTH_LOADING, 
    LOGOUT,
    COOKIE_CHECKED,
    SELECT_PRODUK,
    SELECT_HISTORY,
    CART_LOAD
} from './types';
import {KONEKSI} from '../support/config';

export const cookieChecked = () => {
    return { type: COOKIE_CHECKED }
}

export const onUserRegister = ({ username, email, phone, password}) => {
    return (dispatch) => {
        dispatch({ type: AUTH_LOADING });

        if(username === '' || email === '' || phone === '' || password === ''){
            dispatch({ type: AUTH_SYSTEM_ERROR, payload: 'Semua form di atas wajib diisi !'})
        } else {
         
            axios.post(`${KONEKSI}/auth/register`, { 
                username, email, password, phone 
            }).then((res) => {
                console.log(res);
                if(res.data.status === 'error'){
                    dispatch({type: AUTH_SYSTEM_ERROR, payload: res.data.message})
                }
                else{
                    console.log(res.data);
                    dispatch({type: USER_LOGIN_SUCCESS, payload: res.data})
                }                
            }).catch((err)=> {
                console.log(err);
                dispatch({type: AUTH_SYSTEM_ERROR, payload: 'Login Failed'})
            })
            
        }
        
    }
}

export const keepLogin = (username) => {
    return (dispatch) => {
        axios.post(`${KONEKSI}/auth/keeplogin`, {username}
        ).then((res) => {
            console.log(res.data[0]);
            dispatch({
                type: USER_LOGIN_SUCCESS,
                payload: res.data[0]
                // di halaman /verify : email di atas masih bikin problem
            })
        })
    }
    
    // return { type: USER_LOGIN_SUCCESS, payload: username }
}

export const onUserLogout = () => {
    return ({type: LOGOUT})
}

export const onUserLogin = ({ username, password }) => { 

    return (dispatch) => {
        
        dispatch({ type: AUTH_LOADING });

        axios.post(`${KONEKSI}/auth/signin`, { username, password}
        ).then((res) => {
            console.log(res);
            
            if(res.data.length > 0){
                dispatch({type: USER_LOGIN_SUCCESS, payload: {username, id_agent:res.data[0].id ,email: res.data[0].email, password, role: res.data[0].role, status: res.data[0].status, level:res.data[0].level,lastmember:res.data[0].lastmember, limit:res.data[0].limit }})
                var lastlogin = res.data[0].lastlogin;
                var lastmember =res.data[0].lastmember;
                if(lastlogin>=lastmember){
                axios.post(`${KONEKSI}/auth/deletemember`,{
                    username
                }
                ).then((res2)=>{
                    console.log(res2.data)
                    axios.post(`${KONEKSI}/auth/signin`, { username, password}
                    ).then((res3) => {
                        console.log(res3);
                        
                        if(res3.data.length > 0){
                            dispatch({type: USER_LOGIN_SUCCESS, payload: {username, id_agent:res3.data[0].id ,email: res3.data[0].email, password, role: res3.data[0].role, status: res3.data[0].status, level:res3.data[0].level,lastmember:res3.data[0].lastmember, limit:res3.data[0].limit }})
                        }
                        
                    }).catch((err3) => {
                        console.log(err3)
                        dispatch({type: AUTH_SYSTEM_ERROR, payload: 'Login Failed'})
                    })
                }).catch((err2)=>{
                    console.log(err2)
                })
               }
            } else {
                dispatch({type: AUTH_SYSTEM_ERROR, payload: 'Username or password invalid'})
            }
            
        }).catch((err) => {
            console.log(err)
            dispatch({type: AUTH_SYSTEM_ERROR, payload: 'Login Failed'})
        })
        
    }
}

export const onUserVerified = (userData) => {
    return {
        type: USER_LOGIN_SUCCESS,
        payload: userData
    }
}

export const select_produk = (selectedProduk) => {
    return {
        type: SELECT_PRODUK,
        payload: selectedProduk
    }
}

export const select_history = (selectedHistory) => {
    return {
        type: SELECT_HISTORY,
        payload: selectedHistory
    }
}

export const loadOfCart = ({id_agent}) => {
    return (dispatch) => {
        axios.post(`${KONEKSI}/transaction/countcart`, 
            { id_agent } 
        ).then((res) => {
            console.log(res.data)
            dispatch({type: CART_LOAD, payload: res.data.count})
        }).catch((err) => {
            console.log(err);
        })
    }
}