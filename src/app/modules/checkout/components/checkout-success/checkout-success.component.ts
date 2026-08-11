import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Models
import { Order } from 'src/app/models/order.model';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-checkout-success',
  templateUrl: './checkout-success.component.html',
  styleUrls: ['./checkout-success.component.scss'],
})
export class CheckoutSuccessComponent implements OnInit {
  order?: Order;

  constructor(
    private readonly router: Router,
    private readonly commonService: CommonService,
  ) {}

  ngOnInit(): void {
    this.order =
      this.router.getCurrentNavigation()?.extras.state?.order ??
      history.state?.order;

    if (!this.order) {
      this.goToStore();
    }
  }

  private goToStore(): void {
    this.commonService.goToAllBooks();
  }
}
