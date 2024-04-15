<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import * as zod from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { useToast } from '@/components/ui/toast/use-toast';
import Toaster from '@/components/ui/toast/Toaster.vue';

const { toast } = useToast();

const formSchema = toTypedSchema(
  zod.object({
    userName: zod.string().min(1),
    password: zod.string().min(1)
  })
);

const form = useForm({
  validationSchema: formSchema
});

const { $pb } = useNuxtApp();

const onAuth = form.handleSubmit(async (authData) => {
  try {
    await $pb.collection('users').authWithPassword(authData.userName, authData.password);
  } catch (err) {
    toast({
      title: 'Ошибка входа',
      description: 'Проверьте корректность данных'
    });
  }

  if ($pb.authStore.isValid) {
    navigateTo('/');
  }
});
</script>

<template>
  <Card>
    <form @submit="onAuth">
      <CardHeader>
        <CardTitle>Вход</CardTitle>

        <CardDescription> Введите данные для входа, чтобы продолжить </CardDescription>
      </CardHeader>
      <CardContent>
        <FormField key="form-item-3" v-slot="{ componentField }" name="userName">
          <FormItem>
            <FormLabel> Пользователь </FormLabel>

            <FormControl>
              <Input type="text" v-bind="componentField" />
            </FormControl>

            <FormDescription> Имя или почта </FormDescription>
          </FormItem>
        </FormField>

        <FormField key="form-item-2" v-slot="{ componentField }" name="password">
          <FormItem>
            <FormLabel> Пароль </FormLabel>

            <FormControl>
              <Input type="password" v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>
      </CardContent>

      <CardFooter>
        <Button type="submit" variant="secondary">Войти</Button>
      </CardFooter>
    </form>

    <Toaster />
  </Card>
</template>
