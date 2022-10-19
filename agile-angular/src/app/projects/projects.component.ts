import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { FirestoreService } from '../firestore.service';
import { Project } from '../project.interface';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ProjectFormComponent } from './project-form/project-form.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  project: Project = {
    name: '',
    projectType: 'KANBAN',
    id: '',
    kanban: {
      backlog: [],
      todo: [],
      inProgress: [],
      done: [],
    } ,
    scrum: {
      sprints: [],
      backlog: [],
    }
  };

  userId: string = '';

  projects$: Observable<Project[]> = new Observable();

  constructor(
    private router: Router,
    private userService: UserService,
    private firestoreService: FirestoreService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userService.user$.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        this.projects$ = this.firestoreService
          .getUserProjects(user.uid)
          .pipe(share());
      }
    });
  }

  addProject() {
    const dialogRef = this.dialog.open(ProjectFormComponent, {
      width: '250px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.project = result;
        this.firestoreService.addProject(this.project, this.userId);
      }
    });
  }
  gotoProject(project: Project) {
    if (project.projectType === 'KANBAN') {
      this.router.navigate(['kanban', project.id]);
    } else {
      this.router.navigate(['scrum', project.id]);
    }
  }
}
