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
  public hide: boolean = true;
  public loginForm!: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _commonService: CommonService
  ) {}

  ngOnInit(): void {
    this._createForm();
  }
  public goToRegister() {
    this._commonService.goToRegisterPage();
  }
  public login() {
    const credentials: CredentialsInterface = {
      ...this.loginForm.getRawValue(),
    };
    if (this.loginForm.valid) {
      this._userService.loginUsingPOST(credentials).subscribe({
        next: () => {
          this._userService.getUser(credentials.email);
        },
        error: () => {
          this._commonService.showSnackBarError('Bad credentials!');
        },
      });
    }
  }

  private _createForm(): void {
    this.loginForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }
}
