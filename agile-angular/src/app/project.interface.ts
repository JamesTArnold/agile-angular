
export interface Project {
  name: string;
  boardType: BoardType;
}

export enum BoardType {
  KANBAN = 'KANBAN',
  SCRUM = 'SCRUM',
}
