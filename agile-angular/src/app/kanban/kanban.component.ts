import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { FirestoreService } from '../firestore.service';
import { Observable } from 'rxjs';
import { Project, Issue } from '../project.interface';
import { MatDialog } from '@angular/material/dialog';
import { IssueFormComponent } from '../issue-form/issue-form.component';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss'],
})
export class KanbanComponent implements OnInit {
  projectId: string = '';
  userId: string | undefined = undefined;

  project$: Observable<Project> = new Observable();

  backlog: Issue[] = [];
  todo: Issue[] = [];
  inProgress: Issue[] = [];
  done: Issue[] = [];

  project: Project = {
    name: '',
    projectType: 'KANBAN',
    id: '',
    kanban: {
      backlog: [],
      todo: [],
      inProgress: [],
      done: [],
    },
    scrum: {
      sprints: [],
      backlog: [],
    },
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private firestoreService: FirestoreService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.projectId = params['projectId'];
    });

    this.userService.user$.subscribe((user) => {
      if (user) {
        this.userId = user.uid;

        this.firestoreService
          .getProject(this.projectId, user.uid)
          .subscribe((projectData) => {
            if (projectData) {
              this.backlog = projectData.kanban.backlog;
              this.todo = projectData.kanban.todo;
              this.inProgress = projectData.kanban.inProgress;
              this.done = projectData.kanban.done;
              this.project = projectData;
            }
          });
      }
    });
  }

  drop(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      this.project.kanban.backlog = this.backlog;
      this.project.kanban.todo = this.todo;
      this.project.kanban.inProgress = this.inProgress;
      this.project.kanban.done = this.done;

      this.firestoreService.updateProject(this.project, this.userId);
    }
  }

  addIssue() {
    const dialogRef = this.dialog.open(IssueFormComponent, {
      width: '250px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        let issue = {
          id: this.CreateUUID(),
          name: result.name,
          description: result.description,
          priority: result.priority,
        };
        this.project.kanban.backlog.push(issue);
        this.firestoreService.updateProject(this.project, this.userId);
      }
    });
  }

  editIssue(issue: Issue, fromColumn: string) {
    const dialogRef = this.dialog.open(IssueFormComponent, {
      width: '250px',
      disableClose: true,
      data: issue,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        let issue = {
          id: this.CreateUUID(),
          name: result.name,
          description: result.description,
          priority: result.priority,
        };
        this.project.kanban.backlog = this.backlog;
        this.project.kanban.todo = this.todo;
        this.project.kanban.inProgress = this.inProgress;
        this.project.kanban.done = this.done;
        this.firestoreService.updateProject(this.project, this.userId);
      }
    });
  }

  CreateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }
}
