import { UserInterface } from '../../../../models/user.model';
import { UserService } from '../../../../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { confirmPasswordValidator } from 'src/app/validators/confirm-passwod.validator';
import { noSpacesValidator } from 'src/app/validators/username.validator';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
})
export class RegisterPageComponent implements OnInit {
  public registerForm!: FormGroup;
  public hide: boolean = true;

  constructor(
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _commonService: CommonService
  ) {}

  ngOnInit(): void {
    this._createRegisterForm();
  }

  public goToLogin() {
    this._commonService.goToLoginPage();
  }
  public submitRegisterForm() {
    const user: UserInterface = {
      userId: null,
      creationDate: new Date(),
      ...this.registerForm.getRawValue(),
    };
    this._createUserObject(user);
  }

  private _createRegisterForm(): void {
    const passwordRegExp: RegExp = new RegExp(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~`!@#$%^&()--+={}|\\:;<>,.?/_₹])(?=.{8,20})'
    );
    this.registerForm = this._formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        username: [
          '',
          [
            Validators.required,
            noSpacesValidator,
            Validators.minLength(5),
            Validators.maxLength(50),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(passwordRegExp),
            Validators.minLength(8),
            Validators.maxLength(20),
          ],
        ],

        confirmPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(20),
          ],
        ],
      },
      {
        validators: confirmPasswordValidator('password', 'confirmPassword'),
      }
    );
  }

  private _createUserObject(user: UserInterface): void {
    this._userService
      .createUserUsingPOST(user)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this._commonService.showSnackBarSuccess(
            'Account was created successfully! Please log in!'
          );
          this._commonService.goToLoginPage();
        },
        error: (response) => {
          if (!!response) {
            this._commonService.showSnackBarError(response.error);
          }
          this._commonService.showSnackBarError(
            'Something went wrong! Account was not created successfull!'
          );
        },
      });
  }
}
