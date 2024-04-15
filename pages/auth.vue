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

const { toast } = useToast();
const loading = ref(false);

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
    loading.value = true;

    await $pb.collection('users').authWithPassword(authData.userName, authData.password);
  } catch (err) {
    toast({
      title: 'Ошибка входа',
      description: 'Проверьте корректность данных'
    });
  } finally {
    loading.value = false;
  }

  if ($pb.authStore.isValid) {
    navigateTo('/');
  }
});
</script>

<template>
  <div class="w-full h-screen flex justify-center items-center">
    <ClientOnly>
      <Card class="max-w-96">
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

          <CardFooter class="flex justify-between">
            <Button type="submit" variant="secondary">Войти</Button>

            <Loader v-if="loading" />
          </CardFooter>
        </form>
      </Card>

      <template #fallback>
        <Loader />
      </template>
    </ClientOnly>
  </div>
</template>
