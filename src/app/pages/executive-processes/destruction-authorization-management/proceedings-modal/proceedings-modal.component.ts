import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IProccedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/proceedings-delivery-reception-model';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-proceedings-modal',
  templateUrl: './proceedings-modal.component.html',
  styles: [],
})
export class ProceedingsModalComponent extends BasePage implements OnInit {
  title: string = 'Actas';
  edit: boolean = false;

  proceedingForm: ModelForm<IProccedingsDeliveryReception>;
  proceeding: IProccedingsDeliveryReception;

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.proceedingForm = this.fb.group({
      id: [null, []],
      keysProceedings: [null, []],
      elaborationDate: [null, []],
      datePhysicalReception: [null, []],
      captureDate: [null, []],
      statusProceedings: [null, []],
    });
    if (this.proceeding != null) {
      this.edit = true;
      this.proceedingForm.patchValue(this.proceeding);
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    console.log('Crear');
  }

  update() {
    console.log('Actualizar');
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
