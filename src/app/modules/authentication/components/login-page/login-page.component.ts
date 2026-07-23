import { UserService } from '../../../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { CredentialsInterface } from 'src/app/models/credentials.model';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  public hide = true;
  public loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private commonService: CommonService,
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  public goToRegister(): void {
    this.commonService.goToRegisterPage();
  }

  public login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const credentials: CredentialsInterface = this.loginForm.getRawValue();

    this.userService.loginUsingPOST(credentials).subscribe({
      next: () => {
        this.userService.getUser(credentials.email);
      },
      error: () => {
        this.commonService.showSnackBarError(
          'Emailul sau parola sunt incorecte.',
        );
      },
    });
  }

  private createForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
}
