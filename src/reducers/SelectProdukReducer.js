import {
    SELECT_PRODUK
} from '../actions/types';

// const INITIAL_STATE = '';
const INITIAL_STATE = {id: '', nama_produk: '', harga: 0, berat: 0, deskripsi: '', negara: '',kategori:'', gambar: ''};

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        
        case SELECT_PRODUK :
            return action.payload;

        default :
            return state;
    }
}