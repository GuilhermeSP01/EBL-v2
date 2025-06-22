<script setup>
  import { ref } from 'vue';
  const loginForm = ref(true);
  const emit = defineEmits(['close']);
</script>

<template>
  <transition name="fade">
    <div class="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
        <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full relative">
        <!-- Botão de fechar -->
        <button
            @click="emit('close')"
            class="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
        <!-- Conteúdo do modal -->
        <div v-if="loginForm">
            <FormLogin @registerForm="loginForm = false" />
        </div>
        <div v-else>
            <FormRegister @loginForm="loginForm = true" />
        </div>
        </div>
    </div>
  </transition>
</template>

<style scoped>
    .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
    }

    .fade-enter-from, .fade-leave-to {
    opacity: 0;
    }
</style>