import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-issue-form',
  templateUrl: './issue-form.component.html',
  styleUrls: ['./issue-form.component.scss'],
})
export class IssueFormComponent implements OnInit {
  issueForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    priority: ['LOW', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<IssueFormComponent>
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    this.dialogRef.close(this.issueForm.value);
  }

  onCancel() {
    this.dialogRef.close(undefined);
  }
}
