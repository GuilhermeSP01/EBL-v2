<script setup>
  import { useCadastro } from '#imports';
  const { save } = useCadastro();
  const { $auth } = useNuxtApp();

  const props = defineProps({
    turma: { type: Object, required: true }
  });

  const cadastro = ref({
    nome: $auth.currentUser.displayName || '',
    turmaId: props.turma._id,
    modalidade: 'online',
    email: $auth.currentUser.email,
    telefone: '',
  });

  const error = ref(null);
  const isLoading = ref(false);
  const telefoneFormatado = ref('');

  const submit = async () => {
    if (isLoading.value) return;

    try {
      isLoading.value = true;
      error.value = null;

      if (cadastro.value.telefone.length !== 11) {
        error.value = 'Informe um número de telefone válido';
        isLoading.value = false;
        return;
      }

      const response = await $fetch('/api/cadastro', {
        method: 'POST',
        body: cadastro.value
      });

      save(response);
      navigateTo('/aulas');
    } catch (e) {
      error.value = e.message || 'Ocorreu um erro ao se inscrever';
    } finally {
      isLoading.value = false;
    }
  };

  const formatarTelefone = (value) => {
    let digits = value.replace(/\D/g, '');
    digits = digits.substring(0, 11);
    if (digits.length >= 2) digits = `(${digits.substring(0, 2)}) ${digits.substring(2)}`;
    if (digits.length > 9) digits = `${digits.substring(0, 10)}-${digits.substring(10)}`;
    return digits;
  };

  const onInputTelefone = (event) => {
    let value = event.target.value.replace(/\D/g, ''); // Remove não dígitos
    if (value.length > 11) {
        value = value.slice(0, 11);
    }
    cadastro.value.telefone = value;
    telefoneFormatado.value = formatarTelefone(value);
    event.target.value = telefoneFormatado.value;
  };


  watch(() => cadastro.value.telefone, (newValue) => {
    telefoneFormatado.value = formatarTelefone(newValue);
  });
</script>

<template>
  <div>
    <form @submit.prevent="submit" class="space-y-6">
      <div class="space-y-2">
        <label for="nome" class="block text-sm font-medium text-gray-700">Nome</label>
        <input
          type="text"
          id="nome"
          v-model="cadastro.nome"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>
      <div class="space-y-2">
        <label for="telefone" class="block text-sm font-medium text-gray-700">Telefone</label>
        <input
            type="tel"
            id="telefone"
            v-model="telefoneFormatado"
            @input="onInputTelefone"
            required
            placeholder="(00) 00000-0000"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />


      </div>
      <div class="space-y-2">
        <label for="modalidade" class="block text-sm font-medium text-gray-700">Modalidade</label>
        <select
          id="modalidade"
          v-model="cadastro.modalidade"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <option value="online">Online</option>
          <option value="presencial">Presencial</option>
        </select>
      </div>
      <button
        type="submit"
        :disabled="isLoading"
        class="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold px-4 py-3 rounded-lg transition-colors disabled:opacity-50"
      >
        <span v-if="!isLoading">Enviar</span>
        <span v-else>Enviando...</span>
      </button>
      <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>
      <div class="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Os dados informados podem ser alterados posteriormente.</span>
    </div>
    </form>
  </div>
</template>
