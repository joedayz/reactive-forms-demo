import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Product} from '../../models/product.interface';
import {NgForOf} from '@angular/common';
import {StockCounterComponent} from '../stock-counter/stock-counter.component';

@Component({
  standalone: true,
  selector: 'stock-selector',
  styleUrls: ['stock-selector.component.scss'],
  imports: [
    ReactiveFormsModule,
    NgForOf,
    StockCounterComponent
  ],
  template: `
    <div class="stock-selector" [formGroup]="parent">

      <div formGroupName="selector">


        <select formControlName="product_id">
          <option value="">Select stock</option>
          <option *ngFor="let product of products" [value] = "product.id">
            {{ product.name}}
          </option>
        </select>

        <stock-counter
          [step]="10"
          [min]="10"
          [max]="1000" formControlName="quantity"></stock-counter>
        <button type="button" (click)="onAdd()">
          Add Stock
        </button>
      </div>
    </div>

  `
})
export class StockSelectorComponent {

  @Input()
  parent!: FormGroup

  @Input()
  products!: Product[];

  @Output()
  added = new EventEmitter<any>();


  onAdd() {
    this.added.emit(this.parent.get('selector')?.value);
    this.parent.get('selector')?.reset({
      product_id: '',
      quantity: 10
    });
  }
}
