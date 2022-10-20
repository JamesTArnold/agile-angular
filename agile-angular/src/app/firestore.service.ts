import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Project } from './project.interface';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private afs: AngularFirestore) {}

  getUserProjects(userId: string): Observable<any> {
    let userProjectsRef = this.afs
      .collection('users')
      .doc(userId)
      .collection('projects');

    return userProjectsRef.valueChanges();
  }

  addProject(project: Project, userId: string) {
    let userProjectsRef = this.afs
      .collection('users')
      .doc(userId)
      .collection('projects')
      .doc();

    userProjectsRef.set({
      name: project.name,
      id: userProjectsRef.ref.id,
      projectType: project.projectType,
      kanban: {
        todo: [{ name: 'test', description: 'test', id: 'test' }],
        inProgress: [],
        backlog: [],
        done: [],
      },
      scrum: {
        sprints: [],
        backlog: [],
      },
    });
  }

  getProject(projectId: string, userId: string): Observable<any> {
    let userProjectsRef = this.afs
      .collection('users')
      .doc(userId)
      .collection('projects')
      .doc(projectId);

    return userProjectsRef.valueChanges();
  }

  updateProject(project: Project, userId: string | undefined) {
    if (userId !== undefined) {
      let userProjectRef = this.afs
        .collection('users')
        .doc(userId)
        .collection('projects')
        .doc(project.id);

      userProjectRef.set({ ...project });

      userProjectRef.set(project).catch((error) => {
        console.error('Error adding document: ', error);
      });
    } else {
      console.log('User not logged in');
    }
  }

  //   addKanbanIssue(issue: issue, projectId: string, userId: string) {
  //     let userProjectRef = this.afs
  //       .collection('users')
  //       .doc(userId)
  //       .collection('projects')
  //       .doc(projectId);

  //     userProjectRef.update({
  //       kanban: {
  //         backlog: [
  //           ...issue,
  //           id:
  //         ],
  //       },
  //     });
  //   }

  // }
}
