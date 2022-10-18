import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from './projects/projects.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { KanbanComponent } from './kanban/kanban.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: '/landing'},
  { path: 'landing', component: LandingPageComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'kanban/:projectId', component: KanbanComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
