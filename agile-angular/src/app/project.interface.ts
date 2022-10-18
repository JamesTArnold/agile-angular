
export interface Project {
  name: string;
  boardType: BoardType;
  id: string;
}

export type BoardType = 'SCRUM' | 'KANBAN';
