import { NgModule } from '@angular/core';
import { NavButtonComponent } from './nav-button/nav-button.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../modules/material.module';
import { HeaderComponent } from './header/header.component';
import { DialogBoxConfirmationComponent } from './dialog-box-confirmation/dialog-box-confirmation.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    NavButtonComponent,
    HeaderComponent,
    DialogBoxConfirmationComponent,
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
    DialogBoxConfirmationComponent,
  ],
})
export class SharedModule {}
