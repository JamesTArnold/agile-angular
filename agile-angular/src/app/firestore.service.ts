import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable, Subscription } from 'rxjs';
import { Project } from './project.interface';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(
    private afs: AngularFirestore
  ) {}

  getUserProjects(userId: string): Observable<any> {
    let userBoardsRef = this.afs
      .collection('users')
      .doc(userId)
      .collection('projects');

    return userBoardsRef.valueChanges();
  }

  addProject(project: Project, userId: string) {
    let userProjectsRef = this.afs
      .collection('users')
      .doc(userId)
      .collection('projects')
      .doc();

    switch (project.boardType) {
      case 'SCRUM':
        userProjectsRef
          .set({
            name: project.name,
            id: userProjectsRef.ref.id,
            boardType: project.boardType,
            columns: [
              {
                name: 'sprints',
                tasks: []
              },
              {
                name: 'backlog',
                tasks: []
              }
            ]
          })
          .catch((error) => {
            console.error('Error adding document: ', error);
          });

        break;

      case 'KANBAN':
        userProjectsRef
          .set({
            name: project.name,
            id: userProjectsRef.ref.id,
            boardType: project.boardType,
            columns: [
              {
                name: 'Backlog',
                tasks: [
                  {
                    name: 'Task 1',
                    description: 'Description 1',
                    id: '1',
                  }
                ]
              },
              {
                name: 'todo',
                tasks: []
              },
              {
                name: 'inProgress',
                tasks: []
              },
              {
                name: 'done',
                tasks: []
              }

            ],
          })
          .catch((error) => {
            console.error('Error adding document: ', error);
          });

        break;

      default:
        console.log('No board type selected');
        break;
    }
  }

  getProject(projectId: string, userId: string): Observable<any> {
      let userBoardsRef = this.afs
        .collection('users')
        .doc(userId)
        .collection('projects')
        .doc(projectId);

      return userBoardsRef.valueChanges();
    }

}
