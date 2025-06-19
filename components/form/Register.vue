<script setup>
    import { useAuth } from '~~/composables/useAuth';
    const { register, error } = useAuth();

    const emitLoginForm = defineEmits(['loginForm']);
    const emailRegister = ref('');
    const passwordRegister = ref('');
    const confirmPassword = ref('');
</script>

<template>
    <h1> Register Form </h1>
    <p> {{ error }} </p>

    <input type="email" placeholder="Email" v-model="emailRegister" />
    <input type="password" placeholder="Password" v-model="passwordRegister" />
    <input type="password" placeholder="Confirm Password" v-model="confirmPassword" />
    <button @click="register(emailRegister, passwordRegister, confirmPassword)"> Cadastrar </button>

    <div>
        <p> Ja tem uma conta? </p>
        <button @click="emitLoginForm('loginForm')"> Login </button>
    </div>
</template>