export interface ITask {
  id: string;
  description: string;
  done: boolean;
}

export interface ITaskCreate {
  user: string;
  description: string;
}
