import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-logout-dialog',
  templateUrl: './logout-dialog.component.html',
  styleUrls: ['./logout-dialog.component.scss'],
})
export class LogoutDialogComponent {
  constructor(
    private readonly dialogRef: MatDialogRef<LogoutDialogComponent>,
  ) {}

  cancel(): void {
    this.dialogRef.close(false);
  }

  logout(): void {
    this.dialogRef.close(true);
  }
}
