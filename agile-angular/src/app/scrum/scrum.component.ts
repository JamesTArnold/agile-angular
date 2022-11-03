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
import { Project, Issue, Sprint } from '../project.interface';
import { MatDialog } from '@angular/material/dialog';
import { IssueFormComponent } from '../issue-form/issue-form.component';
import { SprintFormComponent } from './sprint-form/sprint-form.component';

@Component({
  selector: 'app-scrum',
  templateUrl: './scrum.component.html',
  styleUrls: ['./scrum.component.scss'],
})
export class ScrumComponent implements OnInit {
  projectId: string = '';
  userId: string | undefined = undefined;

  backlog: Issue[] = [];
  sprints: Sprint[] = [];

  project$: Observable<Project> = new Observable();

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
              this.project = projectData;
              this.backlog = projectData.scrum.backlog;
              this.project.scrum.sprints.forEach((sprint) => {
                sprint.startDate = sprint.startDate.toDate();
                sprint.endDate = sprint.endDate.toDate();
              });
            }
          });
      }
    });
  }

  drop(event: CdkDragDrop<Issue[]>) {
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
    }
    this.firestoreService.updateProject(this.project, this.userId);
  }

  addSprint() {
    const dialogRef = this.dialog.open(SprintFormComponent, {
      width: '275px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== 'cancel') {
        let resultProject = this.project;
        let sprint = {
          id: result.id,
          name: result.name,
          startDate: result.startDate,
          endDate: result.endDate,
          sprintGoal: result.sprintGoal,
          todo: [],
          inProgress: [],
          done: [],
        };

        resultProject.scrum.sprints.push(sprint);

        this.firestoreService.updateProject(this.project, this.userId);
      }
    });
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
        this.project.scrum.backlog.push(issue);
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

      if (fromColumn === 'backlog') {
        let backlogIndex = this.project.scrum.backlog
          .map((x) => {
            return x.id;
          })
          .indexOf(resultIssue.id);

        this.project.scrum.backlog.splice(backlogIndex, 1);

        if (result !== 'delete') {
          this.project.scrum.backlog.splice(backlogIndex, 0, resultIssue);
        }
      } else {
      }
    }
  }
}
