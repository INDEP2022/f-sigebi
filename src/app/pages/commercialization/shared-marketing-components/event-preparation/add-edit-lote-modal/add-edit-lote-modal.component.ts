import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ILot } from 'src/app/core/models/ms-lot/lot.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-add-edit-lote-modal',
  templateUrl: './add-edit-lote-modal.component.html',
  styles: [],
})
export class AddEditLoteModalComponent extends BasePage implements OnInit {
  title: string = 'Lote';
  edit: boolean = false;

  loteForm: ModelForm<ILot>;
  lote: ILot;

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.loteForm = this.fb.group({
      id: [
        null,
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(1),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      eventId: [null, []],
      publicLot: [null, []],
      description: [null, []],
      baseValue: [null, []],
      customerId: [null, []],
      transferenceNumber: [null, []],
      warrantyPrice: [null, []],
      finalPrice: [null, []],
      referential: [null, []],
      statusVtantId: [null, []],
      assignedEs: [null, []],
      scrapEs: [null, []],
      location: [null, []],
    });
    if (this.lote != null) {
      this.edit = true;
      this.loteForm.patchValue(this.lote);
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.handleSuccess();
  }

  update() {
    this.loading = true;
    this.handleSuccess();
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;

    this.modalRef.hide();
  }
}
