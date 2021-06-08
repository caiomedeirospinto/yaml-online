import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'dialog-create-online-session',
  templateUrl: './dialog-create-online-session.component.html',
  styleUrls: ['./dialog-create-online-session.component.scss']
})
export class DialogCreateOnlineSession {
  createSessionFormGroup: FormGroup = this.formBuilder.group({
    username: ['', [Validators.required, Validators.pattern("[a-z0-9]*")]]
  });

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<DialogCreateOnlineSession>
  ) {

  }

  createOnlineSession() {
    if (this.createSessionFormGroup.valid) {
      localStorage.setItem('username', this.createSessionFormGroup.value.username);
      this.dialogRef.close();
    }
  }
}
