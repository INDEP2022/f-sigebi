import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ISample } from 'src/app/core/models/ms-goodsinv/sample.model';
import { SamplingGoodService } from 'src/app/core/services/ms-sampling-good/sampling-good.service';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ModelForm } from '../../../../../core/interfaces/model-form';

@Component({
  selector: 'app-annex-j-assets-classification',
  templateUrl: './annex-j-assets-classification.component.html',
  styles: [],
})
export class AnnexJAssetsClassificationComponent
  extends BasePage
  implements OnInit
{
  signForm: ModelForm<any>;
  typeAnnex: string = '';
  minDate = new Date();
  idSample: number = 0;
  constructor(
    private fb: FormBuilder,
    private bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private samplingGoodService: SamplingGoodService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.signForm = this.fb.group({
      nameSignatore: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.required],
      ],
      chargeSignatore: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.required],
      ],
      thirdSpecialized: [null, [Validators.pattern(STRING_PATTERN)]],
      relevantFacts: [null, [Validators.pattern(STRING_PATTERN)]],
      dateRepServices: [null, [Validators.pattern(STRING_PATTERN)]],
      dateBreak: [null, [Validators.pattern(STRING_PATTERN)]],
      //tipeSign: [null],
    });
  }

  signAnnex(): void {
    this.alertQuestion(
      'question',
      'Confirmación',
      '¿Desea guardar la información del anexo J?'
    ).then(question => {
      if (question.isConfirmed) {
        this.loading = true;
        const sampleInfo: ISample = {
          sampleId: this.idSample,
          thirdSpecialized: this.signForm.get('thirdSpecialized').value,
          relevantFacts: this.signForm.get('relevantFacts').value,
          dateRepServices: this.signForm.get('dateRepServices').value,
          dateBreak: this.signForm.get('dateBreak').value,
        };

        this.loading = false;
        this.bsModalRef.content.callback(true, this.signForm.value);
        this.close();
        /*this.samplingGoodService.updateSample(sampleInfo).subscribe({
          next: response => {
            console.log('Se actualizo el sample', response);
            this.alert(
              'success',
              'Correcto',
              'Información anexo J guardada correctamente'
            );
            this.loading = false;
            this.bsModalRef.content(true, this.signForm.value);
            this.close();
          },
          error: error => {
            console.log('errror', error);
            this.alert(
              'error',
              'Error',
              'Error al guardar la información para el anexo J'
            );
            this.loading = false;
          },
        }); */
      }
    });
  }

  close(): void {
    this.bsModalRef.hide();
  }
}
