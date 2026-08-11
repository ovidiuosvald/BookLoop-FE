import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

// Models
import { UserInterface } from 'src/app/models/user.model';

// Services
import { CommonService } from 'src/app/services/common.service';
import { UserService } from 'src/app/services/user.service';

// Validators
import { confirmPasswordValidator } from 'src/app/validators/confirm-passwod.validator';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  updateUserForm!: FormGroup;

  hideOldPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;

  isSaving = false;

  authenticatedUser?: UserInterface;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly userService: UserService,
    private readonly commonService: CommonService,
    private readonly dialogRef: MatDialogRef<ChangePasswordComponent>,
  ) {
    this.authenticatedUser = this.userService.authenticatedUser;
  }

  ngOnInit(): void {
    this.createUpdateUserForm();
  }

  // =========================
  // ACTIONS
  // =========================

  submitUpdateUserForm(): void {
    if (this.updateUserForm.invalid) {
      this.updateUserForm.markAllAsTouched();
      return;
    }

    const userToBeUpdated: UserInterface = {
      userId: this.authenticatedUser?.userId,
      email: this.authenticatedUser?.email,
      firstName: this.authenticatedUser?.firstName,
      lastName: this.authenticatedUser?.lastName,
      password: this.updateUserForm.controls.password.value,
      newPassword: this.updateUserForm.controls.newPassword.value,
    };

    this.isSaving = true;

    this.userService.changePassword(userToBeUpdated).subscribe({
      next: () => {
        this.isSaving = false;

        this.commonService.showSnackBarSuccess(
          'Parola a fost actualizată cu succes.',
        );

        this.dialogRef.close();

        this.userService.logout();
      },
      error: (error: HttpErrorResponse) => {
        this.isSaving = false;

        this.commonService.showHttpError(
          error,
          'Parola nu a putut fi actualizată.',
        );
      },
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  // =========================
  // FORM
  // =========================

  private createUpdateUserForm(): void {
    const passwordRegExp =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~`!@#$%^&()\-+={}[\]|\\:;<>,.?/_₹]).{8,20}$/;

    this.updateUserForm = this.formBuilder.group(
      {
        password: ['', Validators.required],

        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(20),
            Validators.pattern(passwordRegExp),
          ],
        ],

        confirmNewPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(20),
          ],
        ],
      },
      {
        validators: confirmPasswordValidator(
          'newPassword',
          'confirmNewPassword',
        ),
      },
    );
  }
}
