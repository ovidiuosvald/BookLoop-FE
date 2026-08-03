import { CommonService } from '../../../../services/common.service';
import { UserInterface } from 'src/app/models/user.model';
import { UserService } from '../../../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { confirmPasswordValidator } from 'src/app/validators/confirm-passwod.validator';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  public updateUserForm!: FormGroup;
  hideOldPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;
  public authenticatedUser?: UserInterface;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private commonService: CommonService,
  ) {
    this.authenticatedUser = this.userService.authenticatedUser;
  }

  ngOnInit(): void {
    this.createUpdateUserForm();
    const user = this.authenticatedUser;
  }

  public submitUpdateUserForm(): void {
    const userToBeUpdated: UserInterface = {
      userId: this.authenticatedUser?.userId,
      email: this.authenticatedUser?.email,
      firstName: this.authenticatedUser?.firstName,
      lastName: this.authenticatedUser?.lastName,
      password: this.updateUserForm.controls.password.value,
      newPassword: this.updateUserForm.controls.newPassword.value,
    };

    this.userService.changePassword(userToBeUpdated).subscribe({
      next: () => {
        this.commonService.showSnackBarSuccess(
          'Parola a fost actualizată cu succes.',
        );

        this.userService.logout();
      },
      error: (error: HttpErrorResponse) => {
        const message =
          typeof error.error === 'string' ? error.error : error.error?.message;

        this.commonService.showSnackBarError(
          message || 'Parola nu a putut fi actualizată.',
        );
      },
    });
  }

  private createUpdateUserForm(): void {
    const passwordRegExp: RegExp = new RegExp(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~`!@#$%^&()--+={}[]|\\:;<>,.?/_₹])(?=.{8,20})',
    );
    this.updateUserForm = this.formBuilder.group(
      {
        password: ['', [Validators.required]],

        newPassword: [
          '',
          [
            Validators.required,
            Validators.pattern(passwordRegExp),
            Validators.minLength(8),
            Validators.maxLength(20),
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
