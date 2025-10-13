import { CommonService } from '../../../../services/common.service';
import { DialogBoxConfirmationComponent } from '../../../../shared-components/dialog-box-confirmation/dialog-box-confirmation.component';
import { StockPageComponent } from '../stock-page/stock-page.component';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-display-products',
  templateUrl: './display-products.component.html',
  styleUrls: ['./display-products.component.scss'],
})
export class DisplayProductsComponent implements OnInit, OnDestroy {
  private _subscriptionList: Subscription[] = [];

  dataSource = new MatTableDataSource();

  displayedColumns: string[] = [
    'position',
    'pzn',
    'supplier',
    'productName',
    'strength',
    'packageSize',
    'unit',
    'actions',
  ];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _commonService: CommonService,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // this._subscriptionList.push(
    //   this._productService.getAllProductsUsingGET().subscribe({
    //     next: (listOfProducts: ProductInterface[]) => {
    //       this.dataSource.data = listOfProducts;
    //     },
    //     error: () =>
    //       this._commonService.showSnackBarError(
    //         'Action was not completed! Stock details cannot be displayed!'
    //       ),
    //   })
    // );
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this._subscriptionList.forEach((sub: Subscription) => sub.unsubscribe());
  }
  public goToCreateProduct() {
    this._commonService.goToCart();
  }
  // public openDialog(product: ProductInterface): void {
  //   this._dialog.open(StockPageComponent, {
  //     data: { pzn: product.pzn },
  //   });
  // }

  public editProductandStock(pzn: string): void {
    this._commonService.goToSpecificBook(pzn);
  }

  // public deleteProductAndStock(pzn: string): void {
  //   const dialogRef = this._dialog.open(DialogBoxConfirmationComponent, {
  //     data: {
  //       message:
  //         'Are you sure you want to delete this product and stock details?',
  //     },
  //   });
  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result == 'yes') {
  //       this._productService.deleteProductUsingDELETE(pzn).subscribe({
  //         next: () => {
  //           const index = this.dataSource.data.findIndex((item: any) => {
  //             return item.pzn == pzn;
  //           });
  //           this.dataSource.data.splice(index, 1);
  //           const newDataSourceList = this.dataSource.data;
  //           this.dataSource.data = newDataSourceList;
  //           this._commonService.showSnackBarSuccess(
  //             'Product and stock details were successfully deleted!'
  //           );
  //         },
  //         error: () =>
  //           this._commonService.showSnackBarError(
  //             'Action was not completed! Product and stock details were NOT deleted!'
  //           ),
  //       });
  //     }
  //   });
  // }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
