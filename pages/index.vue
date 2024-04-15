<script setup lang="ts">
import TasksList from '@/components/TasksList.vue';
import { Button } from '@/components/ui/button';
import { ExternalLinkIcon } from '@radix-icons/vue';

definePageMeta({
  middleware: 'auth'
});

const { $pb } = useNuxtApp();

function logOut() {
  $pb.authStore.clear();
  navigateTo('/auth');
}
</script>

<template>
  <section class="grid grid-cols-[100px,_1fr,_2fr] gap-x-4 place-items-stretch h-screen">
    <section class="border-2 border-slate-700 rounded-2xl flex flex-col items-center py-6">
      <Button size="icon" :variant="'outline'" @click="logOut">
        <ExternalLinkIcon />
      </Button>
    </section>

    <TasksList />

    <section class="border-2 border-slate-700 rounded-2xl">
      <h2 class="text-2xl text-center">Календарь</h2>

      Some code yo
    </section>
  </section>
</template>

<style scoped></style>
