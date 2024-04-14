import type { ITask, ITaskCreate } from '@/types/tasks';
import { type Ref, reactive, ref } from 'vue';
import { usePocketBase } from './usePocketBase';

interface IUseTasks {
  tasks: Set<ITask>;
  addTask: (newTask: string) => void;
  setTaskDone: (taskId: string, done: boolean) => void;
  loading: Ref<boolean>;
}

export function useTasks(): IUseTasks {
  const { pb } = usePocketBase();

  const tasks = reactive(new Set<ITask>());
  const loading = ref(false);

  const setLoading = (value: boolean) => {
    loading.value = value;
  }

  const fetchTasksData = async (): Promise<ITask[]> => {
    try {
      setLoading(true);

      const response = await pb.collection('tasks').getList(1, 50);
  
      return response.items.map((taskData) => {
        return {
          id: taskData.id,
          description: taskData.description,
          done: taskData.done
        };
      });
    } catch(error: unknown) {
      console.error(error); 
  
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  const sendTask = async (taskCreateData: ITaskCreate) => {
    const { user, description } = taskCreateData;
  
    await pb.collection('tasks').create({ user, description });
  
    return;
  };

  const receiveTasks = async () => {
    const tasksData = await fetchTasksData();

    for (const task of tasksData) {
      tasks.add(task);
    }
  };

  const setTaskDone = async (taskId: string, done: boolean) => {
    for (const task of tasks) {
      if (task.id === taskId) {
        task.done = done;

        break;
      }
    }

    await pb.collection('tasks').update(taskId, { done });
  };

  const addTask = async(newTask: string) => {
    if (!pb.authStore.model?.id) {
      throw new Error('User is not logged in');
    }

    tasks.add({ id: 'fasdfadfasdf', description: newTask, done: false});

    await sendTask({ user: pb.authStore.model.id, description: newTask });

    fetchTasksData();
  };

  receiveTasks();

  return {
    tasks,
    addTask,
    setTaskDone,
    loading: loading
  };
}
