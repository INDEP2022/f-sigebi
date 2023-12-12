import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IDeductiveVerification } from 'src/app/core/models/catalogs/deductive-verification.model';
import { ISample } from 'src/app/core/models/ms-goodsinv/sample.model';
import { ISamplingDeductive } from 'src/app/core/models/ms-sampling-good/sampling-deductive.model';
import { DeductiveVerificationService } from 'src/app/core/services/catalogs/deductive-verification.service';
import { SamplingGoodService } from 'src/app/core/services/ms-sampling-good/sampling-good.service';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { AppState } from '../../../../../app.reducers';
import { ModelForm } from '../../../../../core/interfaces/model-form';
import { BasePage, TABLE_SETTINGS } from '../../../../../core/shared/base-page';
import { ShowReportComponentComponent } from '../../../programming-request-components/execute-reception/show-report-component/show-report-component.component';
import { UploadReportReceiptComponent } from '../../../programming-request-components/execute-reception/upload-report-receipt/upload-report-receipt.component';
import { LIST_DEDUCTIVES_COLUMNS } from '../../sampling-assets/sampling-assets-form/columns/list-deductivas-column';
import { AnnexJFormComponent } from '../annex-j-form/annex-j-form.component';
import { AnnexKFormComponent } from '../annex-k-form/annex-k-form.component';
import { selectListItems } from '../store/item.selectors';

@Component({
  selector: 'app-verify-noncompliance',
  templateUrl: './verify-noncompliance.component.html',
  styleUrls: ['./verify-noncompliance.component.scss'],
})
export class VerifyNoncomplianceComponent extends BasePage implements OnInit {
  title: string = `Verificación Incumplimiento ${326}`;
  showSamplingDetail: boolean = true;
  showFilterAssets: boolean = true;
  filterForm: ModelForm<any>;
  sampleInfo: ISample;
  isEnableAnex: boolean = false;
  willSave: boolean = false;
  paragraphsDeductivas = new LocalDataSource();
  //envia los datos para mostrarse en el detalle de anexo
  annexDetail: any[] = [];
  filterObject: any;
  clasificationAnnex: boolean = true;
  loadingDeductives: boolean = false;
  listItems$: Observable<any> = new Observable();
  idSample: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  allDeductives: IDeductiveVerification[] = [];
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private bsModalRef: BsModalRef,
    private store: Store<AppState>,
    private samplingGoodService: SamplingGoodService,
    private deductiveService: DeductiveVerificationService,
    private router: Router,
    private samplingService: SamplingGoodService
  ) {
    super();
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: '',
      columns: LIST_DEDUCTIVES_COLUMNS,
    };
  }

  ngOnInit(): void {
    //El id de el muestreo se obtendra de la tarea
    this.idSample = 326;
    this.getSampleInfo();
    this.initFilterForm();
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
        this.allDeductives = response.data;
      },
      error: error => {},
    });
  }

  getSampleInfo() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.sampleId'] = `$eq:${326}`;
    this.samplingGoodService.getSample(params.getValue()).subscribe({
      next: response => {
        this.sampleInfo = response.data[0];
      },
      error: () => {},
    });
  }

  initFilterForm() {
    this.filterForm = this.fb.group({
      noManagement: [null],
      noInventory: [null],
      descriptionAsset: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  openAnnexJ(): void {
    this.alertQuestion(
      'question',
      'Confirmación',
      'Desea generar el reporte J?'
    ).then(async question => {
      if (question.isConfirmed) {
        const getAllGoodNoCum: any = await this.getSampleGoods();
        const filterGoods = getAllGoodNoCum.filter(item => {
          if (item.goodState == null) return item;
        });
        if (filterGoods.length == 0) {
          this.openModal(
            AnnexJFormComponent,
            '',
            'annexJ-verify-noncompliance'
          );
        } else {
          this.alert(
            'warning',
            'Acción Invalida',
            'Debe clasificar al menos un bien que no cumplio con los resultados de evaluación'
          );
        }
      }
    });
  }

  opemAnnexK(): void {
    this.openModal(AnnexKFormComponent, '', 'annexK-verify-noncompliance');
  }

  save() {
    this.willSave = true;

    this.listItems$ = this.store.select(selectListItems);

    this.listItems$.subscribe(data => {});
  }

  async turnSampling() {
    const getAllGoodNoCum: any = await this.getSampleGoods();

    const filterGoods = getAllGoodNoCum.filter(item => {
      if (item.goodState == null) return item;
    });

    if (filterGoods.length == 0) {
      if (!this.sampleInfo.contentId) {
        this.router.navigate(['pages/request/assets-clasification']);
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
    /*
    this.isEnableAnex = true;
    this.alertQuestion(
      undefined,
      'Confirmación',
      '¿Está seguro que la informacion es correcta para turnar?',
      'Aceptar'
    ).then(question => {
      if (question.isConfirmed) {
        this.router.navigate(['pages/request/assets-clasification']);
      }
    }); */
  }

  getSampleGoods() {
    return new Promise((resolve, reject) => {
      const params = new BehaviorSubject<ListParams>(new ListParams());
      params.getValue()['filter.evaluationResult'] = 'NO CUMPLE';
      params.getValue()['filter.sampleId'] = this.idSample;
      this.samplingService.getSamplingGoods(params.getValue()).subscribe({
        next: response => {
          resolve(response.data);
        },
        error: () => {
          resolve(false);
        },
      });
    });
  }

  searchGoods() {
    this.filterObject = this.filterForm.value;
  }

  openModal(component: any, data?: any, typeAnnex?: string): void {
    let config: ModalOptions = {
      initialState: {
        data: data,
        typeAnnex: typeAnnex,
        callback: (typeDocument: number, typeSign: string) => {
          if (typeDocument && typeSign) {
            this.showReportInfo(typeDocument, typeSign, typeAnnex);
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
              this.getSampleInfo();
            }
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ShowReportComponentComponent, config);
  }

  uploadDocument() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
    config.initialState = {
      typeDoc: 218,
      idSample: this.idSample,
      callback: (data: boolean) => {
        if (data) {
          this.getSampleInfo();
        }
      },
    };

    this.modalService.show(UploadReportReceiptComponent, config);
  }

  goBack() {
    this.router.navigate(['/pages/siab-web/sami/consult-tasks']);
  }
}
