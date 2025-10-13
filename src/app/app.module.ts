import { RequestInterceptor } from './interceptors/request-interceptor';
import { DialogBoxConfirmationComponent } from './shared-components/dialog-box-confirmation/dialog-box-confirmation.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './shared-components/header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MaterialModule } from './modules/material.module';
import { registerLocaleData } from '@angular/common';
import localeRo from '@angular/common/locales/ro';
import { LOCALE_ID } from '@angular/core';
import { CategoryService } from './services/category.service';
registerLocaleData(localeRo);

@NgModule({
  declarations: [AppComponent, HeaderComponent, DialogBoxConfirmationComponent],
  imports: [
    MaterialModule,
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    RouterModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
  ],

  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'ro' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
