import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Product} from '../../models/product.interface';
import {CurrencyPipe, NgForOf} from '@angular/common';


@Component({
  standalone: true,
  selector: 'stock-products',
  styleUrls: ['stock-products.component.scss'],
  imports: [
    ReactiveFormsModule,
    NgForOf,
    CurrencyPipe
  ],
  template: `
    <div class="stock-product" [formGroup]="parent">
      <div formArrayName="stock">
        <div
          *ngFor="let item of stocks; let i = index;">

          <div class="stock-product__content" [formGroupName]="i">

            <div class="stock-product__name">
              {{ getProduct(item.get('product_id')?.value)?.name }}
            </div>

            <div class="stock-product__price">
              {{ getProduct(item.get('product_id')?.value)?.price | currency:'USD':true }}
            </div>

            <input
              type="number"
              step="10"
              min="10"
              max="1000"
              formControlName="quantity">
            <button
              type="button"
              (click)="onRemove(item, i)">
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  `

})
export class StockProductsComponent  implements OnInit{

  @Input()
  parent!: FormGroup

  @Input()
  map!: Map<number, Product>;

  @Output()
  removed = new EventEmitter<any>();

  ngOnInit() {
    console.log('Initial map size:', this.map?.size);
    console.log('Initial map contents:', Array.from(this.map?.entries() || []));
  }


  get stocks() {
    return (this.parent.get('stock') as FormArray).controls;
  }

  onRemove(group: any, i: number) {
    this.removed.emit({group, i});
  }

  getProduct(id: number) {
    console.log('Looking up product with ID:', id, 'Map has:', Array.from(this.map.keys()));
    return this.map.get(id);
  }


}
