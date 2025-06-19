<script setup>
    const loginForm = ref(true);
    const emitClose = defineEmits(['close']);
</script>

<template>
    <div>
        <button @click="emitClose('close')"> Fechar </button>
        <div v-if="loginForm">
            <FormLogin @registerForm="loginForm = false" />
        </div>
        <div v-else>
            <FormRegister @loginForm="loginForm = true" />
        </div>
    </div>
</template>