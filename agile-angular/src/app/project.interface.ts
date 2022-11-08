export interface Project {
  name: string;
  projectType: projectType;
  id: string;
  kanban: {
    todo: Issue[];
    inProgress: Issue[];
    backlog: Issue[];
    done: Issue[];
  };
  scrum: {
    sprints: Sprint[];
    backlog: Issue[];
  };
}

export type projectType = 'SCRUM' | 'KANBAN';

export interface Sprint {
  name: string;
  startDate: any;
  endDate: any;
  sprintGoal: string;
  id: string;
  isActive: boolean;
  todo: Issue[];
  inProgress: Issue[];
  done: Issue[];
}

export interface Issue {
  name: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  id: string;
}
