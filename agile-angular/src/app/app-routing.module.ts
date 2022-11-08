import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from './projects/projects.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { KanbanComponent } from './kanban/kanban.component';
import { ScrumComponent } from './scrum/scrum.component';
import { ActiveSprintComponent } from './scrum/active-sprint/active-sprint.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/landing' },
  { path: 'landing', component: LandingPageComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'kanban/:projectId', component: KanbanComponent },
  { path: 'scrum/:projectId', component: ScrumComponent },
  {
    path: 'scrum/:projectId/active/:sprintId',
    component: ActiveSprintComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
