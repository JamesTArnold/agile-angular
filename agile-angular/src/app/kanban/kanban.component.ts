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
import { Project, issue } from '../project.interface';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss'],
})
export class KanbanComponent implements OnInit {
  projectId: string = '';
  userId: string | undefined = undefined;

  project$: Observable<Project> = new Observable();

  backlog: issue[] = [];
  todo: issue[] = [];
  inProgress: issue[] = [];
  done: issue[] = [];

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
    private firestoreService: FirestoreService
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
}
