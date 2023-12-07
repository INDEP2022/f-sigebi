import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ISignatories } from 'src/app/core/models/ms-electronicfirm/signatories-model';
import { ISample } from 'src/app/core/models/ms-goodsinv/sample.model';
import { SignatoriesService } from 'src/app/core/services/ms-electronicfirm/signatories.service';
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
  form: FormGroup = new FormGroup({});
  typeAnnex: string = '';
  minDate = new Date();
  checked: string = 'checked';
  idSample: number = 0;
  sampleInfo: ISample;
  constructor(
    private fb: FormBuilder,
    private bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private samplingGoodService: SamplingGoodService,
    private signatoriesService: SignatoriesService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
    this.getInfoSample();
  }

  getInfoSample() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.sampleId'] = `$eq:${this.idSample}`;
    this.samplingGoodService.getSample(params.getValue()).subscribe({
      next: response => {
        this.sampleInfo = response.data[0];

        //this.form.patchValue(this.sampleInfo);

        /*if (response.data[0].responsibleTe)
          this.signForm.get('name').setValue(response.data[0].responsibleTe);
        if (response.data[0].tePosition)
          this.signForm.get('inCharge').setValue(response.data[0].tePosition);
        if (response.data[0].teTypeSignature)
          this.signForm
            .get('tipeSign')
            .setValue(response.data[0].teTypeSignature); */

        if (this.sampleInfo.dateBreak)
          this.form
            .get('dateBreak')
            .setValue(moment(this.sampleInfo.dateBreak).format('DD/MM/YYYY'));
        if (this.sampleInfo.dateRepServices)
          this.form
            .get('dateRepServices')
            .setValue(
              moment(this.sampleInfo.dateRepServices).format('DD/MM/YYYY')
            );

        if (this.sampleInfo.responsibleSae)
          this.form
            .get('responsibleSae')
            .setValue(this.sampleInfo.responsibleSae);

        if (this.sampleInfo.saePosition)
          this.form.get('saePosition').setValue(this.sampleInfo.saePosition);

        if (this.sampleInfo.thirdSpecialized)
          this.form
            .get('thirdSpecialized')
            .setValue(this.sampleInfo.thirdSpecialized);

        if (this.sampleInfo.relevantFacts)
          this.form
            .get('relevantFacts')
            .setValue(this.sampleInfo.relevantFacts);
      },
    });
  }

  initForm(): void {
    this.signForm = this.fb.group({
      name: [null, [Validators.pattern(STRING_PATTERN), Validators.required]],
      inCharge: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.required],
      ],
      tipeSign: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });

    this.form = this.fb.group({
      responsibleSae: [
        null,
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      saePosition: [
        null,
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      saeTypeSignature: ['Y'],
      thirdSpecialized: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      relevantFacts: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      dateBreak: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      dateRepServices: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
    });
  }

  async signAnnexJ() {
    const typeDocument = 218;
    if (this.typeAnnex == 'annexJ-assets-classification') {
      const responsibleSae = this.form.get('responsibleSae').value;
      const saePosition = this.form.get('saePosition').value;
      const typeSign = 'electronica';
      const registerInfoSample = await this.checkInfoRegSamClas();

      if (registerInfoSample) {
        const checkSignature = await this.checkSignatureInfo(
          responsibleSae,
          saePosition,
          typeDocument
        );

        if (checkSignature) {
          this.alert(
            'success',
            'Acción Correcta',
            'Firmante agregado correctamente'
          );
          this.bsModalRef.content.callback(typeDocument, typeSign);
          this.close();
        }
      }
    }

    /*
    const typeDocument = 218;
    const name = this.signForm.get('name').value;
    const charge = this.signForm.get('inCharge').value;
    const typeSign = this.signForm.get('tipeSign').value;
    if (typeSign == 'electronica') {
      const registerInfoSample = await this.checkInfoRegisterSample(
        name,
        charge,
        typeSign
      );
      if (registerInfoSample) {
        const checkSignature = await this.checkSignatureInfo(
          name,
          charge,
          typeDocument
        );

        if (checkSignature) {
          this.alert(
            'success',
            'Acción Correcta',
            'Firmante agregado correctamente'
          );
          this.bsModalRef.content.callback(typeDocument, typeSign);
          this.close();
        }
      }
    } else if (typeSign == 'autografa') {
      const registerInfoSample = await this.checkInfoRegisterSample(
        name,
        charge,
        typeSign
      );

      if (registerInfoSample) {
        this.alert(
          'success',
          'Acción Correcta',
          'Información registrada correctamente'
        );
        this.bsModalRef.content.callback(typeDocument, typeSign);
        this.close();
      }
    } */
  }

  checkInfoRegSamClas() {
    return new Promise((resolve, reject) => {
      const sampleData: ISample = {
        sampleId: this.idSample,
        responsibleSae: this.form.get('responsibleSae').value,
        saePosition: this.form.get('saePosition').value,
        saeTypeSignature: this.form.get('saeTypeSignature').value,
        thirdSpecialized: this.form.get('thirdSpecialized').value,
        relevantFacts: this.form.get('relevantFacts').value,
        dateBreak: this.form.get('dateBreak').value,
        dateRepServices: this.form.get('dateRepServices').value,
      };

      this.samplingGoodService.updateSample(sampleData).subscribe({
        next: () => {
          resolve(true);
        },
      });
    });
  }

  /*checkInfoRegisterSample(name: string, charge: string, typeSign: string) {
    return new Promise((resolve, reject) => {
      const sampleData: ISample = {
        sampleId: this.idSample,
        responsibleTe: name,
        tePosition: charge,
        teTypeSignature: typeSign,
      };

      this.samplingGoodService.updateSample(sampleData).subscribe({
        next: () => {
          resolve(true);
        },
      });
    });
  } */

  checkSignatureInfo(name: string, charge: string, typeDocument: number) {
    return new Promise((resolve, reject) => {
      const learnedType = typeDocument;
      const learnedId = this.idSample;
      this.signatoriesService
        .getSignatoriesFilter(learnedType, learnedId)
        .subscribe({
          next: response => {
            const deleteSignatures = this.deleteSignatores(response.data);
            if (deleteSignatures) {
              const formData: Object = {
                learnedId: learnedId,
                learnedType: typeDocument,
                boardSignatory: 'MUESTREO',
                columnSignatory: 'FIRMA_ELECTRONICA_TE',
                name: name,
                post: charge,
              };

              this.signatoriesService.create(formData).subscribe({
                next: () => {
                  resolve(true);
                },
              });
            }
          },
          error: () => {
            const formData: Object = {
              learnedId: learnedId,
              learnedType: typeDocument,
              boardSignatory: 'MUESTREO',
              columnSignatory: 'FIRMA_ELECTRONICA_TE',
              name: name,
              post: charge,
            };

            this.signatoriesService.create(formData).subscribe({
              next: () => {
                resolve(true);
              },
            });
          },
        });
    });
  }

  deleteSignatores(signatures: ISignatories[]) {
    return new Promise((resolve, reject) => {
      signatures.map(item => {
        this.signatoriesService
          .deleteFirmante(Number(item.signatoryId))
          .subscribe({
            next: () => {
              resolve(true);
            },
            error: error => {},
          });
      });
    });
  }

  close(): void {
    this.bsModalRef.hide();
  }
}
