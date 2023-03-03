import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import {
  IComerComCalculated,
  IThirdParty2,
} from 'src/app/core/models/ms-thirdparty/third-party.model';
import { ComerComCalculatedService } from 'src/app/core/services/ms-thirdparty/comer-comcalculated';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-comcalculated-modal',
  templateUrl: './comcalculated-modal.component.html',
  styles: [],
})
export class ComcalculatedModalComponent extends BasePage implements OnInit {
  title: string = 'Calcular';
  edit: boolean = false;

  calculatedForm: ModelForm<IComerComCalculated>;
  calculated: IComerComCalculated;

  idT: IThirdParty2;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private comerComCalculatedService: ComerComCalculatedService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.calculatedForm = this.fb.group({
      comCalculatedId: [null, []],
      thirdComerId: [null, []],
      userBelieve: [null, []],
      believeDate: [null, []],
      startDate: [null, []],
      endDate: [null, []],
      eventId: [null, []],
      commissionTotal: [null, []],
      changeType: [null, []],
    });
    if (this.calculated != null) {
      this.edit = true;
      this.idT = this.calculated.thirdComerId as unknown as IThirdParty2;
      this.calculatedForm.patchValue(this.calculated);
      this.calculatedForm.controls['thirdComerId'].setValue(
        this.idT.thirdComerId
      );
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
    this.comerComCalculatedService.create(this.calculatedForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.comerComCalculatedService
      .update(this.calculated.comCalculatedId, this.calculatedForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;

    this.modalRef.hide();
  }
}
