<script setup> 
    const { $auth } = useNuxtApp();
    const showAuthCard = ref(false);

    const handleLogin = async () => {
        if ($auth.currentUser) {
            navigateTo('/aulas');
        } else {
            showAuthCard.value = true;
        };
    }
</script>

<template>
    <h1> Home </h1>
    <p> Página de apresentação do curso </p>

    <button @click="handleLogin"> Login </button>
    <CardAuth v-show="showAuthCard" @close="showAuthCard = false" />
</template>