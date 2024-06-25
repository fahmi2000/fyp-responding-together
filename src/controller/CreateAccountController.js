// // src/controllers/CreateAccountController.js
// import { ref } from 'vue';
// import * as UserModel from '../model/UserModel';

// const error = ref(null);

// const signup = async (email, password, userName) => {
//     error.value = null;

//     try {
//         const res = await UserModel.createAccount(email, password);
//         if (!res) {
//             throw new Error('Could not complete the signup!');
//         }
//         if (userName) {
//             await UserModel.updateUserProfile(res.user, userName);
//         }
//         console.log(`Signup successful. User ID: ${res.user.uid}, Display Name: ${res.user.displayName}`);
//     } catch (err) {
//         console.error(err.message);
//         error.value = err.message;
//     }
// };

// export default function useCreateAccount() {
//     return {
//         error, signup
//     };
// }
