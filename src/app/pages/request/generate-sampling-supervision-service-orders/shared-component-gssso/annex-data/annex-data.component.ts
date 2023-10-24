import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { OrderServiceService } from 'src/app/core/services/ms-order-service/order-service.service';
import { BasePage } from 'src/app/core/shared';
import { ModelForm } from '../../../../../core/interfaces/model-form';

@Component({
  selector: 'app-annex-data',
  templateUrl: './annex-data.component.html',
  styles: [],
})
export class AnnexDataComponent extends BasePage implements OnInit {
  @Input() dataAnnex: any;
  @Input() sampleOrderForm: ModelForm<any>;
  @Input() SampleOrderId: number = null;
  @Input() typeComponent: string = null;
  readonly: boolean = false;

  private orderService = inject(OrderServiceService);

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    //this.initForm();
    if (this.typeComponent != 'generate-query') {
      this.readonly = true;
    }

    this.getSampleOrder();
  }

  initForm() {
    /* this.sampleOrderForm = this.fb.group({
      factsrelevant: [null, [Validators.pattern(STRING_PATTERN)]],
      downloadbreaches: [null, [Validators.pattern(STRING_PATTERN)]],
      datebreaches: [null],
      agreements: [null, [Validators.pattern(STRING_PATTERN)]],
      daterepService: [null],
      nameManagersoul: [null, [Validators.pattern(STRING_PATTERN)]],
    }); */
  }

  getSampleOrder() {
    const params = new ListParams();
    params['filter.idSamplingOrder'] = `$eq:${this.SampleOrderId}`;
    this.orderService.getAllSampleOrder(params).subscribe({
      next: resp => {
        this.sampleOrderForm.patchValue(resp.data[0]);

        if (resp.data[0].datebreaches != null) {
          this.sampleOrderForm
            .get('datebreaches')
            .setValue(this.parseDateNoOffset(resp.data[0].datebreaches));
        }
        if (resp.data[0].daterepService != null) {
          this.sampleOrderForm
            .get('daterepService')
            .setValue(this.parseDateNoOffset(resp.data[0].daterepService));
        }
      },
    });
  }

  save() {
    if (this.SampleOrderId == null) {
      this.onLoadToast('error', 'No tiene el Id de la orden de muestreo');
      return;
    }
    const form = this.sampleOrderForm.getRawValue();
    form.datebreaches = moment(form.datebreaches).format('YYYY-MM-DD');
    form.daterepService = moment(form.daterepService).format('YYYY-MM-DD');
    form.idSamplingOrder = this.SampleOrderId;

    this.orderService.updateSampleOrder(form).subscribe({
      next: resp => {
        this.onLoadToast('success', 'Se guardaron los cambios');
      },
      error: error => {
        this.onLoadToast('error', 'No se pudo guardar el formulario');
      },
    });
  }

  parseDateNoOffset(date: string | Date): Date {
    const dateLocal = new Date(date);
    return new Date(
      dateLocal.valueOf() + dateLocal.getTimezoneOffset() * 60 * 1000
    );
  }
}
