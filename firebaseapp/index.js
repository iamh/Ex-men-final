// Initialize Firebase
import firebase from 'firebase'

let config = {
  apiKey: 'AIzaSyDKr3z-BIyKAHvlAKXlh4VzJrVSMecgurM',
  databaseURL: 'https://examen-f78bc.firebaseio.com',
  authDomain: 'examen-f78bc.firebaseapp.com',
  storageBucket: 'examen-f78bc.appspot.com'
}

let firebaseApp

if (firebase.apps.length === 0) {
  firebaseApp = firebase.initializeApp(config)
} else {
  firebaseApp = firebase.apps[0]
}

export default firebaseApp
