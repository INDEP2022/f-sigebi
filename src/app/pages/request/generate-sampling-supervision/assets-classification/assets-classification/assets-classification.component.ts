import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IDeductiveVerification } from 'src/app/core/models/catalogs/deductive-verification.model';
import { IDeductive } from 'src/app/core/models/catalogs/deductive.model';
import { ISignatories } from 'src/app/core/models/ms-electronicfirm/signatories-model';
import { ISample } from 'src/app/core/models/ms-goodsinv/sample.model';
import { ISamplingDeductive } from 'src/app/core/models/ms-sampling-good/sampling-deductive.model';
import { DeductiveVerificationService } from 'src/app/core/services/catalogs/deductive-verification.service';
import { SamplingGoodService } from 'src/app/core/services/ms-sampling-good/sampling-good.service';
import { BasePage, TABLE_SETTINGS } from '../../../../../core/shared/base-page';
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
  allDeductives: IDeductiveVerification[] = [];
  deductivesSel: IDeductive[] = [];
  constructor(
    private modalService: BsModalService,
    private bsModalRef: BsModalRef,
    private samplingGoodService: SamplingGoodService,
    private router: Router,
    private deductiveService: DeductiveVerificationService
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
      selectMode: 'multi',
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

  getInfoSample() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.sampleId'] = `$eq:${302}`;
    this.samplingGoodService.getSample(params.getValue()).subscribe({
      next: response => {
        console.log('sampledsa', response);
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

  save() {}

  openAnnexJ() {
    this.openModal(
      AnnexJAssetsClassificationComponent,
      this.idSample,
      'annexJ-assets-classification'
    );
  }

  opemAnnexK() {
    this.openModal(AnnexKFormComponent, '', 'annexK-assets-classification');
  }

  getSearchForm(searchForm: any) {
    this.filterObject = searchForm;
  }

  openModal(component: any, idSample?: any, typeAnnex?: string): void {
    let config: ModalOptions = {
      initialState: {
        idSample: idSample,
        typeAnnex: typeAnnex,
        callback: async (next: boolean, signatureInfo: ISignatories) => {
          if (next) {
            console.log('signature', signatureInfo);
            const validateSignature = await this.checkRegSignature(
              signatureInfo
            );
          }
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

  checkRegSignature(signatureInfo: ISignatories) {}

  deductivesSelect(event: any) {
    this.deductivesSel = event.selected;
    console.log('this.deductivesSel', this.deductivesSel);
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

  goBack() {
    this.router.navigate(['/pages/siab-web/sami/consult-tasks']);
  }
}
