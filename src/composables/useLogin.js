import { ref } from "vue";
import { projectAuth } from "@/firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";

const error = ref(null);

const login = async (email, password) => {
    error.value = null;

    try {
        const res = await signInWithEmailAndPassword(projectAuth, email, password);
        console.log(res);
        return res;
    } catch (err) {
        console.error(err.message);
        error.value = 'Incorrect login credentials';
    }
};

const useLogin = () => {
    return { error, login };
};

export default useLogin;
