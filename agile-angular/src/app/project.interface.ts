
export interface Project {
  name: string;
  boardType: BoardType;
}

export type BoardType = 'SCRUM' | 'KANBAN';
