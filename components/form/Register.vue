<script setup>
  import { useAuth } from '~~/composables/useAuth';
  const { register, error } = useAuth();

  const emitLoginForm = defineEmits(['loginForm']);
  const emailRegister = ref('');
  const passwordRegister = ref('');
  const confirmPassword = ref('');
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-blue-900 mb-4">Cadastro</h1>
    <p v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</p>

    <div class="space-y-4">
      <input
        type="email"
        placeholder="Email"
        v-model="emailRegister"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />
      <input
        type="password"
        placeholder="Senha"
        v-model="passwordRegister"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />
      <input
        type="password"
        placeholder="Confirme sua senha"
        v-model="confirmPassword"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />
      <button
        @click="register(emailRegister, passwordRegister, confirmPassword)"
        class="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold px-4 py-2 rounded-lg transition-colors"
      >
        Cadastrar
      </button>
    </div>

    <div class="text-center mt-6">
      <p class="text-gray-600">Já tem uma conta?</p>
      <button
        @click="emitLoginForm('loginForm')"
        class="mt-2 text-blue-600 hover:text-yellow-600 font-medium"
      >
        Faça login
      </button>
    </div>
  </div>
</template>
