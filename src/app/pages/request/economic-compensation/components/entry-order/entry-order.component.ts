import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-entry-order',
  templateUrl: './entry-order.component.html',
  styles: [],
})
export class EntryOrderComponent extends BasePage implements OnInit {
  entryOrderForm: FormGroup = new FormGroup({});
  @Output() onSave = new EventEmitter<boolean>();
  maxDate: Date = new Date();

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.entryOrderForm = this.fb.group({
      administrativeUnit: [null, [Validators.required]],
      orderDate: [null, [Validators.required]],
      concept: [null, [Validators.required]],
      paymentMethod: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      referenceNo: [null, [Validators.required]],
      bank: [null, [Validators.required]],
    });
  }

  save() {
    //Llamar servicio para guardar orden de ingreso
    console.log(this.entryOrderForm.value);
    this.onSave.emit(true);
    this.onLoadToast('success', 'Orden de ingreso registrada con éxito', '');
  }
}
