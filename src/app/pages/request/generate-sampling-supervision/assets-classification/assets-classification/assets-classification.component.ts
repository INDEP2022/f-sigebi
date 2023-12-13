import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
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
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DeductiveVerificationService } from 'src/app/core/services/catalogs/deductive-verification.service';
import { SamplingGoodService } from 'src/app/core/services/ms-sampling-good/sampling-good.service';
import { TaskService } from 'src/app/core/services/ms-task/task.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import Swal from 'sweetalert2';
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
  showSamplingDetail: boolean = true;
  showFilterAssets: boolean = true;
  willSave: boolean = true;
  loadingDeductives: boolean = false;
  sampleInfo: ISample;
  title: string = '';
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
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private taskService: TaskService
  ) {
    super();
    this.idSample = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.title = `Clasificación de bienes ${this.idSample}`;
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
    params.getValue()['filter.sampleId'] = `$eq:${this.idSample}`;
    this.samplingGoodService.getSample(params.getValue()).subscribe({
      next: response => {
        this.sampleInfo = response.data[0];
      },
    });
  }

  async turnSampling() {
    const goodsSample: any = await this.getGoodsSample();

    const stateGood = goodsSample.filter(item => {
      if (!item.goodState) return item;
    });

    if (stateGood.length == 0) {
      if (this.sampleInfo.contentId) {
        if (this.sampleInfo.contentIdK) {
          const updateStatusSample: any = await this.updateStatusSample();
          if (updateStatusSample) {
            this.alertQuestion(
              'question',
              'Confirmación',
              '¿Desea turnar el muestreo?'
            ).then(async question => {
              if (question.isConfirmed) {
                const user: any = this.authService.decodeToken();
                const _task = JSON.parse(localStorage.getItem('Task'));
                let body: any = {};

                body['idTask'] = _task.id;
                body['userProcess'] = user.username;
                body['type'] = 'MUESTREO_BIENES';
                body['subtype'] = 'Clasificar_bienes';
                body['ssubtype'] = 'FIRMAR';

                let task: any = {};
                task['id'] = 0;
                task['assignees'] = user.username;
                task['assigneesDisplayname'] = user.username;
                task['creator'] = user.username;
                task['reviewers'] = user.username;

                task['idSampling'] = this.idSample;
                task[
                  'title'
                ] = `Muestreo Bienes: Clasificación de Bienes (Firma Anexos) ${this.idSample}`;
                task['idDelegationRegional'] =
                  this.sampleInfo.regionalDelegationId;
                task['idTransferee'] = this.sampleInfo.transfereeId;
                task['processName'] = 'Clasificar_bienes';
                task['urlNb'] =
                  'pages/request/assets-clasification/sign-annexes';
                body['task'] = task;

                const taskResult: any = await this.createTaskOrderService(body);
                this.loading = false;
                if (taskResult || taskResult == false) {
                  this.msgGuardado(
                    'success',
                    'Creación de Tarea Correcta',
                    `Muestreo Bienes: Clasificación de Bienes (Firma Anexos) ${this.idSample}`
                  );
                }
              }
            });
          }
        } else {
          this.alert(
            'warning',
            'Acción Invalida',
            'Es necesario generar el Anexo K'
          );
        }
      } else {
        this.alert(
          'warning',
          'Acción Invalida',
          'Es necesario generar el Anexo J'
        );
      }
    } else {
      this.alert(
        'warning',
        'Acción Invalida',
        'Debe clasificar todos los bienes que no cumplieron con el resultado de evaluación'
      );
    }
  }

  createTaskOrderService(body: any) {
    return new Promise((resolve, reject) => {
      this.taskService.createTaskWitOrderService(body).subscribe({
        next: resp => {
          resolve(true);
        },
        error: error => {
          resolve(false);
        },
      });
    });
  }

  msgGuardado(icon: any, title: string, message: string) {
    Swal.fire({
      title: title,
      html: message,
      icon: icon,
      showCancelButton: false,
      confirmButtonColor: '#9D2449',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
    }).then(result => {
      if (result.isConfirmed) {
        this.router.navigate(['/pages/siab-web/sami/consult-tasks']);
      }
    });
  }

  updateStatusSample() {
    return new Promise((resolve, reject) => {
      const sample: ISample = {
        sampleId: this.idSample,
        sampleStatus: 'FALTANTES',
      };

      this.samplingGoodService.updateSample(sample).subscribe({
        next: () => {
          resolve(true);
        },
        error: () => {},
      });
    });
  }

  getGoodsSample() {
    return new Promise((resolve, reject) => {
      const params = new BehaviorSubject<ListParams>(new ListParams());
      params.getValue()['filter.sampleId'] = this.idSample;
      params.getValue()['filter.evaluationResult'] = 'NO CUMPLE';
      this.samplingGoodService.getSamplingGoods(params.getValue()).subscribe({
        next: response => {
          resolve(response.data);
        },
        error: () => {},
      });
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

  async openAnnexJ() {
    const goodsSample: any = await this.getGoodsSample();

    const stateGood = goodsSample.filter(item => {
      if (!item.goodState) return item;
    });

    if (stateGood.length == 0) {
      this.openModal(
        AnnexJAssetsClassificationComponent,
        this.idSample,
        'annexJ-assets-classification'
      );
    } else {
      this.alert(
        'warning',
        'Acción Invalida',
        'Debe clasificar todos los bienes que no cumplieron con el resultado de evaluación'
      );
    }
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

  async opemAnnexK() {
    const deductivesSample = await this.checkSampleDeductives();

    if (deductivesSample) {
      let config: ModalOptions = {
        initialState: {
          idSample: this.idSample,
          typeAnnex: 'annex-assets-classification',
          callback: async (typeDocument: number, typeSign: string) => {
            if (typeDocument && typeSign) {
              this.showReportInfo(
                typeDocument,
                typeSign,
                'annex-assets-classification'
              );
            }
          },
        },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      };
      this.bsModalRef = this.modalService.show(AnnexKFormComponent, config);
    } else {
      this.alert(
        'warning',
        'Acción Invalida',
        'Para generar el Anexo K es necesario seleccionar alguna deductiva'
      );
    }
  }

  checkSampleDeductives() {
    return new Promise((resolve, reject) => {
      this.params.getValue()['filter.sampleId'] = `$eq:${this.idSample}`;
      this.samplingGoodService
        .getAllSampleDeductives(this.params.getValue())
        .subscribe({
          next: () => {
            resolve(true);
          },
          error: () => {
            resolve(false);
          },
        });
    });
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
              this.showReportInfo(typeDocument, typeSign, typeAnnex);
            }
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(component, config);
  }

  showReportInfo(typeDocument: number, typeSign: string, typeAnnex: string) {
    const idTypeDoc = typeDocument;
    const idSample = this.idSample;
    const typeFirm = typeSign;
    //Modal que genera el reporte
    let config: ModalOptions = {
      initialState: {
        idTypeDoc,
        idSample,
        typeFirm,
        typeAnnex,
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
