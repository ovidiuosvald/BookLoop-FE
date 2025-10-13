import { noSpacesValidator } from 'src/app/validators/username.validator';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserInterface } from 'src/app/models/user.model';
import { CommonService } from 'src/app/services/common.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-update-username',
  templateUrl: './update-username.component.html',
  styleUrls: ['./update-username.component.scss'],
})
export class UpdateUsernameComponent implements OnInit {
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
    if (!!user) {
      this.updateUserForm.patchValue(user);
    } else {
      this._commonService.showSnackBarError('Failed to get user information!');
    }
  }

  public goToHomePage() {
    this._commonService.goToHomePage();
  }
  public submitUpdateUserForm() {
    const userToBeUpdated: UserInterface = {
      userId: this.authenticatedUser?.userId,
      email: this.authenticatedUser?.email,
      username: this.updateUserForm.controls.username.value,
    };

    this._userService.updateUserUsingPUT(userToBeUpdated).subscribe({
      next: () => {
        this._commonService.showSnackBarSuccess(
          'Account was updated successfully!'
        );
        this._userService.getUser(userToBeUpdated.email!);
      },
      error: (response) => {
        this._commonService.showSnackBarError(response.error);
      },
    });
  }

  private _createUpdateUserForm(): void {
    this.updateUserForm = this._formBuilder.group({
      username: [
        '',
        [
          Validators.required,
          noSpacesValidator,
          Validators.minLength(5),
          Validators.maxLength(50),
        ],
      ],
    });
  }
}
