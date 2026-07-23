import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { UpdateProfileComponent } from './components/update-username/update-profile.component';
import { SharedModule } from 'src/app/shared-components/shared.module';

const authRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
];

@NgModule({
  declarations: [
    RegisterPageComponent,
    LoginPageComponent,
    ChangePasswordComponent,
    UpdateProfileComponent,
  ],
  imports: [RouterModule.forChild(authRoutes), SharedModule],
  providers: [],
  exports: [RouterModule],
})
export class AuthenticationModule {}
