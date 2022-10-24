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
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss'],
  animations: [
    trigger('fade', [
      state('in', style({ opacity: 1 })),

      transition(':enter', [style({ opacity: 0 }), animate(600)]),

      transition(':leave', animate(200, style({ opacity: 0 }))),
    ]),
  ],
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

  doneHoverItem: string = '';

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
      if (result !== 'cancel') {
        let issue = {
          id: result.id,
          name: result.name,
          description: result.description,
          priority: result.priority,
        };
        this.project.kanban.backlog.push(issue);
        this.firestoreService.updateProject(this.project, this.userId);
      }
    });
  }

  editIssueClicked(issue: Issue, fromColumn: string) {
    const dialogRef = this.dialog.open(IssueFormComponent, {
      width: '250px',
      disableClose: true,
      data: issue,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.editIssue(result, issue, fromColumn);
    });
  }

  private editIssue(result: any, issue: Issue, fromColumn: string) {
    if (result !== 'cancel') {
      let resultIssue = {
        id: result.id ? result.id : issue.id,
        name: result.name ? result.name : issue.name,
        description: result.description
          ? result.description
          : issue.description,
        priority: result.priority ? result.priority : issue.priority,
      };

      switch (fromColumn) {
        case 'backlog':
          let backlogIndex = this.project.kanban.backlog
            .map((x) => {
              return x.id;
            })
            .indexOf(resultIssue.id);

          this.project.kanban.backlog.splice(backlogIndex, 1);

          if (result !== 'delete') {
            this.project.kanban.backlog.splice(backlogIndex, 0, resultIssue);
          }
          break;
        case 'todo':
          let todoIndex = this.project.kanban.todo
            .map((x) => {
              return x.id;
            })
            .indexOf(resultIssue.id);
          this.project.kanban.todo.splice(todoIndex, 1);
          if (result !== 'delete') {
            this.project.kanban.todo.splice(todoIndex, 0, resultIssue);
          }
          break;
        case 'inProgress':
          let inProgressIndex = this.project.kanban.inProgress
            .map((x) => {
              return x.id;
            })
            .indexOf(resultIssue.id);
          this.project.kanban.inProgress.splice(inProgressIndex, 1);
          if (result !== 'delete') {
            this.project.kanban.inProgress.splice(
              inProgressIndex,
              0,
              resultIssue
            );
          }
          break;
        case 'done':
          let doneIndex = this.project.kanban.done
            .map((x) => {
              return x.id;
            })
            .indexOf(resultIssue.id);
          this.project.kanban.done.splice(doneIndex, 1);
          if (result !== 'delete') {
            this.project.kanban.done.splice(doneIndex, 0, resultIssue);
          }
          break;
        default:
          break;
      }
      this.firestoreService.updateProject(this.project, this.userId);
    }
  }
  deleteDoneIssueClicked(item: Issue) {
    this.editIssue('delete', item, 'done');
  }
}
