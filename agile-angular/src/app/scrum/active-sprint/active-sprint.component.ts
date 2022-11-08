import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from 'src/app/firestore.service';
import { Project, Issue, Sprint } from 'src/app/project.interface';
import { UserService } from 'src/app/user.service';
import { IssueFormComponent } from 'src/app/issue-form/issue-form.component';
@Component({
  selector: 'app-active-sprint',
  templateUrl: './active-sprint.component.html',
  styleUrls: ['./active-sprint.component.scss'],
})
export class ActiveSprintComponent implements OnInit {
  projectId: string = '';
  userId: string | undefined = undefined;

  sprintName: string = '';
  todo: Issue[] = [];
  inProgress: Issue[] = [];
  done: Issue[] = [];

  doneHoverItem: string = '';
  activeSprintIndex: number = 0;

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

  activeSprint: Sprint | undefined = undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
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

              this.project.scrum.sprints.forEach((sprint, sprintIndex) => {
                sprint.startDate = sprint.startDate.toDate();
                sprint.endDate = sprint.endDate.toDate();
                if (sprint.isActive) {
                  this.sprintName = sprint.name;
                  this.activeSprint = sprint;
                  this.activeSprintIndex = sprintIndex;
                  this.todo = sprint.todo;
                  this.inProgress = sprint.inProgress;
                  this.done = sprint.done;
                }
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
    this.project.scrum.sprints[this.activeSprintIndex].todo = this.todo;
    this.project.scrum.sprints[this.activeSprintIndex].inProgress =
      this.inProgress;
    this.project.scrum.sprints[this.activeSprintIndex].done = this.done;

    this.firestoreService.updateProject(this.project, this.userId);
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

  isSprintReadyForComplete() {
    if (this.project) {
      if (
        this.todo.length === 0 &&
        this.inProgress.length === 0 &&
        this.done.length > 0
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  completeSprintClicked() {
    this.project.scrum.sprints.splice(this.activeSprintIndex, 1);
    this.firestoreService.updateProject(this.project, this.userId);
    this.router.navigate(['scrum', this.project.id]);
  }

  goToBacklog() {
    this.router.navigate(['scrum', this.project.id]);
  }
}
