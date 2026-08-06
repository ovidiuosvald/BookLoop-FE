import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Order } from 'src/app/models/order.model';

@Component({
  selector: 'app-checkout-success',
  templateUrl: './checkout-success.component.html',
  styleUrls: ['./checkout-success.component.scss'],
})
export class CheckoutSuccessComponent implements OnInit {
  order?: Order;

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();

    this.order = navigation?.extras.state?.order ?? history.state?.order;

    if (!this.order) {
      this.router.navigate(['/']);
    }
  }
}
