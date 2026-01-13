export type ListType = {
  id: number;
  title: string;
};

export type TaskType = {
  id: string;
  name: string;
  status: string; //this is for the list the task belong to
};
