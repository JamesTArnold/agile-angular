import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { FirestoreService } from '../firestore.service';
import { Project, BoardType } from '../project.interface';
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
    boardType: 'KANBAN',
  };

  userId: string = '';

  projects$: Observable<Project[]> = new Observable();

  constructor(
    private userService: UserService,
    private firestoreService: FirestoreService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userService.user$.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        this.projects$ = this.firestoreService.getUserProjects(user.uid).pipe(share());
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
}
