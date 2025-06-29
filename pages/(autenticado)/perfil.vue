<script setup>
  definePageMeta({ middleware: ['auth', 'cadastro'] });
  import { getToken } from '~/composables/useCadastro';
  const { cadastro, save } = useCadastro();
  const { isAuthLoading, logout } = useAuth();

  const editando = ref(false);
  const form = ref({});

  const editandoEndereco = ref(false);
  const formEndereco = ref({});

  watch(editando, (val) => {
    if (val) form.value = { ...cadastro.value };
  });

  watch(editandoEndereco, (val) => {
    if (val) formEndereco.value = { ...cadastro.value.endereco };
  });

  async function salvarPerfil() {
    try {
      const token = await getToken();
      const response = await $fetch('/api/cadastro', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: form.value
      });
      save(response);
      editando.value = false;
    } catch (e) {
      alert('Ocorreu um erro ao salvar o perfil: ' + e.message);
    }
  }

  async function salvarEndereco() {
    try {
      const token = await getToken();
      const response = await $fetch('/api/endereco', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formEndereco.value
      });
      cadastro.value = response;
      save(cadastro.value);
      editandoEndereco.value = false;
    } catch (e) {
      alert('Ocorreu um erro ao salvar o endereço: ' + e.message);
    }
  }
</script>

<template>
    <Header v-if="!isAuthLoading" />
  <Loading v-if="isAuthLoading" />
  <div v-else class="space-y-8 px-6 py-8">
    <section class="space-y-4 max-w-4xl mx-auto">
      <div class="bg-white p-6 rounded-lg shadow">
        <h1 class="text-2xl font-semibold mb-6">Perfil</h1>
        
        <div class="space-y-4">
          <div class="space-y-1">
            <h2 class="font-medium text-gray-700">Nome</h2>
            <p class="text-gray-800">{{ cadastro.nome }}</p>
          </div>
          <div class="space-y-1">
            <h2 class="font-medium text-gray-700">Email</h2>
            <p class="text-gray-800">{{ cadastro.email }}</p>
          </div>
          <div class="space-y-1">
            <h2 class="font-medium text-gray-700">Telefone</h2>
            <p class="text-gray-800">{{ cadastro.telefone }}</p>
          </div>
          <div class="space-y-1">
            <h2 class="font-medium text-gray-700">Modalidade</h2>
            <p class="text-gray-800">{{ cadastro.modalidade === 'presencial' ? 'Presencial' : 'Online' }}</p>
          </div>
          <div class="space-y-1">
            <h2 class="font-medium text-gray-700">Endereço</h2>
            <div v-if="cadastro.endereco" class="text-gray-800">
              <p>{{ cadastro.endereco.tipoLogradouro }} {{ cadastro.endereco.logradouro }}, Nº {{ cadastro.endereco.numero }}</p>
              <p>{{ cadastro.endereco.bairro }}, {{ cadastro.endereco.cidade }} - {{ cadastro.endereco.estado }}</p>
              <p>CEP: {{ cadastro.endereco.cep }}</p>
              <p v-if="cadastro.endereco.complemento">Complemento: {{ cadastro.endereco.complemento }}</p>
            </div>
            <p v-else class="text-gray-600">Endereço: Não informado</p>
          </div>
        </div>

        <div class="flex flex-wrap gap-3 mt-6">
          <button
            @click="editando = true"
            class="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Editar perfil
          </button>
          <button
            @click="editandoEndereco = true"
            class="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Editar endereço
          </button>
          <button
            @click="logout"
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Sair
          </button>
        </div>
      </div>
    </section>

    <!-- Modal de edição do perfil -->
    <div v-if="editando" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 class="text-xl font-semibold mb-4">Editar Perfil</h2>
        <form @submit.prevent="salvarPerfil" class="space-y-4">
          <div class="space-y-1">
            <label class="block font-medium">Nome</label>
            <input
              v-model="form.nome"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div class="space-y-1">
            <label class="block font-medium">Telefone</label>
            <input
              v-model="form.telefone"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div class="space-y-1">
            <label class="block font-medium">Modalidade</label>
            <select
              v-model="form.modalidade"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="presencial">Presencial</option>
              <option value="online">Online</option>
            </select>
          </div>
          <div class="flex gap-3 mt-4">
            <button
              type="submit"
              class="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Salvar
            </button>
            <button
              type="button"
              @click="editando = false"
              class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de edição do endereço -->
    <div v-if="editandoEndereco" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 class="text-xl font-semibold mb-4">Editar Endereço</h2>
        <form @submit.prevent="salvarEndereco" class="space-y-4">
          <div class="space-y-1">
            <label class="block font-medium">CEP</label>
            <input
              v-model="formEndereco.cep"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div class="space-y-1">
            <label class="block font-medium">Estado</label>
            <input
              v-model="formEndereco.estado"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div class="space-y-1">
            <label class="block font-medium">Cidade</label>
            <input
              v-model="formEndereco.cidade"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div class="space-y-1">
            <label class="block font-medium">Bairro</label>
            <input
              v-model="formEndereco.bairro"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div class="space-y-1">
            <label class="block font-medium">Tipo de Logradouro</label>
            <input
              v-model="formEndereco.tipoLogradouro"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div class="space-y-1">
            <label class="block font-medium">Logradouro</label>
            <input
              v-model="formEndereco.logradouro"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div class="space-y-1">
            <label class="block font-medium">Número</label>
            <input
              v-model="formEndereco.numero"
              type="number"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div class="space-y-1">
            <label class="block font-medium">Complemento</label>
            <input
              v-model="formEndereco.complemento"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div class="flex gap-3 mt-4">
            <button
              type="submit"
              class="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Salvar
            </button>
            <button
              type="button"
              @click="editandoEndereco = false"
              class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
