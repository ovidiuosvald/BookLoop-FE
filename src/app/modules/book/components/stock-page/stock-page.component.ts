import { CommonService } from '../../../../services/common.service';
import { StockService } from '../../../../services/category.service';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-stock-page',
  templateUrl: './stock-page.component.html',
  styleUrls: ['./stock-page.component.scss'],
})
export class StockPageComponent implements OnInit, OnDestroy {
  private _subscriptionList: Subscription[] = [];

  // objectToBeShown?: StockInterface;

  constructor(
    private _stockService: StockService,
    private _commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: { pzn: string }
  ) {}

  ngOnInit(): void {
    // this._subscriptionList.push(
    //   this._stockService.getStockByPznUsingGET(this.data.pzn).subscribe({
    //     next: (stock: StockInterface) => {
    //       this.objectToBeShown = stock;
    //     },
    //     error: () =>
    //       this._commonService.showSnackBarError(
    //         'Action was not completed! Stock details cannot be displayed!'
    //       ),
    //   })
    // );
  }

  ngOnDestroy(): void {
    this._subscriptionList.forEach((sub: Subscription) => sub.unsubscribe());
  }
}
