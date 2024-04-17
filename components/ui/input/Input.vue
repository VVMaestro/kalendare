<script setup lang="ts">
import { type HTMLAttributes, ref } from 'vue';
import { useFocus, useVModel } from '@vueuse/core';
import { cn } from '@/lib/utils';

const props = withDefaults(
  defineProps<{
    defaultValue?: string | number;
    modelValue?: string | number;
    class?: HTMLAttributes['class'];
    dense?: boolean;
    size?: 'lg' | 'md' | 'sm';
    focusOnMount?: boolean;
  }>(),
  {
    size: 'md',
    focusOnMount: false,
    defaultValue: '',
    modelValue: undefined,
    class: ''
  }
);

const { defaultValue, focusOnMount } = props;

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void;
  (e: 'update:focus', payload: boolean): void;
}>();

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: defaultValue
});

const inputRef = ref();

const { focused } = useFocus(inputRef, { initialValue: focusOnMount });

watch(focused, () => emits('update:focus', focused.value));
</script>

<template>
  <input
    ref="inputRef"
    v-model="modelValue"
    :class="
      cn(
        {
          ['h-10']: props.size === 'md',
          ['h-5']: props.size === 'sm',
          ['h-16']: props.size === 'lg'
        },
        'flex w-full rounded-md border border-slate-200 bg-white text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300',
        props.class,
        { ['px-3 py-2']: !props.dense }
      )
    "
  />
</template>
