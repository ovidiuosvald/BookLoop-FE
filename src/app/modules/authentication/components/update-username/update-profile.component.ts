import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserInterface } from 'src/app/models/user.model';
import { CommonService } from 'src/app/services/common.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss'],
})
export class UpdateProfileComponent implements OnInit {
  public updateUserForm!: FormGroup;
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

    if (this.authenticatedUser) {
      this.updateUserForm.patchValue({
        firstName: this.authenticatedUser.firstName,
        lastName: this.authenticatedUser.lastName,
      });
    } else {
      this.commonService.showSnackBarError('Failed to get user information!');
    }
  }

  public goToHomePage(): void {
    this.commonService.goToHomePage();
  }

  public submitUpdateUserForm(): void {
    if (this.updateUserForm.invalid || !this.authenticatedUser?.userId) {
      this.updateUserForm.markAllAsTouched();
      return;
    }

    const userToBeUpdated: UserInterface = {
      userId: this.authenticatedUser.userId,
      firstName: this.updateUserForm.value.firstName.trim(),
      lastName: this.updateUserForm.value.lastName.trim(),
    };

    this.userService.updateUserUsingPUT(userToBeUpdated).subscribe({
      next: () => {
        this.commonService.showSnackBarSuccess(
          'Account was updated successfully!',
        );

        if (this.authenticatedUser?.email) {
          this.userService.getUser(this.authenticatedUser.email);
        }
      },
      error: (response) => {
        this.commonService.showSnackBarError(response.error);
      },
    });
  }

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
}
