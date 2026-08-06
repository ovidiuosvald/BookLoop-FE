import { RequestInterceptor } from './interceptors/request-interceptor';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeRo from '@angular/common/locales/ro';
import { LOCALE_ID } from '@angular/core';
import { SharedModule } from './shared-components/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TermsAndConditionsComponent } from './pages/terms-and-conditions/terms-and-conditions.component';

registerLocaleData(localeRo);

@NgModule({
  declarations: [AppComponent, TermsAndConditionsComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
  ],

  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'ro' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
