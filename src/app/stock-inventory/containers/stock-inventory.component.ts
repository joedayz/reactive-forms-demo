import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {StockInventoryService} from '../services/stock-inventory.service';
import {forkJoin, map, tap} from 'rxjs';
import {Item, Product} from '../models/product.interface';
import {StockBranchComponent} from '../components/stock-branch/stock-branch.component';
import {StockSelectorComponent} from '../components/stock-selector/stock-selector.component';
import {StockProductsComponent} from '../components/stock-products/stock-products.component';
import {CurrencyPipe, JsonPipe} from '@angular/common';
import {StockValidators} from './stock-inventory.validators';


// @ts-ignore
@Component({
  standalone: true,
  selector: 'stock-inventory',
  imports: [
    ReactiveFormsModule,
    StockBranchComponent,
    StockSelectorComponent,
    StockProductsComponent,
    CurrencyPipe,
    JsonPipe
  ],
  template: `
    <div class="stock-inventory">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">

        <stock-branch
          [parent]="form">
        </stock-branch>

        <stock-selector
          [parent]="form"
          [products]="products"
          (added)="addStock($event)">
        </stock-selector>

        <stock-products
          [parent]="form"
          [map]="productMap"
          (removed)="removeStock($event)">
        </stock-products>

        <div class="stock-inventory__price">
          Total: {{ total | currency:'USD':true }}
        </div>


        <div class="stock-inventory__buttons">
          <button
            type="submit"
            [disabled]="form.invalid">
            Order stock
          </button>
        </div>

        <pre>{{ form.value | json }}</pre>

      </form>
    </div>
  `
})
export class StockInventoryComponent implements OnInit {

  form!: FormGroup;
  productMap!: Map<number, Product>;
  products!: Product[];
  total: number = 0;

  constructor(private fb: FormBuilder,
              private stockService: StockInventoryService) {
  }

  ngOnInit(): void {

    this.form = this.fb.group({
      store: this.fb.group({
        branch: [
          '',
          [Validators.required, StockValidators.checkBranch],
          [this.validateBranch.bind(this)]],
        code: ['', Validators.required]
      }),
      selector: this.createStock({} as Item),
      stock: this.fb.array([])
    }, {validator: StockValidators.checkStockExists});

    const cart$ = this.stockService.getCartItems();
    const products$ = this.stockService.getProducts();


    forkJoin({cart: cart$, products: products$}).subscribe(({cart, products}) => {
      // Convert string IDs to numbers when creating the map
      const productEntries = products.map<[number, Product]>(p => [Number(p.id), p]);
      this.productMap = new Map<number, Product>(productEntries);

      console.log('ProductMap after conversion:', Array.from(this.productMap.entries()));

      this.products = products;

      cart.forEach(item => this.addStock(item));

      this.calculateTotal(this.form.get('stock')?.value);

      this.form.get('stock')?.valueChanges.subscribe(
        value => this.calculateTotal(value)
      );
    });


  }

  onSubmit() {
    console.log('Submit: ', this.form.value);
  }

  validateBranch(control: AbstractControl) {
    let valor = this.stockService.checkBranchId(control.value)
      .pipe(
        tap(res => console.log('res', res)),
        map((res: boolean) => res ? null : ({unknowBranch: true}))
      );
    return valor;
  }

  createStock(stock: Item) {
    return this.fb.group({
      product_id: parseInt(String(stock.product_id), 10) || '',
      quantity: stock.quantity || 10
    })
  }


  addStock(stock: Item) {
    const control = this.form.get('stock') as FormArray;
    control.push(this.createStock(stock));
  }


  removeStock({group, i}: { group: FormGroup, i: number }) {
    const control = this.form.get('stock') as FormArray;
    control.removeAt(i);
  }

  private calculateTotal(value: Item[]) {
    const total = value.reduce((prev, next) => {
      const product = this.productMap.get(next.product_id);
      const price = product?.price ?? 0; // Si no existe, usa 0
      return prev + (next.quantity * price);
    }, 0);
    this.total = total;
  }
}
