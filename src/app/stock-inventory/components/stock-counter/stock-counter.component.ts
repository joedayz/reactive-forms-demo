import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';


@Component({
  standalone: true,
  selector: 'stock-counter',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StockCounterComponent),
      multi: true
    }
  ],
  styleUrls: ['stock-counter.component.scss'],
  template: `
    <div class="stock-counter" [class.focused]="focus">
      <div>
        <div tabindex="0" (keydown)="onKeyDown($event)"
             (blur)="onBlur($event)"
             (focus)="onFocus($event)">
          <p>{{ value }}</p>
          <div>
            <button type="button" (click)="increment()" [disabled]="value==max">
              +
            </button>
            <button type="button" (click)="decrement()" [disabled]="value==min">
              -
            </button>
          </div>
        </div>
      </div>
    </div>
  `})
export class StockCounterComponent implements ControlValueAccessor{

  private onTouch!: Function;
  private onModelChange!: Function;

  @Input()
  step: number = 10;
  @Input()
  min: number = 10;
  @Input()
  max: number = 1000;

  value: number = 10;
  focus: boolean = false;



  increment() {
    if(this.value < this.max) {
      this.value = this.value + this.step;
      this.onModelChange(this.value);
    }
    this.onTouch();
  }

  decrement() {
    if(this.value > this.min) {
      this.value = this.value - this.step;
      this.onModelChange(this.value);
    }
    this.onTouch();
  }

  onKeyDown(event: KeyboardEvent) {
    const handlers = {
      ArrowDown: () => this.decrement(),
      ArrowUp: () => this.increment()
    };

    function isValidKey(key: string): key is keyof typeof handlers {
      return key in handlers;
    }

    if (isValidKey(event.code)) {
      handlers[event.code]();
      event.preventDefault();
      event.stopPropagation();
    }
  }

  onBlur(event: FocusEvent) {
    this.focus = false;
    event.preventDefault();
    event.stopPropagation();
    this.onTouch();
  }

  onFocus(event: FocusEvent) {
    this.focus = true;
    event.preventDefault();
    event.stopPropagation();
    this.onTouch();
  }

  writeValue(value: any): void {
    this.value = value || 0;
  }
  registerOnChange(fn: any): void {
    this.onModelChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch =  fn;
  }

}
