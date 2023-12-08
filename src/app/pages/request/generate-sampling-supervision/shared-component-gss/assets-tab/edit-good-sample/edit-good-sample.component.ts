import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ISampleGood } from 'src/app/core/models/ms-goodsinv/sampling-good-view.model';
import { SamplingGoodService } from 'src/app/core/services/ms-sampling-good/sampling-good.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { EditGood } from './edit-good';

@Component({
  selector: 'app-edit-good-sample',
  templateUrl: './edit-good-sample.component.html',
  styles: [],
})
export class EditGoodSampleComponent extends BasePage implements OnInit {
  good: ISampleGood;
  form: FormGroup = new FormGroup({});
  goodState = new DefaultSelect(EditGood);
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private samplingService: SamplingGoodService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      goodState: [null, [Validators.required]],
    });
  }

  confirm() {
    this.loading = true;
    const infoSampleGood = {
      sampleGoodId: this.good.sampleGoodId,
      goodState: this.form.get('goodState').value,
    };

    this.samplingService.editSamplingGood(infoSampleGood).subscribe({
      next: () => {
        this.alert('success', 'Correcto', 'Bien actualizado correctamente');
        this.loading = false;
        this.modalRef.content.callback(true);
        this.close();
      },
      error: () => {
        this.alert(
          'warning',
          'Acción Invalida',
          'No se pudo actualizar el bien'
        );
        this.loading = false;
      },
    });
  }

  close() {
    this.modalRef.hide();
  }
}
