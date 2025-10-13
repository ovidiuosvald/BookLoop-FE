import { CommonService } from '../../../../services/common.service';
import { UserInterface } from 'src/app/models/user.model';
import { UserService } from '../../../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { confirmPasswordValidator } from 'src/app/validators/confirm-passwod.validator';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  public updateUserForm!: FormGroup;
  public hide: boolean = true;
  public authenticatedUser?: UserInterface;

  constructor(
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _commonService: CommonService
  ) {
    this.authenticatedUser = this._userService.authenticatedUser;
  }

  ngOnInit(): void {
    this._createUpdateUserForm();
    const user = this.authenticatedUser;
  }

  public submitUpdateUserForm() {
    const userToBeUpdated: UserInterface = {
      userId: this.authenticatedUser?.userId,
      email: this.authenticatedUser?.email,
      username: this.authenticatedUser?.username,
      password: this.updateUserForm.controls.password.value,
      newPassword: this.updateUserForm.controls.newPassword.value,
    };

    this._userService.changePasswordUsingPUT(userToBeUpdated).subscribe({
      next: () => {
        this._userService.logoutUsingPOST();
        this._commonService.showSnackBarSuccess(
          'Account was updated successfully!'
        ),
          this._commonService.goToLoginPage();
      },
      error: (response) => {
        this._commonService.showSnackBarError(response.error);
      },
    });
  }

  private _createUpdateUserForm(): void {
    const passwordRegExp: RegExp = new RegExp(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~`!@#$%^&()--+={}[]|\\:;<>,.?/_₹])(?=.{8,20})'
    );
    this.updateUserForm = this._formBuilder.group(
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
          'confirmNewPassword'
        ),
      }
    );
  }
}
