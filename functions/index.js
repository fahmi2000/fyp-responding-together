const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp({
    credential: admin.credential.cert(require('./firebase_admin_sdk.json'))
});

// Import Firestore
const firestore = admin.firestore();

exports.addUser = functions.https.onCall(async (data) => {
    const { email, password } = data;

    try {
        const userRecord = await admin.auth().createUser({
            email: email,
            emailVerified: false,
            password: password
        });

        const uidOfficer = userRecord.uid; // Get the UID of the newly created user

        return { uid: uidOfficer, message: `User ${email} created successfully.` };
    } catch (error) {
        console.error('Error creating user:', error);
        throw new functions.https.HttpsError('internal', 'Failed to create user: ' + error.message);
    }
});

exports.deleteUser = functions.https.onCall(async (data) => {
    const { uid } = data;

    try {
        await admin.auth().deleteUser(uid);
        return { message: `Successfully deleted user with UID: ${uid}` };
    } catch (error) {
        throw new functions.https.HttpsError('internal', 'Error deleting user: ' + error.message);
    }
});

exports.listUsers = functions.https.onCall(async () => {
    try {
        let users = [];
        let listUsersResult = await admin.auth().listUsers();
        users = listUsersResult.users.map((userRecord) => {
            return {
                uid: userRecord.uid,
                emailVerified: userRecord.emailVerified,
            };
        });

        return { users };
    } catch (error) {
        throw new functions.https.HttpsError('internal', error.message);
    }
});
