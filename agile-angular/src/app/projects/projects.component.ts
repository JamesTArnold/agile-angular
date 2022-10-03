import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { FirestoreService } from '../firestore.service';
import { Project} from '../project.interface';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ProjectFormComponent } from './project-form/project-form.component';



@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  project: Project = {
    name: '',
    id: '',
    boardType: '',
  }

  constructor(
    private userService: UserService,
    private firestoreService: FirestoreService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  addProject() {
      const dialogRef = this.dialog.open(ProjectFormComponent, {
        width: '250px',
      });
      dialogRef.afterClosed().subscribe(result => {
        this.project = result;
        console.log("🚀 ~ file: projects.component.ts ~ line 40 ~ ProjectsComponent ~ dialogRef.afterClosed ~ project", this.project)

      });
    // this.firestoreService.addProject(this.project);
  }
}
