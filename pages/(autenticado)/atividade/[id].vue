<script setup>
    definePageMeta({ middleware: ['auth', 'cadastro'] });
    import { getToken } from '~/composables/useCadastro';
    const { isAuthLoading } = useAuth();
    const { aulas } = useAulas();
    const { cadastro, save } = useCadastro();
    const route = useRoute();
    const aula = aulas.value.find(a => a.numero === Number(route.params.id));

    const questionarioAberto = ref(true);
    const questionarioMensagem = ref('');

    if (!aula) {
        navigateTo('/aulas');
    }

    if (new Date(aula.dataAbertura) > Date.now()) {
        questionarioAberto.value = false;
        questionarioMensagem.value = 'Esta aula ainda não está disponível.';
    };

    if (new Date(aula.dataFechamento) < Date.now()) {
        questionarioAberto.value = false;
        questionarioMensagem.value = 'O prazo de envio do questionário expirou.';
    };

    const envioParaAula = computed(() => {
        if (!cadastro.value?.envios || !aula?._id) return null;
        return cadastro.value.envios.find(envio => envio.aulaId === aula._id);
    });

    const respostas = ref(
        aula.questoes.map(questao => ({
            numero: questao.numero,
            resposta: null
        }))
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

    // Retorna a resposta dada pelo aluno para uma questão
    function respostaQuestao(numeroQuestao) {
    const questaoEnvio = envioParaAula.value.questoes.find(q => q.numero === numeroQuestao);
    return questaoEnvio?.resposta;
    }

    // Verifica se a questão foi respondida corretamente
    function questaoCorreta(numeroQuestao) {
    const questaoEnvio = envioParaAula.value.questoes.find(q => q.numero === numeroQuestao);
    return questaoEnvio?.correta;
    }

</script>

<template>
    <Loading v-if="isAuthLoading" />
    <div v-else>
        <Header />
        <div>
            <h1> Atividade {{ aula.numero }} - {{ aula.titulo }} </h1>
            <p> Material: {{ aula.linkMaterial }} </p>
            <p> Video: {{ aula.linkVideo }} </p>

            <!-- Se já houve envio, exibe as respostas -->
            <div v-if="envioParaAula">
                <h2> Seu questionário já foi enviado! </h2>
                <p> Data do envio: {{ envioParaAula.dataEnvio }} </p>
                <div v-for="questao in aula.questoes" :key="questao.numero">
                    <h3>Questão {{ questao.numero }}</h3>
                    <p>Enunciado: {{ questao.enunciado }}</p>
                    <p>
                    Sua resposta: 
                    <strong :class="{ 'correta': questaoCorreta(questao.numero), 'incorreta': !questaoCorreta(questao.numero) }">
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
                <div v-if="questionarioAberto">
                    <div v-for="(questao, index) in aula.questoes" :key="questao.numero">
                        <h2> Questão {{ questao.numero }} - {{ questao.enunciado }} </h2>
                        <div v-for="alternativa in questao.alternativas" :key="alternativa.numero">
                            <label>
                            <input
                                type="radio"
                                :name="'questao' + questao.numero"
                                :value="alternativa.numero"
                                v-model="respostas[index].resposta"
                            />
                            {{ alternativa.numero }}. {{ alternativa.descricao }}
                            </label>
                        </div>
                        </div>
                        <button @click="enviarQuestionario"> Enviar </button>
                    </div>
                </div>
                <div v-else>
                    <p> {{ questionarioMensagem }} </p>
                </div>
            </div>
        </div>
</template>