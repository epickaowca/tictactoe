import * as firebase from 'firebase'

const firebaseConfig = {
  apiKey: "ApiKey",
  authDomain: "tictactoe-bf9ad.firebaseapp.com",
  databaseURL: "UrlDataBase",
  projectId: "projectId",
  storageBucket: "Storage",
  messagingSenderId: "107857933474",
  appId: "appId",
  measurementId: "meansureId"
};
const Fireb = firebase.initializeApp(firebaseConfig);
firebase.analytics();
//FirebaseConfig is hidden!
export default Fireb;