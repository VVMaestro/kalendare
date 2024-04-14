<script setup lang="ts">
import { ref } from 'vue';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from './ui/button';
import { useTasks } from '@/composables/useTasks';
import { PlusIcon } from '@radix-icons/vue';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Loader } from '@/components/ui/loader';
import { Separator } from '@/components/ui/separator';

const { tasks, addTask, setTaskDone, loading } = useTasks();

const newTaskText = ref('');
const addTaskMode = ref(false);

function onNewTaskChange(payload: string | number) {
  newTaskText.value = payload.toString();
}

function onNewTaskSubmit(event: Event) {
  event.preventDefault();

  addTask(newTaskText.value);
  onTaskCreate();
}

function onAddTaskClick() {
  addTaskMode.value = true;
}

function onTaskCreate() {
  addTaskMode.value = false;
  newTaskText.value = '';
}

function onTaskDone(taskId: string, done: boolean) {
  setTaskDone(taskId, done);
}
</script>

<template>
  <section class="flex flex-col gap-4 border-2 rounded-2xl px-4 h-full relative border-slate-700">
    <div class="flex justify-center">
      <h2 class="text-2xl text-center">Задачи</h2>

      <Loader v-if="loading" class="absolute left-0 top-0" />
    </div>

    <Separator />

    <article class="flex flex-col gap-5">
      <ul class="list-none">
        <li v-for="task in tasks" :key="task.id" class="flex gap-3 items-center mb-2">
          <Checkbox
            :id="task.id"
            :checked="task.done"
            @update:checked="(done: boolean) => onTaskDone(task.id, done)"
          />

          <label
            :for="task.id"
            :class="cn('text-sm font-medium leading-none', { ['line-through']: task.done })"
          >
            {{ task.description }}
          </label>
        </li>

        <li v-if="addTaskMode" class="flex gap-3 items-center">
          <Checkbox id="new-task" disabled />

          <form @submit="onNewTaskSubmit">
            <Input
              type="text"
              size="sm"
              focus-on-mount
              :model-value="newTaskText"
              @update:model-value="onNewTaskChange"
            />
          </form>
        </li>
      </ul>

      <div v-if="!addTaskMode" class="flex justify-center">
        <Button variant="outline" size="icon" @click="onAddTaskClick">
          <PlusIcon />
        </Button>
      </div>
    </article>
  </section>
</template>
