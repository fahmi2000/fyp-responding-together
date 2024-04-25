const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp({
    credential: admin.credential.cert(require('./firebase_admin_sdk.json'))
});

exports.addUserWithRole = functions.https.onCall(async (data) => {
    const { email, password } = data;

    try {
        const user = await admin.auth().createUser({
            email: email,
            emailVerified: false,
            password: password,
            disabled: false
        });

        // Set the custom user claim to 'Officer' statically
        await admin.auth().setCustomUserClaims(user.uid, { role: 'Officer' });

        return { message: `User ${email} created with role Officer.` };
    } catch (error) {
        throw new functions.https.HttpsError('internal', error.message);
    }
});
