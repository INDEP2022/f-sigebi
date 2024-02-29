import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ISignatories } from 'src/app/core/models/ms-electronicfirm/signatories-model';
import { ISample } from 'src/app/core/models/ms-goodsinv/sample.model';
import { ISamplingOrder } from 'src/app/core/models/ms-order-service/sampling-order.model';
import { SignatoriesService } from 'src/app/core/services/ms-electronicfirm/signatories.service';
import { OrderServiceService } from 'src/app/core/services/ms-order-service/order-service.service';
import { SamplingGoodService } from 'src/app/core/services/ms-sampling-good/sampling-good.service';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ModelForm } from '../../../../../core/interfaces/model-form';
import { UploadReportReceiptComponent } from '../../../programming-request-components/execute-reception/upload-report-receipt/upload-report-receipt.component';

@Component({
  selector: 'app-annex-k-form',
  templateUrl: './annex-k-form.component.html',
  styleUrls: ['./annex-k-form.component.scss'],
})
export class AnnexKFormComponent extends BasePage implements OnInit {
  annexForm: ModelForm<any>;
  typeAnnex: string = ''; // tipo de formulario para diferenciar en la logica
  readonly: boolean = false;
  annexData: ISamplingOrder = null; // formulario del muestreo orden pasado desde el padre

  idSample: number = 0;
  idSampleOrder: number = 0;

  checked: 'checked';
  form: FormGroup = new FormGroup({});
  sampleInfo: ISample;
  date = new Date();
  constructor(
    private fb: FormBuilder,
    private bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private samplingGoodService: SamplingGoodService,
    private signatoriesService: SignatoriesService,
    private orderService: OrderServiceService
  ) {
    super();
  }

  ngOnInit(): void {
    this.readonly = true;
    this.initDetailForm();
    if (this.idSample > 0) this.getInfoSample();
    if (this.idSampleOrder) this.getInfoSampleOrder();

    //this.setDataParicipants();
  }

  getInfoSample() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.sampleId'] = `$eq:${this.idSample}`;
    this.samplingGoodService.getSample(params.getValue()).subscribe({
      next: response => {
        this.sampleInfo = response.data[0];

        this.form.patchValue(this.sampleInfo);
        this.annexForm.patchValue(this.sampleInfo);
      },
    });
  }

  getInfoSampleOrder() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.idSamplingOrder'] = `$eq:${this.idSampleOrder}`;
    this.orderService.getAllSampleOrder(params.getValue()).subscribe({
      next: response => {
        const sampleOrder = response.data[0];

        if (this.typeAnnex == 'revition-results') {
          if (sampleOrder.supplierk)
            this.annexForm
              .get('saeResponsibleK')
              .setValue(sampleOrder.supplierk);
          if (sampleOrder.postSupplierk)
            this.annexForm
              .get('positionSaeK')
              .setValue(sampleOrder.postSupplierk);
        } else if (this.typeAnnex == 'generate-query') {
          if (sampleOrder.responsiblesae)
            this.annexForm
              .get('saeResponsibleK')
              .setValue(sampleOrder.responsiblesae);
          if (sampleOrder.postsae)
            this.annexForm.get('positionSaeK').setValue(sampleOrder.postsae);
        }
        if (sampleOrder.competitor1)
          this.annexForm.get('competitorOne').setValue(sampleOrder.competitor1);
        if (sampleOrder.postCompetitor1)
          this.annexForm
            .get('positionCompetitorOne')
            .setValue(sampleOrder.postCompetitor1);
        if (sampleOrder.competitor2)
          this.annexForm.get('competitorTwo').setValue(sampleOrder.competitor2);
        if (sampleOrder.postCompetitor2)
          this.annexForm
            .get('positionCompetitorTwo')
            .setValue(sampleOrder.postCompetitor2);
        if (sampleOrder.nameManagersoul)
          this.annexForm
            .get('managerNameAlm')
            .setValue(sampleOrder.nameManagersoul);
        if (sampleOrder.factsrelevant)
          this.annexForm
            .get('relevantFacts')
            .setValue(sampleOrder.factsrelevant);
        if (sampleOrder.agreements)
          this.annexForm.get('agreements').setValue(sampleOrder.agreements);
        if (sampleOrder.daterepService) {
          this.annexForm
            .get('daterepService')
            .setValue(moment(sampleOrder.daterepService).format('DD/MM/YYYY'));
        }

        if (sampleOrder.guySignatureSupplierk) {
          this.annexForm
            .get('typeSaeSignatureK')
            .setValue(sampleOrder.guySignatureSupplierk);
        }
      },
    });
  }

  initDetailForm(): void {
    if (
      this.typeAnnex == 'generate-query' ||
      this.typeAnnex == 'revition-results'
    ) {
      this.annexForm = this.fb.group({
        idSamplingOrder: [null],
        saeResponsibleK: [
          null,
          [Validators.pattern(STRING_PATTERN), Validators.required],
        ],
        positionSaeK: [
          null,
          [Validators.pattern(STRING_PATTERN), Validators.required],
        ],
        typeSaeSignatureK: [null],
        competitorOne: [null, [Validators.pattern(STRING_PATTERN)]],
        positionCompetitorOne: [null, [Validators.pattern(STRING_PATTERN)]],
        competitorTwo: [null, [Validators.pattern(STRING_PATTERN)]],
        positionCompetitorTwo: [null, [Validators.pattern(STRING_PATTERN)]],
        managerNameAlm: [null, [Validators.pattern(STRING_PATTERN)]],
        relevantFacts: [null, [Validators.pattern(STRING_PATTERN)]],
        agreements: [null, [Validators.pattern(STRING_PATTERN)]],
        daterepService: [null, [Validators.pattern(STRING_PATTERN)]],
      });

      this.form = this.fb.group({
        providerK: [
          null,
          [
            Validators.required,
            Validators.pattern(STRING_PATTERN),
            Validators.maxLength(100),
          ],
        ],
        positionProviderK: [
          null,
          [
            Validators.required,
            Validators.pattern(STRING_PATTERN),
            Validators.maxLength(100),
          ],
        ],

        competitorOne: [null, [Validators.pattern(STRING_PATTERN)]],
        positionCompetitorOne: [null, [Validators.pattern(STRING_PATTERN)]],
        competitorTwo: [null, [Validators.pattern(STRING_PATTERN)]],
        positionCompetitorTwo: [null, [Validators.pattern(STRING_PATTERN)]],
        managerNameAlm: [null, [Validators.pattern(STRING_PATTERN)]],
        relevantFacts: [null, [Validators.pattern(STRING_PATTERN)]],
        agreements: [null, [Validators.pattern(STRING_PATTERN)]],
      });
    }

    if (this.typeAnnex == 'sign-annex-assets-classification') {
      this.annexForm = this.fb.group({
        idSamplingOrder: [null],
        saeResponsibleK: [
          null,
          [Validators.pattern(STRING_PATTERN), Validators.required],
        ],
        positionSaeK: [
          null,
          [Validators.pattern(STRING_PATTERN), Validators.required],
        ],
        typeSaeSignatureK: [null, Validators.required],
        competitorOne: [null, [Validators.pattern(STRING_PATTERN)]],
        positionCompetitorOne: [null, [Validators.pattern(STRING_PATTERN)]],
        competitorTwo: [null, [Validators.pattern(STRING_PATTERN)]],
        positionCompetitorTwo: [null, [Validators.pattern(STRING_PATTERN)]],
        managerNameAlm: [null, [Validators.pattern(STRING_PATTERN)]],
        relevantFacts: [null, [Validators.pattern(STRING_PATTERN)]],
        agreements: [null, [Validators.pattern(STRING_PATTERN)]],
        daterepService: [null, [Validators.pattern(STRING_PATTERN)]],
      });

      this.form = this.fb.group({
        providerK: [
          null,
          [
            Validators.required,
            Validators.pattern(STRING_PATTERN),
            Validators.maxLength(100),
          ],
        ],
        positionProviderK: [
          null,
          [
            Validators.required,
            Validators.pattern(STRING_PATTERN),
            Validators.maxLength(100),
          ],
        ],

        competitorOne: [null, [Validators.pattern(STRING_PATTERN)]],
        positionCompetitorOne: [null, [Validators.pattern(STRING_PATTERN)]],
        competitorTwo: [null, [Validators.pattern(STRING_PATTERN)]],
        positionCompetitorTwo: [null, [Validators.pattern(STRING_PATTERN)]],
        managerNameAlm: [null, [Validators.pattern(STRING_PATTERN)]],
        relevantFacts: [null, [Validators.pattern(STRING_PATTERN)]],
        agreements: [null, [Validators.pattern(STRING_PATTERN)]],
      });
    }
  }

  displayDetailAnnex(): boolean {
    if (
      this.typeAnnex === 'annexK-restitution-of-assets' ||
      this.typeAnnex === 'revition-results'
    ) {
      return false;
    } else {
      return true;
    }
  }

  async signAnnex() {
    const typeDocument = 219;
    if (this.typeAnnex == 'annex-assets-classification') {
      const providerK = this.form.get('providerK').value;
      const positionProviderK = this.form.get('positionProviderK').value;
      const typeSign = 'electronica';
      const registerInfoSample = await this.checkInfoRegSamClas();
      if (registerInfoSample) {
        const checkSignature = await this.checkSignatureInfo(
          providerK,
          positionProviderK,
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

    if (this.typeAnnex == 'sign-annex-assets-classification') {
      const saeResponsibleK = this.annexForm.get('saeResponsibleK').value;
      const positionSaeK = this.annexForm.get('positionSaeK').value;
      const typeSaeSignatureK = this.annexForm.get('typeSaeSignatureK').value;
      let typeFirm: string = '';
      if (typeSaeSignatureK == 'Y') typeFirm = 'electronica';
      if (typeSaeSignatureK == 'N') typeFirm = 'autografa';

      const registerInfoSample = await this.checkInfoRegSamSignClas();
      if (registerInfoSample) {
        const checkSignature = await this.checkSignatureInfo(
          saeResponsibleK,
          positionSaeK,
          typeDocument
        );

        if (checkSignature) {
          this.alert(
            'success',
            'Acción Correcta',
            'Firmante agregado correctamente'
          );
          this.bsModalRef.content.callback(typeDocument, typeFirm);
          this.close();
        }
      }
    }

    if (this.typeAnnex == 'generate-query') {
      const typeDocumentOrder = 197;
      const saeResponsibleK = this.annexForm.get('saeResponsibleK').value;
      const positionSaeK = this.annexForm.get('positionSaeK').value;
      const regOrderSample = await this.registerOrderSample();
      if (regOrderSample) {
        const checkSignature = await this.checkSignatureInfoOrderSample(
          saeResponsibleK,
          positionSaeK,
          typeDocumentOrder
        );

        if (checkSignature) {
          const typeSign = 'electronica';
          this.alert(
            'success',
            'Acción Correcta',
            'Firmante agregado correctamente'
          );
          this.bsModalRef.content.callback(typeDocumentOrder, typeSign);
          this.close();
        }
      }
    }

    if (this.typeAnnex == 'revition-results') {
      const typeDocumentOrder = 197;
      let typeFirm: string = '';
      const saeResponsibleK = this.annexForm.get('saeResponsibleK').value;
      const positionSaeK = this.annexForm.get('positionSaeK').value;
      const typeSaeSignatureK = this.annexForm.get('typeSaeSignatureK').value;
      if (typeSaeSignatureK == 'Y') typeFirm = 'electronica';
      if (typeSaeSignatureK == 'N') typeFirm = 'autografa';

      if (typeFirm == 'electronica') {
        const regOrderSample = await this.registerOrderSample();
        if (regOrderSample) {
          const checkSignature = await this.checkSignatureInfoOrderSample(
            saeResponsibleK,
            positionSaeK,
            typeDocumentOrder
          );

          if (checkSignature) {
            const typeSign = 'electronica';
            this.alert(
              'success',
              'Acción Correcta',
              'Firmante agregado correctamente'
            );
            this.bsModalRef.content.callback(typeDocumentOrder, typeSign);
            this.close();
          }
        }
      } else if (typeFirm == 'autografa') {
        const regOrderSample = await this.registerOrderSample();
        if (regOrderSample) {
          const typeSign = 'autografa';
          this.alert(
            'success',
            'Acción Correcta',
            'Información guardada correctamente'
          );
          this.bsModalRef.content.callback(typeDocumentOrder, typeSign);
          this.close();
        }
      }
    }
  }

  checkInfoRegSamClas() {
    return new Promise((resolve, reject) => {
      const sampleData: ISample = {
        sampleId: this.idSample,
        providerK: this.form.get('providerK').value,
        positionProviderK: this.form.get('positionProviderK').value,
        typeSignatureProviderK: 'Y',
        competitorOne: this.form.get('competitorOne').value,
        positionCompetitorOne: this.form.get('positionCompetitorOne').value,
        competitorTwo: this.form.get('competitorTwo').value,
        positionCompetitorTwo: this.form.get('positionCompetitorTwo').value,
        managerNameAlm: this.form.get('managerNameAlm').value,
        relevantFacts: this.form.get('relevantFacts').value,
        agreements: this.form.get('agreements').value,
      };

      this.samplingGoodService.updateSample(sampleData).subscribe({
        next: () => {
          resolve(true);
        },
      });
    });
  }

  checkInfoRegSamSignClas() {
    return new Promise((resolve, reject) => {
      const sampleData: ISample = {
        sampleId: this.idSample,
        saeResponsibleK: this.annexForm.get('saeResponsibleK').value,
        positionSaeK: this.annexForm.get('positionSaeK').value,
        typeSaeSignatureK: this.annexForm.get('typeSaeSignatureK').value,
        competitorOne: this.annexForm.get('competitorOne').value,
        positionCompetitorOne: this.annexForm.get('positionCompetitorOne')
          .value,
        competitorTwo: this.annexForm.get('competitorTwo').value,
        positionCompetitorTwo: this.annexForm.get('positionCompetitorTwo')
          .value,
        managerNameAlm: this.annexForm.get('managerNameAlm').value,
        relevantFacts: this.annexForm.get('relevantFacts').value,
        agreements: this.annexForm.get('agreements').value,
      };

      this.samplingGoodService.updateSample(sampleData).subscribe({
        next: () => {
          resolve(true);
        },
      });
    });
  }

  registerOrderSample() {
    return new Promise((resolve, reject) => {
      if (this.typeAnnex == 'generate-query') {
        const sampleOrderData: ISamplingOrder = {
          idSamplingOrder: this.idSampleOrder,
          responsiblesae: this.annexForm.get('saeResponsibleK').value,
          postsae: this.annexForm.get('positionSaeK').value,
          guySignaturesae: 'Y',
          competitor1: this.annexForm.get('competitorOne').value,
          postCompetitor1: this.annexForm.get('positionCompetitorOne').value,
          competitor2: this.annexForm.get('competitorTwo').value,
          postCompetitor2: this.annexForm.get('positionCompetitorTwo').value,
          nameManagersoul: this.annexForm.get('managerNameAlm').value,
          factsrelevant: this.annexForm.get('relevantFacts').value,
          agreements: this.annexForm.get('agreements').value,
          daterepService: moment(
            this.annexForm.get('daterepService').value
          ).toDate(),
        };

        this.orderService.updateSampleOrder(sampleOrderData).subscribe({
          next: () => {
            resolve(true);
          },
        });
      }
      if (this.typeAnnex == 'revition-results') {
        const sampleOrderData: ISamplingOrder = {
          idSamplingOrder: this.idSampleOrder,
          supplierk: this.annexForm.get('saeResponsibleK').value,
          postSupplierk: this.annexForm.get('positionSaeK').value,
          guySignatureSupplierk: this.annexForm.get('typeSaeSignatureK').value,
          competitor1: this.annexForm.get('competitorOne').value,
          postCompetitor1: this.annexForm.get('positionCompetitorOne').value,
          competitor2: this.annexForm.get('competitorTwo').value,
          postCompetitor2: this.annexForm.get('positionCompetitorTwo').value,
          nameManagersoul: this.annexForm.get('managerNameAlm').value,
          factsrelevant: this.annexForm.get('relevantFacts').value,
          agreements: this.annexForm.get('agreements').value,
          daterepService: moment(
            this.annexForm.get('daterepService').value
          ).toDate(),
        };

        this.orderService.updateSampleOrder(sampleOrderData).subscribe({
          next: () => {
            resolve(true);
          },
        });
      }
    });
  }

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

  checkSignatureInfoOrderSample(
    name: string,
    charge: string,
    typeDocument: number
  ) {
    return new Promise((resolve, reject) => {
      const learnedType = typeDocument;
      const learnedId = this.idSampleOrder;
      this.signatoriesService
        .getSignatoriesFilter(learnedType, learnedId)
        .subscribe({
          next: response => {
            const deleteSignatures = this.deleteSignatores(response.data);
            if (deleteSignatures) {
              const formData: Object = {
                learnedId: learnedId,
                learnedType: typeDocument,
                boardSignatory: 'Muestreo Ordenes',
                columnSignatory: 'FIRMA_ELECTRONICA_k',
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
              boardSignatory: 'Muestreo Ordenes',
              columnSignatory: 'FIRMA_ELECTRONICA_k',
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

  openModal(
    component: any,
    idSampleOrder: number,
    typeDoc: number,
    typesign: string,
    delegation: number
  ): void {
    let config: ModalOptions = {
      initialState: {
        idSampleOrder: idSampleOrder,
        idTypeDoc: typeDoc,
        typeFirm: typesign,
        idRegionalDelegation: delegation,
        annexk: true,
        callback: (next: boolean, typeSign: any) => {
          if (next) {
            if (typeSign == 'autografa') {
              this.openAutografoModal(this.annexData);
            }
            this.close();
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(component, config);
  }

  openAutografoModal(sampleOrder: ISamplingOrder) {
    let config: ModalOptions = {
      initialState: {
        typeDoc: 197,
        sampleOrder: sampleOrder,
        callback: (next: boolean) => {
          //if (next){ this.getData();}
        },
      },
      class: 'modalSizeXL modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(UploadReportReceiptComponent, config);
  }
}
