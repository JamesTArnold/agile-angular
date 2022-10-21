import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Issue } from '../project.interface';

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
    id: [''],
  });

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<IssueFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Issue | null
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.issueForm.patchValue({
        name: this.data.name,
        description: this.data.description,
        priority: this.data.priority,
        id: this.data.id,
      });
    }
  }

  onSubmit() {
    let issue = this.issueForm.value;
    issue.id = this.data ? this.data.id : this.CreateUUID();
    this.dialogRef.close(issue);
  }

  onDelete() {
    this.dialogRef.close('delete');
  }

  onCancel() {
    this.dialogRef.close('cancel');
  }

  CreateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }
}
