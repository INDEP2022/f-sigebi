import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ISampleGood } from 'src/app/core/models/ms-goodsinv/sampling-good-view.model';
import { orderentryService } from 'src/app/core/services/ms-comersale/orderentry.service';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ModelForm } from '../../../../../core/interfaces/model-form';
import { DefaultSelect } from '../../../../../shared/components/select/default-select';
import { UnitAdmin } from './unit-admin';

@Component({
  selector: 'app-data-capture-for-entry-order-form',
  templateUrl: './data-capture-for-entry-order-form.component.html',
  styles: [],
})
export class DataCaptureForEntryOrderFormComponent
  extends BasePage
  implements OnInit
{
  dataForm: ModelForm<any>;
  typeUnitAdminSelected = new DefaultSelect(UnitAdmin);
  goodsSelect: ISampleGood[] = [];
  constructor(
    private fb: FormBuilder,
    private bsModelRef: BsModalRef,
    private orderEntryService: orderentryService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initData();
  }

  initData(): void {
    this.dataForm = this.fb.group({
      concept: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.required],
      ], //required
      shapePay: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.required],
      ], //required
      amount: [null, [Validators.required]], //required
      numberreference: [null, [Validators.required]], //requierd
      thirdesp: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ], //required
      institutionBanking: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ], //required
      unitadministrative: [null, [Validators.required]], //required
    });
  }

  getUniAdminSelect(event: any) {}

  close() {
    this.bsModelRef.hide();
  }

  save() {
    this.alertQuestion(
      'question',
      'Confirmación',
      '¿Desea crear la orden de servicio?'
    ).then(question => {
      if (question.isConfirmed) {
        this.orderEntryService.createOrderEntry(this.dataForm.value).subscribe({
          next: async () => {
            this.bsModelRef.content.callback(true);
            this.close();
            //onst createOrderServiceGood = await this.createOrderServiceGood(response.id);
          },
        });
      }
    });
  }

  createOrderServiceGood(id: number) {
    this.goodsSelect.map(item => {});
  }
}
