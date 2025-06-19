<script setup>
    import { useAuth } from '~~/composables/useAuth';
    const { login, loginWithGoogle, error } = useAuth();
    
    const emitRegisterForm = defineEmits(['registerForm']);
    const email = ref('');
    const password = ref('');
</script>

<template>
    <h1> Login Form </h1>
    <p> {{ error }} </p>

    <input type="email" placeholder="Email" v-model="email" />
    <input type="password" placeholder="Password" v-model="password" />
    <button @click="login(email, password)"> Entrar </button>

    <div>
        <p> Não tem uma conta? </p>
        <button @click="emitRegisterForm('registerForm')"> Cadastre-se </button>
        <p> ou </p>
        <button @click="loginWithGoogle"> Login com Google </button>
    </div>
</template>