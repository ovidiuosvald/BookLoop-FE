import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs';

import { UserInterface } from '../../../../models/user.model';
import { UserService } from '../../../../services/user.service';
import { CommonService } from 'src/app/services/common.service';
import { confirmPasswordValidator } from 'src/app/validators/confirm-passwod.validator';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
})
export class RegisterPageComponent implements OnInit {
  public registerForm!: FormGroup;

  public hidePassword = true;
  public hideConfirmPassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private commonService: CommonService,
  ) {}

  ngOnInit(): void {
    this.createRegisterForm();
  }

  public submitRegisterForm(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { firstName, lastName, email, password } =
      this.registerForm.getRawValue();

    const user: UserInterface = {
      firstName,
      lastName,
      email,
      password,
      creationDate: new Date(),
    };

    this.createUser(user);
  }

  private createRegisterForm(): void {
    const passwordRegExp = new RegExp(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~`!@#$%^&()\\-+=\\[\\]{}|\\\\:;<>,.?/_₹])(?=.{8,20}$)',
    );

    this.registerForm = this.formBuilder.group(
      {
        firstName: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(50),
          ],
        ],
        lastName: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(50),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(20),
            Validators.pattern(passwordRegExp),
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
      },
    );
  }

  private createUser(user: UserInterface): void {
    this.userService
      .createUserUsingPOST(user)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.commonService.showSnackBarSuccess(
            'Contul a fost creat cu succes. Te poți autentifica.',
          );

          this.commonService.goToLoginPage();
        },
        error: (response) => {
          if (response?.error) {
            this.commonService.showSnackBarError(response.error);
            return;
          }

          this.commonService.showSnackBarError(
            'A apărut o eroare. Contul nu a putut fi creat.',
          );
        },
      });
  }
}
