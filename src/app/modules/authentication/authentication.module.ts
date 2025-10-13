import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { UpdateUsernameComponent } from './components/update-username/update-username.component';
import { MaterialModule } from '../material.module';

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
    UpdateUsernameComponent,
  ],
  imports: [
    RouterModule.forChild(authRoutes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  providers: [],
  exports: [RouterModule],
})
export class AuthenticationModule {}
