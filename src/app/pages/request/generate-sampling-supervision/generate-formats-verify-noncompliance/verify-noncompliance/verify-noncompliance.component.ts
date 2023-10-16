import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable, takeUntil } from 'rxjs';
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
  title: string = `Verificación Incumplimiento ${302}`;
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
    private router: Router
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
    this.idSample = 302;
    //El id de el muestreo se obtendra de la tarea
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
    params.getValue()['filter.sampleId'] = `$eq:${302}`;
    this.samplingGoodService.getSample(params.getValue()).subscribe({
      next: response => {
        console.log('response muestreo', response);
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
    this.openModal(AnnexJFormComponent, '', 'annexJ-verify-noncompliance');
  }

  opemAnnexK(): void {
    this.openModal(AnnexKFormComponent, '', 'annexK-verify-noncompliance');
  }

  save() {
    this.willSave = true;

    this.listItems$ = this.store.select(selectListItems);

    this.listItems$.subscribe(data => {
      console.log(data);
    });
  }

  turnSampling() {
    this.isEnableAnex = true;

    this.alertQuestion(
      undefined,
      'Confirmación',
      '¿Está seguro que la informacion es correcta para turnar?',
      'Aceptar'
    ).then(question => {
      if (question.isConfirmed) {
        console.log('enviar mensaje');
      }
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
        callback: (next: boolean) => {
          //if (next){ this.getData();}
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(component, config);

    //this.bsModalRef.content.event.subscribe((res: any) => {
    //cargarlos en el formulario
    //console.log(res);
    //this.assetsForm.controls['address'].get('longitud').enable();
    //this.requestForm.get('receiUser').patchValue(res.user);
    //});
  }

  goBack() {
    this.router.navigate(['/pages/siab-web/sami/consult-tasks']);
  }
}
