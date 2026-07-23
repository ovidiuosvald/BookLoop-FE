import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authentication-required-dialog',
  templateUrl: './authentication-required-dialog.component.html',
  styleUrls: ['./authentication-required-dialog.component.scss'],
})
export class AuthenticationRequiredDialogComponent {
  constructor(
    private readonly dialogRef: MatDialogRef<AuthenticationRequiredDialogComponent>,
    private readonly router: Router,
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  goToLogin(): void {
    this.dialogRef.close();
    this.router.navigate(['/auth/login']);
  }

  goToRegister(): void {
    this.dialogRef.close();
    this.router.navigate(['/auth/register']);
  }
}
