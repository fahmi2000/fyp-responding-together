<template>
    <form @submit.prevent="handleSubmit">
        <input type="text" required placeholder="username" v-model="userName">
        <input type="email" required placeholder="email" v-model="email">
        <input type="password" required placeholder="password" v-model="password">
        <div class="error">{{ error }}</div>
        <button type="submit">Sign up</button>
    </form>
</template>

<script>
import { ref } from 'vue' // Import ref from Vue
import useSignup from '../composables/useSignup'

export default {
    setup(props, context) {
        const { error, signup } = useSignup()
        const userName = ref('') // Reactive references for form fields
        const email = ref('')
        const password = ref('')
        
        const handleSubmit = async () => {
            await signup(email.value, password.value, userName.value)
            if (!error.value) {
                console.log('user sign ip')
                context.emit('signup')
            }
        }

        // Return everything that template needs to access
        return { userName, email, password, handleSubmit, error }
    }
}
</script>

<style>
/* Your CSS styles */
</style>
