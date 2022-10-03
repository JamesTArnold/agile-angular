import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { FirestoreService } from '../firestore.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  constructor(private userService: UserService, private firestoreService: FirestoreService) {}

  ngOnInit(): void {
  }

  addProject(name: string) {
    this.firestoreService.addProject(name);
  }

}
