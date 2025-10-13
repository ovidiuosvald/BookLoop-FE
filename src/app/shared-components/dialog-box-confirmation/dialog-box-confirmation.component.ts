import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-box-confirmation',
  templateUrl: './dialog-box-confirmation.component.html',
  styleUrls: ['./dialog-box-confirmation.component.scss'],
})
export class DialogBoxConfirmationComponent {
  constructor(
    private _dialogRef: MatDialogRef<DialogBoxConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  public messageToDisplay = this.data.message;

  public confirmation() {
    this._dialogRef.close('yes');
  }
}
