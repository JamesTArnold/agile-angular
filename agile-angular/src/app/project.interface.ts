export interface Project {
  name: string;
  projectType: projectType;
  id: string;
  kanban: {
    todo: issue[];
    inProgress: issue[];
    backlog: issue[];
    done: issue[];
  };
  scrum: {
    sprints: Sprint[];
    backlog: issue[];
  };
}

export type projectType = 'SCRUM' | 'KANBAN';

export interface Sprint {
  name: string;
  todo: issue[];
  inProgress: issue[];
  done: issue[];
}

export interface issue {
  name: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  id: string;
}
