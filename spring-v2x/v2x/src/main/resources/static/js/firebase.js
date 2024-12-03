const firebaseConfig = {
    apiKey: "AIzaSyA30oeQyhOF4BTOXmx1n-dPWbrSnuio6Pg",
    authDomain: "iitp-devportal.firebaseapp.com",
    projectId: "iitp-devportal",
    storageBucket: "iitp-devportal.appspot.com",
    messagingSenderId: "438148142746",
    appId: "1:438148142746:web:9141e23f0e5446752a3123"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

navigator.serviceWorker.register('/firebase-messaging-sw.js')

messaging.onMessage((payload) => {
    Log.d('Message received. ', payload);
    const title = payload.notification.title
    const options = {
        body : payload.notification.body,
        icon : payload.notification.image
    }
    navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, options);
    })
});

function getFcmToken() {
    messaging.getToken({vapidKey: 'BPMyVo_Joo67b6NS_0agg0z3l-iEMWwOK195vTgKYrNk6lWSqvrxa9TecoVagmi9X-gWuPg3xO1GDgSxfkVVdn4'}).then((currentToken) => {
        if (currentToken) {
            Log.d("currenttttttokekn : ", currentToken)
            sendTokenToServer(currentToken);
        } else {
            Log.d('No registration token available. Request permission to generate one.');
            setTokenSentToServer(false);
        }
    }).catch((err) => {
        Log.d('An error occurred while retrieving token. ', err);
        setTokenSentToServer(false);
    });
}

function sendTokenToServer(currentToken) {
    if (!isTokenSentToServer()) {
        let params = new URLSearchParams();
        params.append('fcm-token', currentToken);

        axios.post('/common/account/fcm/token', params)
            .then(function(response) {
                Log.d( 'sendTokenToServer -> response.data : ', response.data );
                let data = response.data;
                if ( data.result != "ok")
                    setTokenSentToServer(false);
                else
                    setTokenSentToServer(true);
            })
            .catch(function(error) {
                Log.d('sendTokenToServer() -> error=', error);
                setTokenSentToServer(false);
            });
    } else {
        Log.d('Token already sent to server so won\'t send it again unless it changes');
    }
}

function isTokenSentToServer() {
    Log.d('sentToServer!!!!?', window.localStorage.getItem('sentToServer') === '1')
    return window.localStorage.getItem('sentToServer') === '1';
}

function setTokenSentToServer(sent) {
    window.localStorage.setItem('sentToServer', sent ? '1' : '0');
}

function requestPermission() {
    Log.d('Requesting permission...');
    Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
            Log.d('Notification permission granted.');
            getFcmToken();
        } else {
            Log.d('Unable to get permission to notify.');
        }
    });
}

function deleteToken() {
    // Delete registration token.
    messaging.getToken().then((currentToken) => {
        messaging.deleteToken(currentToken).then(() => {
            Log.d('Token deleted.');
            setTokenSentToServer(false);
            mv("/login/logout.do")
        }).catch((err) => {
            Log.d('Unable to delete token. ', err);
        });
    }).catch((err) => {
        Log.d('Error retrieving registration token. ', err);
    });
}

requestPermission();