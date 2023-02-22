import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IComiXThird } from 'src/app/core/models/ms-thirdparty/third-party.model';

@Component({
  selector: 'app-amount-third-modal',
  templateUrl: './amount-third-modal.component.html',
  styles: [],
})
export class AmountThirdModalComponent implements OnInit {
  title: string = 'Montos';
  edit: boolean = false;

  amountForm: ModelForm<IComiXThird>;
  amounts: IComiXThird;

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.amountForm = this.fb.group({
      idComiXThird: [null, []],
      idThirdParty: [null, []],
      startingAmount: [null, []],
      pctCommission: [null, []],
      finalAmount: [null, []],
    });
    if (this.amounts != null) {
      this.edit = true;
      this.amountForm.patchValue(this.amounts);
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  update() {
    console.log('Actualizar');
  }

  create() {
    console.log('Crear');
  }
}
