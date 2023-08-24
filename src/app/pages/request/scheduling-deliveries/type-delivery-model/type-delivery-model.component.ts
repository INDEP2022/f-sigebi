import { Component, EventEmitter, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'app-type-delivery-model',
  templateUrl: './type-delivery-model.component.html',
  styles: [],
})
export class TypeDeliveryModelComponent extends BasePage implements OnInit {
  typeForm: FormGroup = new FormGroup({});
  typeEvent: number = null;
  event: EventEmitter<string> = new EventEmitter();

  private fb = inject(FormBuilder);
  private bsModelRef = inject(BsModalRef);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.typeForm = this.fb.group({
      type: [null, Validators.required],
    });
  }

  confirm() {
    this.event.emit(this.typeForm.getRawValue());
  }

  close() {
    this.bsModelRef.hide();
  }
}
