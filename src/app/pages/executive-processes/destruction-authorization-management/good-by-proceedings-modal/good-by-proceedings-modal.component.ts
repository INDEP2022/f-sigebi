import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IDetailProceedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/detail-proceedings-delivery-reception.model';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-good-by-proceedings-modal',
  templateUrl: './good-by-proceedings-modal.component.html',
  styles: [],
})
export class GoodByProceedingsModalComponent
  extends BasePage
  implements OnInit
{
  title: string = 'BIENES POR ACTA';
  edit: boolean = false;

  detailProceedingsForm: ModelForm<IDetailProceedingsDeliveryReception>;
  detailProceedings: IDetailProceedingsDeliveryReception;

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.detailProceedingsForm = this.fb.group({
      numberGood: [null, [Validators.required]],
    });
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
  }

  update() {
    this.loading = true;
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
