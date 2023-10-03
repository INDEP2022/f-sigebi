import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { OrderServiceService } from 'src/app/core/services/ms-order-service/order-service.service';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
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

  private orderService = inject(OrderServiceService);

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    //this.initForm();
    console.log(this.sampleOrderForm);
  }

  initForm() {
    this.sampleOrderForm = this.fb.group({
      factsrelevant: [null, [Validators.pattern(STRING_PATTERN)]],
      downloadbreaches: [null, [Validators.pattern(STRING_PATTERN)]],
      datenoncompliance: [null],
      agreements: [null, [Validators.pattern(STRING_PATTERN)]],
      daterepService: [null],
      nameManagersoul: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  save() {
    if (this.SampleOrderId == null) {
      this.onLoadToast('error', 'No tiene el Id de la orden de muestreo');
      return;
    }
    const form = this.sampleOrderForm.getRawValue();
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
}
