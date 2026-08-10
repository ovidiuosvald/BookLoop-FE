import { NgModule } from '@angular/core';
import { NavButtonComponent } from './nav-button/nav-button.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../modules/material.module';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthenticationRequiredDialogComponent } from './authentication-required-dialog/authentication-required-dialog.component';
import { NotificationComponent } from './notification/notification.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';

@NgModule({
  declarations: [
    NavButtonComponent,
    HeaderComponent,
    AuthenticationRequiredDialogComponent,
    NotificationComponent,
    ConfirmationDialogComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
  ],
  exports: [
    CommonModule,
    MaterialModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,

    // components
    NavButtonComponent,
    HeaderComponent,
    AuthenticationRequiredDialogComponent,
    ConfirmationDialogComponent,
  ],
})
export class SharedModule {}
