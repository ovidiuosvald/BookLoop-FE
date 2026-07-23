import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs';

import { UserService } from '../../../../services/user.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-forgot-password-page',
  templateUrl: './forgot-password-page.component.html',
  styleUrls: ['./forgot-password-page.component.scss'],
})
export class ForgotPasswordPageComponent implements OnInit {
  public forgotPasswordForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private commonService: CommonService,
  ) {}

  ngOnInit(): void {
    this.createForgotPasswordForm();
  }

  public submitForgotPasswordForm(): void {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    const { email } = this.forgotPasswordForm.getRawValue();

    this.sendResetPasswordEmail(email);
  }

  private createForgotPasswordForm(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  private sendResetPasswordEmail(email: string): void {
    this.userService
      .forgotPasswordUsingPOST(email)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.commonService.showSnackBarSuccess(
            'Dacă există un cont asociat acestei adrese, vei primi un email cu instrucțiunile pentru resetarea parolei.',
          );

          this.forgotPasswordForm.reset();
        },
        error: (response) => {
          if (response?.error) {
            this.commonService.showSnackBarError(response.error);
            return;
          }

          this.commonService.showSnackBarError(
            'Instrucțiunile nu au putut fi trimise. Încearcă din nou.',
          );
        },
      });
  }
}
