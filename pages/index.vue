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
    <div>
        <!-- Colocar imagem de fundo -->
        <header>
            <p> Logo </p>
            <button @click="handleLogin"> Entrar </button>
            <button> Contato </button> <!-- Whatsapp -->
        </header>

        <!-- Modal de login e cadastro -->
        <CardAuth v-show="showAuthCard" @close="showAuthCard = false" />

        <main>
            <h1> Curso de Teologia Bíblica </h1>
            <p>
                Descubra gratuitamente
                a Palavra de Deus com fé,
                simplicidade e sem rótulos
                religiosos 
            </p>
            <button @click="handleLogin"> Comece agora </button>
        </main>

        <section>
            <h2> Tudo que você precisa saber para começar </h2>
            <ul>
                <li> ✔️ Inscrições abertas semestralmente </li>
                <li> ✔️ Curso gratuito presencial e online </li>
                <li> ✔️ Aulas com material acessível e apoio pedagógico </li>
                <li> ✔️ Frequência adaptada à sua rotina </li>
                <li> ✔️ Certificado ao final do curso </li>
                <li> ✔️ Sem pré-requisitos — só o desejo de aprender mais sobre Deus</li>
            </ul>
        </section>
        
        <!-- Atalhos para navegação, alinhar horizontalmente -->
        <section>
            <div>
                <p> Ícone </p>
                <a> Sobre o Curso </a>
            </div>

            <div>
                <p> Ícone </p>
                <a> Depoímentos de Alunos </a>
            </div>

            <div>
                <p> Ícone </p>
                <a> Perguntas Frequentes </a>
            </div>
        </section>


        <section>
            <h2> Sobre o Curso </h2>
            <p>
                A escola da Bíblia foi criada para quem deseja conhecer mais profundamente as 
                Escrituras, sem complicações, sem custos e com o coração aberto para aprender. 
                Já atendemos muitos alunos espalhados pelo Brasil. Esse é o nosso propósito!
            </p>

            <p>
                Nosso curso é teológico e bíblico, mas com linguagem acessível a todos — seja 
                você iniciante na fé ou alguém que já estuda há mais tempo.
            </p>

            <p>
                Aqui, você aprende no seu ritmo, com materiais de apoio, videoaulas e suporte 
                da equipe.
            </p>

            <p> O que você vai aprender? </p>
            <ul>
                <li> Conteúdo do curso... </li>
                <li> Conteúdo do curso... </li>
                <li> Conteúdo do curso... </li>
            </ul>

            <p>
                Tudo isso com uma linguagem acolhedora, sem exigência de conhecimento prévio e 
                com certificado gratuito ao final.
            </p>
        </section>


        <section>
            <h2> O que os alunos dizem? </h2>
            <div>
                <!-- Em progresso -->
            </div>
        </section>


        <!-- FAQ onde quando clicar mostra a resposta -->
        <section>
            <h2> Perguntas Frequentes (FAQ) </h2>
            <div>
                <p> Pergunta 1 </p>
                <p> Resposta 1 </p>
            </div>
            <div>
                <p> Pergunta 2 </p>
                <p> Resposta 2 </p>
            </div>
            <div>
                <p> Pergunta 3 </p>
                <p> Resposta 3 </p>
            </div>
        </section>
        
    </div>
</template>