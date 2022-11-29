import { Component, Input, OnInit } from '@angular/core';
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
export class OrderServiceFormComponent implements OnInit {
  showOrderservice: boolean = true;
  form: FormGroup = new FormGroup({});
  @Input() op: number;
  @Input() showForm: boolean;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      tranportZone: [null],
      folioTlp: [null],
      visit: [null],
      razonsNoRealization: [null],
      consolidate: [null],
    });
  }
}
