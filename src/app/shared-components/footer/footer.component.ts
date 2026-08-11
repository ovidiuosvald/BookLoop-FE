import { Component } from '@angular/core';

import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  readonly currentYear = new Date().getFullYear();

  constructor(private readonly commonService: CommonService) {}

  goToHomePage(): void {
    this.commonService.goToHomePage();
  }

  goToAllBooks(): void {
    this.commonService.goToAllBooks();
  }

  goToBestsellers(): void {
    this.commonService.goToBestsellers();
  }

  goToProfile(): void {
    this.commonService.goToProfile();
  }

  goToAddresses(): void {
    this.commonService.goToAddresses();
  }

  goToOrders(): void {
    this.commonService.goToOrders();
  }

  goToFavorites(): void {
    this.commonService.goToFavorites();
  }

  goToTerms(): void {
    this.commonService.goToTermsAndConditions();
  }

  goToPrivacy(): void {
    this.commonService.goToPrivacyPolicy();
  }

  goToDelivery(): void {
    this.commonService.goToDeliveryAndReturns();
  }

  openMap(): void {
    window.open(
      'https://www.google.com/maps/search/?api=1&query=Strada+Matei+Corvin+46+Oradea',
      '_blank',
      'noopener,noreferrer',
    );
  }
}
