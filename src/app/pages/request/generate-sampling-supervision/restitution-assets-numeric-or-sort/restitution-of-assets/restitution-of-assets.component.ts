import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ISample } from 'src/app/core/models/ms-goodsinv/sample.model';
import { ISamplingDeductive } from 'src/app/core/models/ms-sampling-good/sampling-deductive.model';
import { DeductiveVerificationService } from 'src/app/core/services/catalogs/deductive-verification.service';
import { SamplingGoodService } from 'src/app/core/services/ms-sampling-good/sampling-good.service';
import { BasePage, TABLE_SETTINGS } from '../../../../../core/shared/base-page';
import { AnnexKFormComponent } from '../../generate-formats-verify-noncompliance/annex-k-form/annex-k-form.component';
import { LIST_DEDUCTIVES_VIEW_COLUMNS } from '../../sampling-assets/sampling-assets-form/columns/list-deductivas-column';
import { AnnexJRestitutionFormComponent } from '../annex-j-restitution-form/annex-j-restitution-form.component';

@Component({
  selector: 'app-restitution-of-assets',
  templateUrl: './restitution-of-assets.component.html',
  styleUrls: ['./restitution-of-assets.component.scss'],
})
export class RestitutionOfAssetsComponent extends BasePage implements OnInit {
  title: string = 'Muestreo Aleatorio de Bienes: Restitución de Bienes';
  showSamplingDetail: boolean = true;
  showFilterAssets: boolean = true;
  //datos para el detalle de anexo
  annexDetail: any[] = [];
  sampleInfo: ISample;
  bsModalRef: BsModalRef;
  idSample: number = 0;
  loadingDeductives: boolean = false;
  paragraphsDeductivas = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  allDeductives: ISamplingDeductive[] = [];
  settingsDeductives = {
    ...TABLE_SETTINGS,
    actions: false,

    columns: LIST_DEDUCTIVES_VIEW_COLUMNS,
  };
  constructor(
    private modalService: BsModalService,
    private samplingGoodService: SamplingGoodService,
    private deductiveService: DeductiveVerificationService
  ) {
    super();
  }

  ngOnInit(): void {
    //El id de el muestreo saldra la tarea
    this.idSample = 302;
    this.getSampleInfo();
    this.getSampleDeductives();
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

  getSampleInfo() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.sampleId'] = `$eq:${302}`;
    this.samplingGoodService.getSample(params.getValue()).subscribe({
      next: response => {
        console.log('response', response);
        this.sampleInfo = response.data[0];
      },
      error: error => {},
    });
  }

  getSearchForm(event: any): void {
    console.log(event);
  }

  openAnnexJ(): void {
    this.openModal(
      AnnexJRestitutionFormComponent,
      '',
      'annexJ-restitution-of-assets'
    );
  }

  opemAnnexK(): void {
    this.openModal(AnnexKFormComponent, '', 'annexK-restitution-of-assets');
  }

  turnSampling(): void {
    let message =
      'Hay bienes en especie y seran enviado a aprobacion.\n¿Esta de acuerdo que la información es correcta para turnar la restitución?';
    this.alertQuestion(undefined, 'Confirmación', message, 'Aceptar').then(
      question => {
        if (question.isConfirmed) {
          console.log('enviar mensaje');
        }
      }
    );
  }

  save(): void {}

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
}
