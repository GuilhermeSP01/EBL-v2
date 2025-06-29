<script setup>
    definePageMeta({ middleware: ['auth', 'cadastro'] });
    import { getToken } from '~/composables/useCadastro';
    const { isAuthLoading } = useAuth();
    const { aulas } = useAulas();
    const { cadastro, save } = useCadastro();
    const route = useRoute();
    const aula = aulas.value.find(a => a.numero === Number(route.params.id));

    if (!aula) {
        navigateTo('/aulas');
    }

    const questionarioAberto = ref(true);
    const questionarioMensagem = ref('');

    if (new Date(aula.dataAbertura) > Date.now()) {
        questionarioAberto.value = false;
        questionarioMensagem.value = 'Esta aula ainda não está disponível.';
    }
    if (new Date(aula.dataFechamento) < Date.now()) {
        questionarioAberto.value = false;
        questionarioMensagem.value = 'O prazo de envio do questionário expirou.';
    }

    const envioParaAula = computed(() => {
        if (!cadastro.value?.envios || !aula?._id) return null;
        return cadastro.value.envios.find(envio => envio.aulaId === aula._id);
    });

    const respostas = ref(
        aula.questoes?.map(questao => ({
            numero: questao.numero,
            resposta: null
        })) || []
    );

    async function enviarQuestionario() {
        const token = await getToken();
        try {
            const response = await $fetch('/api/envio', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: {
                    aulaId: aula._id,
                    questoes: respostas.value
                }
            });
            save(response);
            alert('Envio realizado com sucesso!');
        } catch (e) {
            alert('Ocorreu um erro ao enviar o questionário: ' + e.message);
        }
    }

    function respostaQuestao(numeroQuestao) {
        const questaoEnvio = envioParaAula.value?.questoes?.find(q => q.numero === numeroQuestao);
        return questaoEnvio?.resposta;
    }

    function questaoCorreta(numeroQuestao) {
        const questaoEnvio = envioParaAula.value?.questoes?.find(q => q.numero === numeroQuestao);
        return questaoEnvio?.correta;
    }
</script>

<template>
    <Header v-if="!isAuthLoading" />
  <Loading v-if="isAuthLoading" />
  <div v-else class="space-y-8 px-6 py-8">
    <section class="space-y-4 max-w-4xl mx-auto">
      <div class="bg-white p-6 rounded-lg shadow">
        <h1 class="text-2xl font-semibold">Atividade {{ aula.numero }} - {{ aula.titulo }}</h1>
        <p class="text-gray-600 mt-2">
          <span class="font-medium">Material:</span>
          <NuxtLink :to="aula.linkMaterial" class="text-blue-600 hover:text-yellow-500">
            Acessar material
          </NuxtLink>
        </p>
        <p class="text-gray-600">
          <span class="font-medium">Vídeo:</span>
          <NuxtLink :to="aula.linkVideo" class="text-blue-600 hover:text-yellow-500">
            Assistir vídeo
          </NuxtLink>
        </p>

        <!-- Se já houve envio, exibe as respostas -->
        <div v-if="envioParaAula" class="mt-6 space-y-6">
          <p class="text-sm text-gray-500">
            <strong>Seu questionário já foi enviado.</strong> Data do envio: {{ envioParaAula.dataEnvio }}
          </p>
          <div v-for="questao in aula.questoes" :key="questao.numero" class="space-y-2">
            <h3 class="font-semibold">Questão {{ questao.numero }}</h3>
            <p class="text-gray-700">{{ questao.enunciado }}</p>
            <p class="text-sm">
              Sua resposta:
              <strong
                :class="{
                  'text-green-600': questaoCorreta(questao.numero),
                  'text-red-600': !questaoCorreta(questao.numero)
                }"
              >
                {{
                  questao.alternativas.find(a =>
                    a.numero === respostaQuestao(questao.numero)
                  )?.descricao || 'Não respondida'
                }}
              </strong>
              <span v-if="questaoCorreta(questao.numero)"> ✅</span>
              <span v-else> ❌</span>
            </p>
          </div>
        </div>
        
        <!-- Se não houve envio, exibe o formulário -->
        <div v-else>
          <div v-if="questionarioAberto" class="mt-6 space-y-6">
            <div v-for="(questao, index) in aula.questoes" :key="questao.numero" class="space-y-2">
              <h3 class="font-semibold">Questão {{ questao.numero }}</h3>
              <p class="text-gray-700">{{ questao.enunciado }}</p>
              <div class="space-y-2">
                <label
                  v-for="alternativa in questao.alternativas"
                  :key="alternativa.numero"
                  class="flex items-center gap-2 p-2 hover:bg-gray-50 rounded"
                >
                  <input
                    type="radio"
                    :name="'questao' + questao.numero"
                    :value="alternativa.numero"
                    v-model="respostas[index].resposta"
                    class="w-4 h-4"
                  />
                  <span>{{ String.fromCharCode(96 + alternativa.numero) }}. {{ alternativa.descricao }}</span>
                </label>
              </div>
            </div>
            <button
              @click="enviarQuestionario"
              class="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold px-6 py-2 rounded-lg transition-colors"
            >
              Enviar questionário
            </button>
          </div>
          <div v-else class="mt-6">
            <p class="text-sm text-gray-600">{{ questionarioMensagem }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
