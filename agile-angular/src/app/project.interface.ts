
export interface Project {
  name: string;
  boardType: BoardType;
  id: string;
  columns: Column[];
}

export type BoardType = 'SCRUM' | 'KANBAN';

export interface Column {
  name: string;
  tasks: Task[];
}

export interface Task {
  name: string;
  description: string;
  id: string;

}
