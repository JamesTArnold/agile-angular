import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Sprint } from '../../project.interface';

@Component({
  selector: 'app-sprint-form',
  templateUrl: './sprint-form.component.html',
  styleUrls: ['./sprint-form.component.scss'],
})
export class SprintFormComponent implements OnInit {
  sprintForm = this.fb.group({
    name: ['', Validators.required],
    sprintGoal: [''],
    priority: ['LOW', Validators.required],
    id: [''],
    startDate: [new Date(), Validators.required],
    endDate: [new Date(Date.now() + 12096e5), Validators.required],
    todo: [[]],
    inProgress: [[]],
    done: [[]],
  });

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SprintFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Sprint | null
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    let sprint = this.sprintForm.value;
    sprint.id = this.data ? this.data.id : this.CreateUUID();
    this.dialogRef.close(sprint);
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
