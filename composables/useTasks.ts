import type { ITask, ITaskCreate } from '@/types/tasks';
import type { RecordModel } from 'pocketbase';
import { type Ref, reactive, type WatchStopHandle } from 'vue';

interface IUseTasks {
  tasks: Set<ITask>;
  addTask: (newTask: string) => void;
  setTaskDone: (taskId: string, done: boolean) => void;
  loading: Ref<boolean>;
  unwatch: WatchStopHandle;
}

export async function useTasks(): Promise<IUseTasks> {
  const { $pb } = useNuxtApp();

  const {
    pending: loading,
    data,
    refresh
  } = await useAsyncData('tasks', () => $pb.collection('tasks').getList(1, 50), {
    lazy: true
  });

  const tasks = reactive(new Set<ITask>());

  const fillListWithTasks = (records: RecordModel[]) => {
    records.forEach((taskData) => {
      tasks.add({
        id: taskData.id,
        description: taskData.description,
        done: taskData.done
      });
    });
  };

  if (data.value) {
    fillListWithTasks(data.value.items);
  }

  const unwatch = watch(data, (newData) => {
    if (!newData) {
      return;
    }

    tasks.clear();

    fillListWithTasks(newData.items);
  });

  const sendTask = async (taskCreateData: ITaskCreate) => {
    const { user, description } = taskCreateData;

    await $pb.collection('tasks').create({ user, description });

    return;
  };

  const setTaskDone = async (taskId: string, done: boolean) => {
    for (const task of tasks) {
      if (task.id === taskId) {
        task.done = done;

        break;
      }
    }

    await $pb.collection('tasks').update(taskId, { done });
  };

  const addTask = async (newTask: string) => {
    if (!$pb.authStore.model?.id) {
      throw new Error('User is not logged in');
    }

    tasks.add({ id: 'fasdfadfasdf', description: newTask, done: false });

    await sendTask({ user: $pb.authStore.model.id, description: newTask });

    refresh();
  };

  return {
    tasks,
    addTask,
    setTaskDone,
    loading: loading,
    unwatch
  };
}
