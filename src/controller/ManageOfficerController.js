import { UserModel } from '@/model/UserModel';

export const ManageOfficerController = {
    addUser: async (userData) => {
        try {
            const result = await UserModel.addUserWithRole(userData);
            return result;
        } catch (error) {
            throw error;
        }
    },
    getUsers: async () => {
        try {
            const users = await UserModel.listUsers();
            return users;
        } catch (error) {
            throw error;
        }
    },
    getOfficers: async () => {
        try {
            const officers = await UserModel.listOfficers();
            return officers;
        } catch (error) {
            throw error;
        }
    },
    deleteUser: async (uid) => {
        try {
            const result = await UserModel.deleteUser(uid);
            return result;
        } catch (error) {
            throw error;
        }
    },
};
