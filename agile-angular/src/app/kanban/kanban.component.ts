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
import { share } from 'rxjs/operators';


import { Project, Task} from '../project.interface';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss'],
})
export class KanbanComponent implements OnInit {
  projectId: string = '';
  userId: string | undefined = undefined;

  project$:Observable<Project> = new Observable();

  backlog: Task[] = [];
  todo: Task[] = [];
  inProgress: Task[] = [];
  done: Task[] = [];

  project: Project = {
    name: '',
    boardType: 'KANBAN',
    id: '',
    columns: [],
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

        this.firestoreService.getProject(
          this.projectId, user.uid).subscribe((projectData) => {
          if(projectData){
          this.project = projectData;
          this. backlog = projectData.backlog;
          this.todo = projectData.todo;
          this.inProgress = projectData.inProgress;
          this.done = projectData.done;
        }
        });
      }
    });



  }


  drop(event: CdkDragDrop<any>) {

    console.log(event);
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


  }
}
