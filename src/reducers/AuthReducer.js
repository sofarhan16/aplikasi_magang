import {
    USER_LOGIN_SUCCESS, 
    AUTH_SYSTEM_ERROR, 
    AUTH_LOADING, 
    LOGOUT,
    COOKIE_CHECKED
} from '../actions/types';

// const INITIAL_STATE = '';
const INITIAL_STATE = { id_agent:0,username: '' , error: '', loading: false, cookie: false, password: '', level:'',lastmember:``,limit:0};

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case USER_LOGIN_SUCCESS :
            return {...INITIAL_STATE,
                        id_agent:action.payload.id, 
                        username: action.payload.username, 
                        email: action.payload.email, 
                        cookie: true, 
                        password: action.payload.password, 
                        status: action.payload.status,
                        role: action.payload.role,
                        level:action.payload.level,
                        lastmember:action.payload.lastmember,
                        limit:action.payload.limit,
                        gambar: action.payload.gambar
                    };
            
        case AUTH_SYSTEM_ERROR :
            return {...INITIAL_STATE, error: action.payload, cookie: true};

        case AUTH_LOADING :
            return { ...state, loading: true};

        case LOGOUT :
            return {...INITIAL_STATE, cookie: true};

        case COOKIE_CHECKED :
            return { ...state, cookie: true }

        default :
            return state;


    }
}