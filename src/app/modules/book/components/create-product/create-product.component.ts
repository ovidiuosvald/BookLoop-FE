import { CommonService } from '../../../../services/common.service';
import { StockService } from '../../../../services/category.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { take } from 'rxjs';

@Component({
  selector: 'app-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss'],
})
export class CreateProductComponent implements OnInit {
  // public productObject!: ProductInterface;
  // public stockToBeUpdated?: StockInterface;
  // public productToBeUpdated?: ProductInterface;
  public productForm!: FormGroup;
  public stockForm!: FormGroup;
  public isEditable: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _stockService: StockService,
    private _commonService: CommonService,
    private _activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this._createProductForm();
    this._createStockForm();
    // this._getPznFromRoute();
  }
  public goToProducts() {
    this._commonService.goToCart();
  }
  // accessed by click on save button
  // public submitForms(): void {
  //   this.productForm.patchValue({
  //     pzn: this.handlePzn(this.productForm.get('pzn')?.value),
  //   });
  //   this.productObject = {
  //     ...this.productForm.getRawValue(),
  //   };

  //   this.isEditable = false;
  //   !!this.productToBeUpdated
  //     ? this._updateProductObject(this.productObject)
  //     : this._createProductObject(this.productObject);
  // }

  public editProductandStock(pzn: string): void {
    this._commonService.goToSpecificBook(pzn);
  }

  private _createProductForm(): void {
    this.productForm = this._formBuilder.group({
      pzn: ['', [Validators.required, Validators.maxLength(8)]],
      productName: ['', [Validators.required, Validators.maxLength(100)]],
      supplier: ['', Validators.maxLength(100)],
      strength: ['', [Validators.required, Validators.maxLength(100)]],
      packageSize: ['', [Validators.required, Validators.maxLength(20)]],
      unit: ['', [Validators.required, Validators.maxLength(2)]],
    });
  }

  private _createStockForm(): void {
    this.stockForm = this._formBuilder.group({
      quantity: ['', Validators.required],
      price: ['', Validators.required],
    });
  }

  // private _createProductObject(product: ProductInterface): void {
  //   this._productService
  //     .createProductUsingPOST(product)
  //     .pipe(take(1))
  //     .subscribe({
  //       next: () => {
  //         this._createStockObject();
  //       },
  //       error: (response) =>
  //         this._commonService.showSnackBarError(response.error),
  //     });
  // }

  // private _createStockObject(): void {
  //   let newStockObject = this.stockForm.getRawValue();
  //   this._stockService
  //     .createStockUsingPOST(this.productForm.controls.pzn.value, newStockObject)
  //     .pipe(take(1))
  //     .subscribe({
  //       next: () =>
  //         this._commonService.showSnackBarSuccess(
  //           'Product and stock details were created successfully!'
  //         ),
  //       error: () =>
  //         this._commonService.showSnackBarError(
  //           'Product and stock details were NOT created successfully!'
  //         ),
  //     });
  // }

  // private _getPznFromRoute(): void {
  //   this._activatedRoute.params.subscribe((params: Params) => {
  //     if (!params.id) {
  //       this._commonService.goToCart();
  //     } else {
  //       this._getProductByPzn(params.id);
  //     }
  //   });
  // }

  // private _getProductByPzn(pzn: string): void {
  //   this._productService
  //     .getProductByPznUsingGET(pzn)
  //     .pipe(take(1))
  //     .subscribe({
  //       next: (product: ProductInterface) => {
  //         this.productToBeUpdated = product;
  //         this.productForm.patchValue(product);
  //         this._getStockByPzn(product.pzn);
  //       },
  //     });
  // }
  // private _getStockByPzn(pzn: string) {
  //   this._stockService
  //     .getStockByPznUsingGET(pzn)
  //     .pipe(take(1))
  //     .subscribe({
  //       next: (stock: StockInterface) => {
  //         this.stockToBeUpdated = stock;
  //         this.stockForm.patchValue(stock);
  //       },
  //       error: () =>
  //         this._commonService.showSnackBarError(
  //           'Something went wrong! Stock cannot be displayed!'
  //         ),
  //     });
  // }
  // private _updateProductObject(productObject: ProductInterface): void {
  //   this._productService
  //     .updateProductUsingPUT(productObject)
  //     .pipe(take(1))
  //     .subscribe({
  //       next: (productObject: ProductInterface) =>
  //         this._updateStockObject(productObject.pzn),
  //       error: () =>
  //         this._commonService.showSnackBarError(
  //           'Something went wrong! Product and stock could NOT be updated!'
  //         ),
  //     });
  // }
  // private _updateStockObject(pzn: string): void {
  //   const stockUpdated: StockInterface = {
  //     stockId: this.stockToBeUpdated?.stockId,
  //     ...this.stockForm.getRawValue(),
  //   };
  //   this._stockService
  //     .updateStockUsingPUT(pzn, stockUpdated)
  //     .pipe(take(1))
  //     .subscribe({
  //       next: () =>
  //         this._commonService.showSnackBarSuccess(
  //           'Product and stock were successfully updated!'
  //         ),
  //       error: () =>
  //         this._commonService.showSnackBarError(
  //           'Something went wrong! Product and stock could NOT be updated!'
  //         ),
  //     });
  // }

  private handlePzn(pzn: string) {
    const pznLength = pzn.length;
    if (pznLength < 8) {
      let newPzn = '';
      for (let i = 0; i < 8 - pznLength; i++) {
        newPzn = newPzn + '0';
      }
      newPzn = newPzn + pzn;
      return newPzn;
    } else {
      return pzn;
    }
  }
}
