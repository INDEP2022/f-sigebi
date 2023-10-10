import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ISampleGood } from 'src/app/core/models/ms-goodsinv/sampling-good-view.model';
import { SamplingGoodService } from 'src/app/core/services/ms-sampling-good/sampling-good.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ResultEvaluationData } from './result-evaluation-data';

@Component({
  selector: 'app-edit-sample-good',
  templateUrl: './edit-sample-good.component.html',
  styles: [],
})
export class EditSampleGoodComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  EvaluationResultData = new DefaultSelect(ResultEvaluationData);
  sampleGood: ISampleGood;
  constructor(
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private sampleGoodService: SamplingGoodService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      evaluationResult: [null, [Validators.required]],
    });
  }

  confirm() {
    this.loading = true;
    const sampleGood: ISampleGood = {
      sampleGoodId: this.sampleGood.sampleGoodId,
      sampleId: this.sampleGood.sampleId,
      evaluationResult: this.form.get('evaluationResult').value,
    };
    this.sampleGoodService.editSamplingGood(sampleGood).subscribe({
      next: response => {
        this.loading = false;
        this.alert(
          'success',
          'Acción Correcta',
          'Resultado de evaluación actualizado correctamente'
        );
        this.modalRef.content.callback(true);
        this.close();
      },
      error: error => {
        this.alert(
          'error',
          'Error',
          'Error al actualizar el resultado de evaluación'
        );
        this.loading = false;
      },
    });
  }

  close() {
    this.modalRef.hide();
  }
}
