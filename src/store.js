import { createStore, combineReducers, compose } from 'redux';
import { reactReduxFirebase, firebaseReducer } from 'react-redux-firebase';
import { reduxFirestore, firestoreReducer } from 'redux-firestore';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

//Customs Reducers
import buscarUsuarioReducer from './reducers/buscarUsuariosReducer';

//Configurar firestore
const firebaseConfig = {
    apiKey: "AIzaSyA1ZBkMFoSSHvXIblRnuyNq1EmiXFAlZGo",
    authDomain: "bibliostore-4761c.firebaseapp.com",
    databaseURL: "https://bibliostore-4761c.firebaseio.com",
    projectId: "bibliostore-4761c",
    storageBucket: "bibliostore-4761c.appspot.com",
    messagingSenderId: "894453094719",
    appId: "1:894453094719:web:121cf908692e8ce2"
}

//Inicializar firebase
firebase.initializeApp(firebaseConfig);

//Conf. de react-redux
const rrfConfig = {
    userProfile: 'users',
    useFirestoreForProfile: true
}

//Crear enhacer con compose de redux y firestore
const createStoreWithFirebase = compose(
    reactReduxFirebase(firebase, rrfConfig),
    reduxFirestore(firebase)
)(createStore);

//Redcuer
const rootReducer = combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer,
    usuario: buscarUsuarioReducer
})

//State inicial
const initialState = {};

//Create el store
const store = createStoreWithFirebase(rootReducer, initialState, compose(
    reactReduxFirebase(firebase),
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
    window.__REDUX_DEVTOOLS_EXTENSION__()
));

export default store;