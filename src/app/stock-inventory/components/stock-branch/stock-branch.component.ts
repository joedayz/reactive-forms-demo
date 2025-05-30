import {Component, Input} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';


@Component({
  standalone: true,
  selector: 'stock-branch',
  styleUrls: ['stock-branch.component.scss'],
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  template: `
    <div [formGroup]="parent">
      <div formGroupName="store">
        <input type="text" formControlName="branch" placeholder="Branch ID">
        <div class="error" *ngIf="required('branch')">
          Branch ID is required
        </div>
        <div class="error" *ngIf="invalid">
          Invalid branch code: 1 letter, 3 numbers
        </div>
        <div class="error" *ngIf="unknown">
          Unknow branch, please check the ID
        </div>
        <input type="text" formControlName="code" placeholder="Manager Code">
        <div class="error" *ngIf="required('code')">
          Code is required
        </div>
      </div>
    </div>
  `
})
export class StockBranchComponent {


  @Input()
  parent!: FormGroup;


  get unknown(){
    return (
      this.parent.get('store.branch')?.hasError('unknowBranch') &&
        this.parent.get('store.branch')?.dirty
    );
  }

  get invalid(){
    return (
      this.parent.get('store.branch')?.hasError('invalidBranch') && this.parent.get('store.branch')?.dirty &&
        !this.required('branch')
    );
  }

  required(name: string){
    return(
      this.parent.get(`store.${name}`)?.hasError('required') && this.parent.get(`store.${name}`)?.touched
    );
  }
}
