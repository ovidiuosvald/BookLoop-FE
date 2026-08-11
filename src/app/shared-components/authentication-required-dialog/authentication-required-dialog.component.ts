import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { CommonService } from 'src/app/services/common.service';

export interface AuthenticationRequiredDialogData {
  message: string;
}

@Component({
  selector: 'app-authentication-required-dialog',
  templateUrl: './authentication-required-dialog.component.html',
  styleUrls: ['./authentication-required-dialog.component.scss'],
})
export class AuthenticationRequiredDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    readonly data: AuthenticationRequiredDialogData,
    private readonly dialogRef: MatDialogRef<AuthenticationRequiredDialogComponent>,
    private readonly commonService: CommonService,
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  goToLogin(): void {
    this.dialogRef.close();
    this.commonService.goToLoginPage();
  }

  goToRegister(): void {
    this.dialogRef.close();
    this.commonService.goToRegisterPage();
  }
}
