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

exports.listUsers = functions.https.onCall(async (data, context) => {
    // Optional: Check authentication and permissions
    if (!context.auth) {
        throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.');
    }

    try {
        let users = [];
        let listUsersResult = await admin.auth().listUsers();
        users = listUsersResult.users.map((userRecord) => {
            return {
                uid: userRecord.uid,
                email: userRecord.email,
                displayName: userRecord.displayName,
                customClaims: userRecord.customClaims
            };
        });

        return { users };
    } catch (error) {
        throw new functions.https.HttpsError('internal', error.message);
    }
});

exports.listOfficers = functions.https.onCall(async (data, context) => {
    // Check authentication (optional based on your security rules)
    if (!context.auth) {
        throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.');
    }

    try {
        let users = [];
        let nextPageToken;
        do {
            // Fetch batch of users
            const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
            nextPageToken = listUsersResult.pageToken;

            // Filter users who have the 'Officer' role in their custom claims
            const officers = listUsersResult.users.filter(user => user.customClaims && user.customClaims.role === 'Officer');
            users = users.concat(officers.map(userRecord => {
                return {
                    uid: userRecord.uid,
                    email: userRecord.email,
                    displayName: userRecord.displayName,
                    role: userRecord.customClaims.role
                };
            }));
        } while (nextPageToken);

        return { users };
    } catch (error) {
        throw new functions.https.HttpsError('internal', error.message);
    }
});

exports.deleteUser = functions.https.onCall((data, context) => {

    const { uid } = data;

    return admin.auth().deleteUser(uid)
        .then(() => {
            return { message: `Successfully deleted user with UID: ${uid}` };
        })
        .catch((error) => {
            throw new functions.https.HttpsError('internal', 'Error deleting user: ' + error.message);
        });
});