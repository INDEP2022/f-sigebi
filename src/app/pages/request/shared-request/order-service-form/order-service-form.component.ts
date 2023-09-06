import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-order-service-form',
  templateUrl: './order-service-form.component.html',
  styles: [
    `
      a.text-color:hover,
      a.text-color:active {
        color: #9d2449;
        cursor: pointer;
      }
    `,
  ],
})
export class OrderServiceFormComponent implements OnInit, OnChanges {
  showOrderservice: boolean = true;
  disableAllChecks: boolean = false;
  @Input() op: number;
  @Input() showForm: boolean;
  @Input() ordServform: FormGroup = new FormGroup({});
  readonly: boolean = false;

  orderService: any = {};

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    console.log(this.op);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.orderService = this.ordServform.getRawValue();
    console.log('showForm', this.showForm);
  }
}
