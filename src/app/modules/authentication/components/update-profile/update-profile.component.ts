import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

// Models
import { UserInterface } from 'src/app/models/user.model';

// Services
import { CommonService } from 'src/app/services/common.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss'],
})
export class UpdateProfileComponent implements OnInit {
  updateUserForm!: FormGroup;

  authenticatedUser?: UserInterface;

  isSaving = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly userService: UserService,
    private readonly commonService: CommonService,
    private readonly dialogRef: MatDialogRef<UpdateProfileComponent>,
  ) {
    this.authenticatedUser = this.userService.authenticatedUser;
  }

  ngOnInit(): void {
    this.createUpdateUserForm();
    this.populateForm();
  }

  // =========================
  // ACTIONS
  // =========================

  submitUpdateUserForm(): void {
    if (this.updateUserForm.invalid || !this.authenticatedUser?.userId) {
      this.updateUserForm.markAllAsTouched();
      return;
    }

    const userToBeUpdated: UserInterface = {
      userId: this.authenticatedUser.userId,

      firstName: this.updateUserForm.controls.firstName.value.trim(),

      lastName: this.updateUserForm.controls.lastName.value.trim(),
    };

    this.isSaving = true;

    this.userService.updateUser(userToBeUpdated).subscribe({
      next: (updatedUser: UserInterface) => {
        this.isSaving = false;

        this.userService.updateAuthenticatedUser(updatedUser);

        this.commonService.showSnackBarSuccess(
          'Profilul tău a fost actualizat cu succes.',
        );

        this.dialogRef.close(updatedUser);
      },
      error: (error: HttpErrorResponse) => {
        this.isSaving = false;

        this.commonService.showHttpError(
          error,
          'Profilul nu a putut fi actualizat.',
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
    this.updateUserForm = this.formBuilder.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ],
      ],

      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ],
      ],
    });
  }

  private populateForm(): void {
    if (!this.authenticatedUser) {
      this.commonService.showSnackBarError(
        'Datele utilizatorului nu au putut fi identificate.',
      );

      return;
    }

    this.updateUserForm.patchValue({
      firstName: this.authenticatedUser.firstName,
      lastName: this.authenticatedUser.lastName,
    });
  }
}
