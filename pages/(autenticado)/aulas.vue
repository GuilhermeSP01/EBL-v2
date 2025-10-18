<script setup>
  definePageMeta({ middleware: ['auth', 'cadastro'] });
  const { isAuthLoading } = useAuth();
  const { aulas, loadAulas } = useAulas();
  const { cadastro, load, save } = useCadastro();

  const editandoEndereco = ref(false);
  const formEndereco = ref({});
  const isLoadingEndereco = ref(false);
  const errorEndereco = ref(null);

  // CEP formatado
  const cepFormatado = ref('');

  function formatarCEP(value) {
    let digits = value.replace(/\D/g, '').substring(0, 8);
    if (digits.length > 5) digits = `${digits.substring(0, 5)}-${digits.substring(5)}`;
    return digits;
  }

  function onInputCEP(event) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    formEndereco.value.cep = value;
    cepFormatado.value = formatarCEP(value);
    event.target.value = cepFormatado.value;
  }

  watch(() => formEndereco.value.cep, (newValue) => {
    cepFormatado.value = formatarCEP(newValue || '');
  });

  onMounted(async () => {
    await load();
    loadAulas();
    // Se não tem endereço, abre o formulário automaticamente
    if (!cadastro.value?.endereco) {
      editandoEndereco.value = true;
      formEndereco.value = {};
    }
  });

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  function gerarChaveLocalStorage(userId, tipoConteudo, aulaId) {
    return `user_${userId}_${tipoConteudo}_${aulaId}`;
  };

  function salvarStatusVisualizacao(userId, tipoConteudo, aulaId, status) {
    const chave = gerarChaveLocalStorage(userId, tipoConteudo, aulaId);
    localStorage.setItem(chave, status);
  };

  function recuperarStatusVisualizacao(userId, tipoConteudo, aulaId) {
    const chave = gerarChaveLocalStorage(userId, tipoConteudo, aulaId);
    return localStorage.getItem(chave) === 'true';
  };

  const aprovações = computed(() => {
    if (!cadastro.value || !cadastro.value.envios) return 0;
    return aulas.value.filter(aula => {
      const envio = cadastro.value.envios.find(envio => envio.aulaId === aula.id);
      return envio && Array.isArray(envio.questoes) && envio.questoes.filter(q => q.correta === true).length >= 2;
    }).length;
  });

  const reprovações = computed(() => {
    if (!cadastro.value || !cadastro.value.envios) return 0;
    return aulas.value.filter(aula => {
      const envio = cadastro.value.envios.find(envio => envio.aulaId === aula.id);
      if (envio && Array.isArray(envio.questoes)) {
        return envio.questoes.filter(q => q.correta === true).length < 2;
      } else {
        return new Date(aula.dataFechamento) <= new Date();
      }
    }).length;
  });

  async function salvarEndereco() {
    if (isLoadingEndereco.value) return;
    isLoadingEndereco.value = true;
    errorEndereco.value = null;

    // Validações
    if (!formEndereco.value.cep || formEndereco.value.cep.length !== 8) {
      errorEndereco.value = 'Informe um CEP válido (8 dígitos)';
      isLoadingEndereco.value = false;
      return;
    }
    if (!formEndereco.value.estado || formEndereco.value.estado.length < 2) {
      errorEndereco.value = 'Informe o estado corretamente';
      isLoadingEndereco.value = false;
      return;
    }
    if (!formEndereco.value.cidade) {
      errorEndereco.value = 'Informe a cidade';
      isLoadingEndereco.value = false;
      return;
    }
    if (!formEndereco.value.bairro) {
      errorEndereco.value = 'Informe o bairro';
      isLoadingEndereco.value = false;
      return;
    }
    if (!formEndereco.value.tipoLogradouro) {
      errorEndereco.value = 'Informe o tipo de logradouro';
      isLoadingEndereco.value = false;
      return;
    }
    if (!formEndereco.value.logradouro) {
      errorEndereco.value = 'Informe o logradouro';
      isLoadingEndereco.value = false;
      return;
    }
    if (!formEndereco.value.numero || isNaN(formEndereco.value.numero)) {
      errorEndereco.value = 'Informe o número corretamente';
      isLoadingEndereco.value = false;
      return;
    }

    try {
      const token = await getToken?.();
      const response = await $fetch('/api/endereco', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formEndereco.value
      });
      cadastro.value.endereco = response;
      save(cadastro.value);
      editandoEndereco.value = false;
    } catch (e) {
      errorEndereco.value = e.message || 'Ocorreu um erro ao salvar o endereço';
    } finally {
      isLoadingEndereco.value = false;
    }
  }
</script>

<template>
  <Header v-if="!isAuthLoading" />
  <Loading v-if="isAuthLoading" />

  <div v-else class="space-y-8 px-6 py-8">
    <!-- Se não tem endereço, mostra o formulário de endereço -->
    <div v-if="!cadastro?.endereco || editandoEndereco" class="flex items-center justify-center min-h-[60vh]">
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 class="text-xl font-semibold mb-4">Preencha seu endereço para acessar as aulas</h2>
        <form @submit.prevent="salvarEndereco" class="space-y-4">
          <div class="space-y-1">
            <label class="block font-medium">CEP</label>
            <input
              v-model="cepFormatado"
              @input="onInputCEP"
              maxlength="9"
              required
              pattern="^\d{5}-?\d{3}$"
              placeholder="00000-000"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div class="space-y-1">
            <label class="block font-medium">Estado</label>
            <input
              v-model="formEndereco.estado"
              maxlength="2"
              required
              placeholder="UF"
              class="w-full uppercase px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
              min="1"
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
          <div v-if="errorEndereco" class="text-red-500 text-sm text-center">{{ errorEndereco }}</div>
          <div class="flex gap-3 mt-4">
            <button type="submit" :disabled="isLoadingEndereco" class="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold px-4 py-2 rounded-lg transition-colors">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Renderiza as aulas normalmente se endereço está preenchido -->
    <section v-else class="space-y-4 max-w-6xl mx-auto">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-semibold px-4 pt-0.5">Aulas</h1>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="segoe-ui text-2xl font-medium text-green-600">{{ aprovações }}</span>
            <span class="segoe-ui text-lg text-gray-600">{{ aprovações === 1 ? 'aprovação' : 'aprovações' }}</span>
          </div>
          <div class="h-6 w-px bg-gray-300"></div>
          <div class="flex items-center gap-2">
            <span class="segoe-ui text-2xl font-medium text-red-600">{{ reprovações }}</span>
            <span class="segoe-ui text-lg text-gray-600">{{ reprovações === 1 ? 'reprovação' : 'reprovações' }}</span>
          </div>
        </div>
      </div>

      <div v-if="aulas.length === 0 || (aulas.length === 1 && new Date(aulas[0].dataAbertura) > new Date())" class="bg-white p-6 rounded-lg shadow flex flex-col items-center space-y-4">
        <p class="text-gray-600 text-center">
          <strong>Parabéns, você se inscreveu com sucesso!</strong><br>
          Agora só precisa aguardar o início das aulas, em <strong>02/Agosto, às 15h00</strong>.<br>
          Até breve!
        </p>
        <a
          href="https://chat.whatsapp.com/GFtj5ZtDu8OEGpHRjoFv9m?mode=r_t"
          target="_blank"
          rel="noopener"
          class="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
        >
          Entrar no grupo do WhatsApp
        </a>
      </div>

      <div v-if="aulas.length > 0" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-stretch">
        <div v-for="aula in aulas" :key="aula.numero" class="space-y-2">
          <div v-if="aula.tipo === 'principal'" class="bg-white p-6 rounded-lg shadow md:h-full md:flex md:flex-col">
            <h3 class="font-semibold text-lg mb-2">
              <span class="font-bold text-xl">Aula {{ aula.numero < 10 ? `0${aula.numero}` : aula.numero.toString() }}</span>
              <span class="text-gray-600"> | {{ aula.titulo }}</span>
            </h3>
            <p class="text-sm text-gray-500 mb-4">
              Disponível: {{ formatarData(aula.dataAbertura) }}<br>
              Envio até: {{ formatarData(aula.dataFechamento) }}
            </p>

            <!-- Vídeo-aula -->
            <NuxtLink
              :to="aula.linkVideo || ''"
              :tabindex="aula.linkVideo ? 0 : -1"
              :aria-disabled="!aula.linkVideo"
              :class="[
                'block p-4 bg-gray-50 rounded-lg shadow-sm transition flex justify-between items-center mb-2',
                aula.linkVideo ? 'hover:shadow-md' : 'opacity-60 pointer-events-none cursor-not-allowed'
              ]"
              @click="aula.linkVideo && salvarStatusVisualizacao(cadastro.userId, 'video', aula.id, true)"
            >
              <div class="flex items-center">
                <img src="/icons/videoIcon.png" alt="Vídeo-aula" class="w-8 h-8 mr-2" />
                <span class="text-gray-600 text-lg">Vídeo-aula</span>
              </div>
              <span v-if="recuperarStatusVisualizacao(cadastro.userId, 'video', aula.id)" class="ml-2">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </span>
            </NuxtLink>

            <!-- Material -->
            <NuxtLink
              :to="aula.linkMaterial || ''"
              :tabindex="aula.linkMaterial ? 0 : -1"
              :aria-disabled="!aula.linkMaterial"
              :class="[
                'block p-4 bg-gray-50 rounded-lg shadow-sm transition flex justify-between items-center mb-2',
                aula.linkMaterial ? 'hover:shadow-md' : 'opacity-60 pointer-events-none cursor-not-allowed'
              ]"
              @click="aula.linkMaterial && salvarStatusVisualizacao(cadastro.userId, 'material', aula.id, true)"
            >
              <div class="flex items-center">
                <img src="/icons/materialIcon.png" alt="Material" class="w-8 h-8 mr-2" />
                <span class="text-gray-600 text-lg">Material</span>
              </div>
              <span v-if="recuperarStatusVisualizacao(cadastro.userId, 'material', aula.id)" class="ml-2">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </span>
            </NuxtLink>


            <!-- Questionário -->
            <NuxtLink
              :to="aula.questoes && aula.questoes.length > 0 && new Date(aula.dataFechamento) > new Date() ? `/atividade/${aula.numero}` : ''"
              :tabindex="aula.questoes && aula.questoes.length > 0 && new Date(aula.dataFechamento) > new Date() ? 0 : -1"
              :aria-disabled="!(aula.questoes && aula.questoes.length > 0 && new Date(aula.dataFechamento) > new Date())"
              :class="[
                'block p-4 bg-gray-50 rounded-lg shadow-sm transition flex justify-between items-center',
                aula.questoes && aula.questoes.length > 0 && new Date(aula.dataFechamento) > new Date()
                  ? 'hover:shadow-md'
                  : 'opacity-60 pointer-events-none cursor-not-allowed'
              ]"
            >
              <div class="flex items-center">
                <img src="/icons/formIcon.png" alt="Questionário" class="w-8 h-8 mr-2" />
                <span class="text-gray-600 text-lg">Questionário</span>
              </div>
              <span
                class="text-sm font-medium px-3 py-1 rounded-full"
                :class="{
                  'bg-green-100 text-green-800':
                    cadastro?.envios?.find(envio => envio.aulaId === aula.id) &&
                    cadastro.envios.find(envio => envio.aulaId === aula.id).questoes.filter(q => q.correta).length >= 2,
                  'bg-red-100 text-red-800':
                    cadastro?.envios?.find(envio => envio.aulaId === aula.id) &&
                    cadastro.envios.find(envio => envio.aulaId === aula.id).questoes.filter(q => q.correta).length < 2,
                  'bg-blue-100 text-blue-800':
                    !cadastro?.envios?.find(envio => envio.aulaId === aula.id) &&
                    new Date(aula.dataAbertura) <= new Date() && new Date(aula.dataFechamento) > new Date(),
                  'bg-gray-100 text-gray-800':
                    !cadastro?.envios?.find(envio => envio.aulaId === aula.id) &&
                    (new Date(aula.dataAbertura) > new Date() || new Date(aula.dataFechamento) <= new Date())
                }"
              >
                <template v-if="cadastro?.envios?.find(envio => envio.aulaId === aula.id)">
                  {{
                    cadastro.envios.find(envio => envio.aulaId === aula.id).questoes.filter(q => q.correta).length
                  }}/
                  {{
                    cadastro.envios.find(envio => envio.aulaId === aula.id).questoes.length
                  }} acertos
                </template>
                <template v-else>
                  <template v-if="new Date(aula.dataAbertura) > new Date()">
                    Em breve
                  </template>
                  <template v-else-if="new Date(aula.dataFechamento) > new Date()">
                    Aberto
                  </template>
                  <template v-else>
                    Expirado
                  </template>
                </template>
              </span>

            </NuxtLink>

          </div>
          <div v-else-if="aula.tipo === 'complementar'" class="bg-white p-6 rounded-lg shadow md:h-full md:min-h-[320px] md:flex md:flex-col">
            <h3 class="font-semibold text-lg mb-2">
              <span class="font-bold text-xl">Complementar</span>
              <span class="text-gray-600"> | {{ aula.titulo }}</span>
            </h3>
            <p class="text-sm text-gray-500 mb-4">
              Data: {{ formatarData(aula.data) }}<br>
              Professor: {{ aula.professor }}
            </p>
            <NuxtLink
              :to="aula.linkVideo || ''"
              :tabindex="aula.linkVideo ? 0 : -1"
              :aria-disabled="!aula.linkVideo"
              :class="[
                'block p-4 bg-gray-50 rounded-lg shadow-sm transition flex justify-between items-center',
                aula.linkVideo ? 'hover:shadow-md' : 'opacity-60 pointer-events-none cursor-not-allowed'
              ]"
            >
              <div class="flex items-center">
                <img src="/icons/videoIcon.png" alt="Vídeo-aula" class="w-8 h-8 mr-2" />
                <span class="text-gray-600 text-lg">Vídeo-aula</span>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>