import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IDeductiveVerification } from 'src/app/core/models/catalogs/deductive-verification.model';
import { IDeductive } from 'src/app/core/models/catalogs/deductive.model';
import { ISample } from 'src/app/core/models/ms-goodsinv/sample.model';
import { ISamplingDeductive } from 'src/app/core/models/ms-sampling-good/sampling-deductive.model';
import { DeductiveVerificationService } from 'src/app/core/services/catalogs/deductive-verification.service';
import { SamplingGoodService } from 'src/app/core/services/ms-sampling-good/sampling-good.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { BasePage, TABLE_SETTINGS } from '../../../../../core/shared/base-page';
import { ShowReportComponentComponent } from '../../../programming-request-components/execute-reception/show-report-component/show-report-component.component';
import { UploadReportReceiptComponent } from '../../../programming-request-components/execute-reception/upload-report-receipt/upload-report-receipt.component';
import { AnnexKFormComponent } from '../../generate-formats-verify-noncompliance/annex-k-form/annex-k-form.component';
import { EditDeductiveComponent } from '../../sampling-assets/edit-deductive/edit-deductive.component';
import { LIST_DEDUCTIVES_COLUMNS } from '../../sampling-assets/sampling-assets-form/columns/list-deductivas-column';
import { AnnexJAssetsClassificationComponent } from '../annex-j-assets-classification/annex-j-assets-classification.component';

@Component({
  selector: 'app-assets-classification',
  templateUrl: './assets-classification.component.html',
  styleUrls: ['./assets-classification.component.scss'],
})
export class AssetsClassificationComponent extends BasePage implements OnInit {
  title: string = `Clasificación de bienes ${302}`;
  showSamplingDetail: boolean = true;
  showFilterAssets: boolean = true;
  willSave: boolean = true;
  loadingDeductives: boolean = false;
  sampleInfo: ISample;
  idSample: number = 0;
  filterObject: any;
  params = new BehaviorSubject<ListParams>(new ListParams());
  paragraphsDeductivas = new LocalDataSource();
  allDeductives: ISamplingDeductive[] = [];
  deductivesSel: IDeductive[] = [];
  constructor(
    private modalService: BsModalService,
    private bsModalRef: BsModalRef,
    private samplingGoodService: SamplingGoodService,
    private router: Router,
    private deductiveService: DeductiveVerificationService,
    private wcontentService: WContentService,
    private sanitizer: DomSanitizer
  ) {
    super();
    this.settings = {
      ...TABLE_SETTINGS,
      actions: {
        edit: true,
        delete: false,
        columnTitle: 'Acciones',
        position: 'right',
      },

      columns: LIST_DEDUCTIVES_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.idSample = 302;
    this.getInfoSample();
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.getSampleDeductives();
    });
  }

  getSampleDeductives() {
    this.params.getValue()['filter.sampleId'] = `$eq:${this.idSample}`;
    this.samplingGoodService
      .getAllSampleDeductives(this.params.getValue())
      .subscribe({
        next: response => {
          this.allDeductives = response.data;
          this.getDeductives(response.data);
        },
        error: error => {},
      });
  }

  getDeductives(deductivesRelSample: ISamplingDeductive[]) {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    this.deductiveService.getAll(params.getValue()).subscribe({
      next: response => {
        const infoDeductives = response.data.map(item => {
          deductivesRelSample.map(deductiveEx => {
            if (deductiveEx.deductiveVerificationId == item.id) {
              item.observations = deductiveEx.observations;
              item.selected = true;
            }
          });
          return item;
        });
        this.paragraphsDeductivas.load(infoDeductives);
      },
      error: error => {},
    });
  }

  getInfoSample() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.sampleId'] = `$eq:${302}`;
    this.samplingGoodService.getSample(params.getValue()).subscribe({
      next: response => {
        this.sampleInfo = response.data[0];
      },
    });
  }

  turnSampling() {
    let message =
      '¿Esta de acuerdo que la información es correcta para Turnar?';
    this.alertQuestion(
      undefined,
      'Confirmación turnado',
      message,
      'Aceptar'
    ).then(question => {
      if (question.isConfirmed) {
        console.log('enviar mensaje');
      }
    });
  }

  saveDeductives() {
    if (this.deductivesSel.length > 0) {
      const deleteDeductives = this.deductivesSel.filter((data: any) => {
        if (data.selected) return data;
      });

      if (deleteDeductives.length > 0) {
        const deleteVerification = deleteDeductives.map(item => {
          this.allDeductives.map(data => {
            if (item.id == data.deductiveVerificationId) {
              item.sampleDeductiveId = data.sampleDeductiveId;
            }
          });

          return item;
        });

        deleteVerification.map(item => {
          this.samplingGoodService
            .deleteSampleDeductive(item.sampleDeductiveId)
            .subscribe({
              next: () => {
                console.log('delete');
              },
            });
        });
      }

      const addDeductives = this.deductivesSel.filter((data: any) => {
        if (!data.selected) return data;
      });

      if (addDeductives.length > 0) {
        this.alertQuestion(
          'question',
          'Confirmación',
          '¿Desea guardar las deductivas seleccionadas?'
        ).then(question => {
          if (question.isConfirmed) {
            addDeductives.map((item: any, i: number) => {
              let index = i + 1;
              const sampleDeductive: ISamplingDeductive = {
                //sampleDeductiveId: '357',
                sampleId: this.idSample,
                //orderSampleId: '3',
                deductiveVerificationId: item.id,
                indDedictiva: 'N',
                version: 1,
                observations: item.observations,
              };

              this.samplingGoodService
                .createSampleDeductive(sampleDeductive)
                .subscribe({
                  next: () => {
                    if (addDeductives.length == index) {
                      this.alert(
                        'success',
                        'Acción Correcta',
                        'Deductivas agregadas correctamente'
                      );
                    }
                  },
                  error: error => {
                    if (addDeductives.length == i) {
                      this.alert(
                        'error',
                        'Error',
                        'Error al guardar la deductiva'
                      );
                    }
                  },
                });
            });
          }
        });
      }
    } else {
      this.alert(
        'warning',
        'Acción Invalida',
        'Se requiere seleccionar o deseleccionar una deductiva'
      );
    }
  }

  openAnnexJ() {
    this.openModal(
      AnnexJAssetsClassificationComponent,
      this.idSample,
      'annexJ-assets-classification'
    );
  }

  showAnnexJ() {
    this.wcontentService.obtainFile(this.sampleInfo.contentId).subscribe({
      next: response => {
        let blob = this.dataURItoBlob(response);
        let file = new Blob([blob], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        this.openPrevPdf(fileURL);
      },
      error: error => {},
    });
  }

  showAnnexK() {
    this.wcontentService.obtainFile(this.sampleInfo.contentIdK).subscribe({
      next: response => {
        let blob = this.dataURItoBlob(response);
        let file = new Blob([blob], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        this.openPrevPdf(fileURL);
      },
      error: error => {},
    });
  }

  dataURItoBlob(dataURI: any) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });
    return blob;
  }

  openPrevPdf(pdfUrl: string) {
    let config: ModalOptions = {
      initialState: {
        documento: {
          urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl),
          type: 'pdf',
        },
        callback: (data: any) => {},
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(PreviewDocumentsComponent, config);
  }

  opemAnnexK() {
    let config: ModalOptions = {
      initialState: {
        idSample: this.idSample,
        typeAnnex: 'annex-assets-classification',
        callback: async (typeDocument: number, typeSign: string) => {
          if (typeDocument && typeSign) {
            this.showReportInfo(typeDocument, typeSign);
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(AnnexKFormComponent, config);
  }

  getSearchForm(searchForm: any) {
    this.filterObject = searchForm;
  }

  openModal(component: any, idSample?: any, typeAnnex?: string): void {
    let config: ModalOptions = {
      initialState: {
        idSample: idSample,
        typeAnnex: typeAnnex,
        callback: async (typeDocument: number, typeSign: string) => {
          if (typeAnnex == 'annexJ-assets-classification') {
            if (typeDocument && typeSign) {
              this.showReportInfo(typeDocument, typeSign);
            }
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(component, config);
  }

  showReportInfo(typeDocument: number, typeSign: string) {
    const idTypeDoc = typeDocument;
    const idSample = this.idSample;
    const typeFirm = typeSign;
    //Modal que genera el reporte
    let config: ModalOptions = {
      initialState: {
        idTypeDoc,
        idSample,
        typeFirm,
        callback: (next: boolean) => {
          if (next) {
            if (typeFirm != 'electronica') {
              this.uploadDocument();
            } else {
              this.getInfoSample();
            }
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ShowReportComponentComponent, config);
  }

  deductivesSelect(event: any) {
    this.deductivesSel.push(event.selected[0]);
  }

  addDeductive(deductive: IDeductive) {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
    config.initialState = {
      deductive,
      callback: (next: boolean, deductive: IDeductiveVerification) => {
        if (next) {
          //this.paragraphsDeductivas.load([deductive]);
          const deductives = this.allDeductives.map((item: any) => {
            if (deductive.id == item.id)
              item.description = deductive.description;
            return item;
          });
          this.paragraphsDeductivas.load(deductives);
        }
      },
    };

    this.modalService.show(EditDeductiveComponent, config);
  }

  uploadDocument() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
    config.initialState = {
      typeDoc: 218,
      idSample: this.idSample,
      callback: (data: boolean) => {
        if (data) {
          this.getInfoSample();
        }
      },
    };

    this.modalService.show(UploadReportReceiptComponent, config);
  }

  goBack() {
    this.router.navigate(['/pages/siab-web/sami/consult-tasks']);
  }
}
