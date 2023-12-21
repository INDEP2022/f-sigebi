import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ISample } from 'src/app/core/models/ms-goodsinv/sample.model';
import { ISamplingDeductive } from 'src/app/core/models/ms-sampling-good/sampling-deductive.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DeductiveVerificationService } from 'src/app/core/services/catalogs/deductive-verification.service';
import { SamplingGoodService } from 'src/app/core/services/ms-sampling-good/sampling-good.service';
import { TaskService } from 'src/app/core/services/ms-task/task.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { BasePage, TABLE_SETTINGS } from 'src/app/core/shared';
import Swal from 'sweetalert2';
import { ShowReportComponentComponent } from '../../../programming-request-components/execute-reception/show-report-component/show-report-component.component';
import { UploadReportReceiptComponent } from '../../../programming-request-components/execute-reception/upload-report-receipt/upload-report-receipt.component';
import { AnnexKFormComponent } from '../../generate-formats-verify-noncompliance/annex-k-form/annex-k-form.component';
import { LIST_DEDUCTIVES_VIEW_COLUMNS } from '../../sampling-assets/sampling-assets-form/columns/list-deductivas-column';
import { AnnexJAssetsClassificationComponent } from '../annex-j-assets-classification/annex-j-assets-classification.component';

@Component({
  selector: 'app-classification-annexed-sign',
  templateUrl: './classification-annexed-sign.component.html',
  styles: [],
})
export class ClassificationAnnexedSignComponent
  extends BasePage
  implements OnInit
{
  sampleInfo: ISample;
  showSamplingDetail: boolean = true;
  showFilterAssets: boolean = true;
  filterObject: any;
  willSave: boolean = true;
  loadingDeductives: boolean = true;
  paragraphsDeductivas = new LocalDataSource();
  allDeductives: ISamplingDeductive[] = [];
  idSample: number = 0;
  title: string = '';
  disabledButton: boolean = false;
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor(
    private samplingGoodService: SamplingGoodService,
    private deductiveService: DeductiveVerificationService,
    private modalService: BsModalService,
    private wcontentService: WContentService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private taskService: TaskService
  ) {
    super();
    this.idSample = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.title = `Clasificación de bienes (Firma Anexos) ${this.idSample}`;
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,

      columns: LIST_DEDUCTIVES_VIEW_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.getInfoSample();
    this.getSampleDeductives();
    this.checkStatusTask();
  }

  checkStatusTask() {
    const _task = JSON.parse(localStorage.getItem('Task'));
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.id'] = `$eq:${_task.id}`;
    this.taskService.getAll(params.getValue()).subscribe({
      next: response => {
        if (response.data[0].State == 'FINALIZADA') this.disabledButton = true;
      },
      error: () => ({}),
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
        this.loadingDeductives = false;
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

  turnSampling() {
    if (this.sampleInfo.contentTeId && this.sampleInfo.contentKSaeId) {
      this.alertQuestion(
        'question',
        'Confirmación',
        '¿Desea turnar el muestreo?'
      ).then(async question => {
        if (question.isConfirmed) {
          const updateStatusSample: any = await this.updateStatusSample();
          if (updateStatusSample) {
            const user: any = this.authService.decodeToken();
            const _task = JSON.parse(localStorage.getItem('Task'));
            let body: any = {};

            body['idTask'] = _task.id;
            body['userProcess'] = user.username;
            body['type'] = 'MUESTREO_BIENES';
            body['subtype'] = 'Firmar_resultados';
            body['ssubtype'] = 'VERIFICAR';

            let task: any = {};
            task['id'] = 0;
            task['assignees'] = user.username;
            task['assigneesDisplayname'] = user.username;
            task['creator'] = user.username;
            task['reviewers'] = user.username;

            task['idSampling'] = this.idSample;
            task[
              'title'
            ] = `Muestreo Bienes: Verificación de bienes en almacén ${this.idSample}`;
            task['idDelegationRegional'] = this.sampleInfo.regionalDelegationId;
            task['idTransferee'] = this.sampleInfo.transfereeId;
            task['processName'] = 'Verificacion_bienes';
            task['urlNb'] = 'pages/request/warehouse-verification';
            body['task'] = task;

            const taskResult: any = await this.createTaskOrderService(body);
            this.loading = false;
            if (taskResult || taskResult == false) {
              this.msgGuardado(
                'success',
                'Creación de Tarea Correcta',
                `Muestreo Bienes: Verificacion de bienes en almacén ${this.idSample}`
              );
            }
          }
        }
      });
    } else {
      this.alert(
        'warning',
        'Acción Invalida',
        'Debe firmar los Anexos J y K del muestreo'
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

  openAnnexJ() {
    this.openModal(
      AnnexJAssetsClassificationComponent,
      this.idSample,
      'sign-annexJ-assets-classification'
    );
  }

  openModal(component: any, idSample?: any, typeAnnex?: string): void {
    let config: ModalOptions = {
      initialState: {
        idSample: idSample,
        typeAnnex: typeAnnex,
        callback: async (typeDocument: number, typeSign: string) => {
          if (typeAnnex == 'sign-annexJ-assets-classification') {
            if (typeDocument && typeSign) {
              this.showReportInfo(typeDocument, typeSign, typeAnnex);
            }
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(component, config);
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
              this.uploadDocument(typeDocument);
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

  uploadDocument(typeDocument: number) {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
    config.initialState = {
      typeDoc: typeDocument,
      idSample: this.idSample,
      callback: (data: boolean) => {
        if (data) {
          this.getInfoSample();
        }
      },
    };

    this.modalService.show(UploadReportReceiptComponent, config);
  }

  showAnnexJ() {
    this.wcontentService.obtainFile(this.sampleInfo.contentTeId).subscribe({
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

  openAnnexK() {
    let config: ModalOptions = {
      initialState: {
        idSample: this.idSample,
        typeAnnex: 'sign-annex-assets-classification',
        callback: async (typeDocument: number, typeSign: string) => {
          if (typeDocument && typeSign) {
            this.showReportInfo(
              typeDocument,
              typeSign,
              'sign-annex-assets-classification'
            );
            //this.showReportInfo(
            //typeDocument,
            //typeSign,
            //'sign-annex-assets-classification'
            //);
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(AnnexKFormComponent, config);
  }
  showAnnexK() {
    this.wcontentService.obtainFile(this.sampleInfo.contentKSaeId).subscribe({
      next: response => {
        let blob = this.dataURItoBlob(response);
        let file = new Blob([blob], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        this.openPrevPdf(fileURL);
      },
      error: error => {},
    });
  }

  getSearchForm(searchForm: any) {
    this.filterObject = searchForm;
  }

  updateStatusSample() {
    return new Promise((resolve, reject) => {
      const sample: ISample = {
        sampleId: this.idSample,
        sampleStatus: 'VERIFICACION BIENES',
      };

      this.samplingGoodService.updateSample(sample).subscribe({
        next: () => {
          resolve(true);
        },
        error: () => {},
      });
    });
  }
}
