<script setup>
  const navItems = [
    { name: 'Fale conosco', link: 'https://wa.me/5513988542892' },
    { name: 'Aulas', link: '/aulas' },
    { name: 'Perfil', link: '/perfil' }
  ]
</script>

<template>
  <header class="bg-[#00105C] text-white px-6 py-4">
    <div class="mx-auto flex justify-between items-center">
      <div class="flex items-center">
        <NuxtLink to="/aulas" class="text-xl font-bold">Portal do Aluno</NuxtLink>
      </div>
      <ul class="flex gap-6">
        <li v-for="item in navItems" :key="item.name">
          <NuxtLink
            :to="item.link"
            class="hover:text-yellow-400 transition-colors"
            :target="item.link.startsWith('http') ? '_blank' : '_self'"
          >
            {{ item.name }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </header>
</template>
