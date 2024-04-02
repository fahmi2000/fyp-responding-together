<template>
    <form @submit.prevent="handleSubmit">
        <input type="email" required placeholder="email" v-model="email">
        <input type="password" required placeholder="password" v-model="password">
        <div class="error">{{ error }}</div>
        <button type="submit">Log in</button>
    </form>
</template>

<script>
import { ref } from 'vue' // Import ref from Vue
import useLogin from '@/composables/useLogin'
export default {
    setup(props, context) {
        const email = ref('')
        const password = ref('')

        const { error, login } = useLogin()
        
        const handleSubmit = async () => {
            await login(email.value, password.value)
            if (!error.value) {
                console.log('user logged in')
                context.emit('login')
            }
        }

        // Return everything that template needs to access
        return { email, password, handleSubmit, error }
    }
}
</script>

<style>
/* Your CSS styles */
</style>
