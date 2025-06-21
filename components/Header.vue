<script setup>
    const navItems = [
        { name: 'Fale conosco', link: 'https://wa.me/5513988542892' },
        { name: 'Aulas', link: '/aulas' },
        { name: 'Perfil', link: '/perfil' }
    ]
</script>

<template>
    <div>
        <ul>
            <li v-for="item in navItems">
                <NuxtLink :to="item.link"> {{ item.name }} </NuxtLink>
            </li>
        </ul>
    </div>
</template>