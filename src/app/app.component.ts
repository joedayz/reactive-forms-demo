import {Component} from '@angular/core';
import {StockInventoryComponent} from './stock-inventory/containers/stock-inventory.component';

@Component({
  selector: 'app-root',
  imports: [
    StockInventoryComponent
  ],
  template: `

    <div>
      <stock-inventory></stock-inventory>
    </div>

  `
})
export class AppComponent {

}

