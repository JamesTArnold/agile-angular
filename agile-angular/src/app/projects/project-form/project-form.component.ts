import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss'],
})
export class ProjectFormComponent implements OnInit {
  projectForm = this.fb.group({
    name: ['', Validators.required],
    projectType: ['', Validators.required],
  });

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<ProjectFormComponent>) {}

  ngOnInit(): void {}

  onSubmit() {
    this.dialogRef.close(this.projectForm.value);
  }

  onCancel(){
    this.dialogRef.close(undefined);
  }
}
