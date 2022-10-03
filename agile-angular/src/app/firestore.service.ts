import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Project } from './project.interface';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService implements OnInit {
  userId: string | undefined = undefined;
  constructor(private userService: UserService, private afs: AngularFirestore) {
  }

  ngOnInit(): void {
    this.userId = this.userService.userDetails?.uid;
  }

  addProject(project: Project) {
      let userProjectsRef = this.afs
        .collection('users')
        .doc(this.userId)
        .collection('projects')
        .doc();
      if(project.boardType === 'SCRUM') {

      } else {

      }
      //work in progress
      userProjectsRef
        .set({
          name: project.name,
          id: userProjectsRef.ref.id,
          backlog: [],
          todo: [],
          inProgress: [],
          done: [],
        })
        .catch((error) => {
          console.error('Error adding document: ', error);
        });
    }


}
