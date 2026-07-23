import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { SharedModule } from 'src/app/shared-components/shared.module';
import { UpdateProfileComponent } from './components/update-profile/update-profile.component';
import { ForgotPasswordPageComponent } from './components/forgot-password-page/forgot-password-page.component';

const authRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  {
    path: 'forgot-password',
    component: ForgotPasswordPageComponent,
  },
];

@NgModule({
  declarations: [
    RegisterPageComponent,
    LoginPageComponent,
    ChangePasswordComponent,
    UpdateProfileComponent,
    ForgotPasswordPageComponent,
  ],
  imports: [RouterModule.forChild(authRoutes), SharedModule],
  providers: [],
  exports: [RouterModule],
})
export class AuthenticationModule {}
