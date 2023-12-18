import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IDeductive } from 'src/app/core/models/catalogs/deductive.model';
import { ISample } from 'src/app/core/models/ms-goodsinv/sample.model';
import { ISampleGood } from 'src/app/core/models/ms-goodsinv/sampling-good-view.model';
import { ISamplingDeductive } from 'src/app/core/models/ms-sampling-good/sampling-deductive.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DeductiveVerificationService } from 'src/app/core/services/catalogs/deductive-verification.service';
import { SamplingGoodService } from 'src/app/core/services/ms-sampling-good/sampling-good.service';
import { TaskService } from 'src/app/core/services/ms-task/task.service';
import Swal from 'sweetalert2';
import { BasePage, TABLE_SETTINGS } from '../../../../../core/shared/base-page';
import { LIST_DEDUCTIVES_VIEW_COLUMNS } from '../../sampling-assets/sampling-assets-form/columns/list-deductivas-column';
import { LIST_VERIFY_VIEW } from '../../sampling-assets/sampling-assets-form/columns/list-verify-noncompliance';

@Component({
  selector: 'app-verification-warehouse-assets',
  templateUrl: './verification-warehouse-assets.component.html',
  styleUrls: ['./verification-warehouse-assets.component.scss'],
})
export class VerificationWarehouseAssetsComponent
  extends BasePage
  implements OnInit
{
  title: string = '';
  showSamplingDetail: boolean = true;
  showFilterAssets: boolean = true;
  sampleInfo: ISample;
  idSample: number = 0;
  filterObject: any;
  params = new BehaviorSubject<ListParams>(new ListParams());
  willSave: boolean = true;
  paragraphs = new LocalDataSource();
  paragraphsDeductivas = new LocalDataSource();
  assetsSelected: ISampleGood[] = [];
  totalItems: number = 0;
  deductivesSel: IDeductive[] = [];
  loadingDeductives: boolean = false;
  disabledButton: boolean = false;
  allDeductives: ISamplingDeductive[] = [];
  allSampleGoods: ISampleGood[] = [];
  settingsDeductive = {
    ...TABLE_SETTINGS,
    actions: false,

    columns: LIST_DEDUCTIVES_VIEW_COLUMNS,
  };

  constructor(
    private store: Store,
    private samplingService: SamplingGoodService,
    private deductiveService: DeductiveVerificationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private taskService: TaskService
  ) {
    super();

    this.idSample = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.title = `Verificacion de bienes en almacén ${this.idSample}`;
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: 'multi',
      columns: LIST_VERIFY_VIEW,
    };
  }

  ngOnInit(): void {
    //Id de muestreo se obtiene de la tarea
    this.getSampleInfo();
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

  getSampleInfo() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.sampleId'] = `$eq:${this.idSample}`;
    this.samplingService.getSample(params.getValue()).subscribe({
      next: response => {
        this.sampleInfo = response.data[0];
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getGoodsSampling());
      },
    });
  }

  getGoodsSampling() {
    this.params.getValue()['filter.sampleId'] = this.idSample;
    this.params.getValue()['filter.evaluationResult'] = 'NO CUMPLE';
    this.samplingService.getSamplingGoods(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs.load(response.data);
        this.allSampleGoods = response.data;
        this.totalItems = response.count;
      },
      error: error => {},
    });
  }

  openAnnexJ() {}

  opemAnnexK() {}

  public verifyTurn() {
    if (this.assetsSelected.length == this.allSampleGoods.length) {
      this.alertQuestion(
        'question',
        'Confirmación',
        'Todos los bienes se localizaron en el almacén. ¿Esta de acuerdo que la información es correcta para turnar el muestreo?'
      ).then(async question => {
        if (question.isConfirmed) {
          if (this.assetsSelected.length == 0) {
            const updateGood = await this.updateGood();

            const updateStatusSample = await this.updateStatusSample(
              'TERMINA MUESTREO'
            );

            if (updateStatusSample) this.closeTask();
          } else if (
            this.assetsSelected.length > 0 &&
            this.assetsSelected.length != this.allSampleGoods.length
          ) {
            const updateGood = await this.updateGood();

            if (updateGood) {
              const udapteStatusSample = await this.updateStatusSample(
                'VERIFICACION BIENES'
              );

              if (udapteStatusSample) this.createTask();
            }
          }
        }
      });
    } else {
      this.alertQuestion(
        'question',
        'Confirmación',
        'Hay bienes que no se localizaron en el almacén. ¿Esta de acuerdo que la información es correcta para turnar el muestreo?'
      ).then(async question => {
        if (question.isConfirmed) {
          if (this.assetsSelected.length == 0) {
            const updateGood = await this.updateGood();

            const updateStatusSample = await this.updateStatusSample(
              'VERIFICACION BIENES'
            );

            if (updateStatusSample) {
              this.createTask();
            }
          } else if (
            this.assetsSelected.length > 0 &&
            this.assetsSelected.length != this.allSampleGoods.length
          ) {
            const updateGood = await this.updateGood();

            if (updateGood) {
              const udapteStatusSample = await this.updateStatusSample(
                'VERIFICACION BIENES'
              );

              if (udapteStatusSample) this.createTask();
            }
          }
        }
      });
    }
  }

  async createTask() {
    const user: any = this.authService.decodeToken();
    const _task = JSON.parse(localStorage.getItem('Task'));
    let body: any = {};

    body['idTask'] = _task.id;
    body['userProcess'] = user.username;
    body['type'] = 'MUESTREO_BIENES';
    body['subtype'] = 'Verificacion_bienes';
    body['ssubtype'] = 'RESTITUCION';

    let task: any = {};
    task['id'] = 0;
    task['assignees'] = user.username;
    task['assigneesDisplayname'] = user.username;
    task['creator'] = user.username;
    task['reviewers'] = user.username;

    task['idSampling'] = this.idSample;
    task[
      'title'
    ] = `Muestreo de bienes: Clasificación de bienes por tipo de restitución ${this.idSample}`;
    task['idDelegationRegional'] = this.sampleInfo.regionalDelegationId;
    task['idTransferee'] = this.sampleInfo.transfereeId;
    task['processName'] = 'RESTITUCION';
    task['urlNb'] = 'pages/request/restitution-assets-numeric';
    body['task'] = task;

    const taskResult: any = await this.createTaskOrderService(body);
    this.loading = false;
    if (taskResult || taskResult == false) {
      this.msgGuardado(
        'success',
        'Creación de Tarea Correcta',
        `Muestreo de bienes: Clasificación de bienes por tipo de restitución ${this.idSample}`
      );
    }
  }

  async closeTask() {
    const user: any = this.authService.decodeToken();
    const _task = JSON.parse(localStorage.getItem('Task'));
    let body: any = {};

    body['idTask'] = _task.id;
    body['userProcess'] = user.username;
    body['type'] = 'MUESTREO_ORDENES';
    body['subtype'] = 'Firmar_resultados';
    body['ssubtype'] = 'VERIFICAR';

    const taskResult: any = await this.createTaskOrderService(body);
    this.loading = false;
    if (taskResult || taskResult == false) {
      this.msgGuardado(
        'success',
        'Creación de Tarea Correcta',
        `Muestreo de bienes finalizado correctamente`
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

  updateGood() {
    return new Promise((resolve, reject) => {
      if (this.assetsSelected.length > 0) {
        this.assetsSelected.map(good => {
          const sampleGood: ISampleGood = {
            sampleGoodId: good.sampleGoodId,
            indVerification: 'Y',
            restitutionStatus: 'PENDIENTE_LIBERACION',
          };
          this.samplingService.editSamplingGood(sampleGood).subscribe({
            next: response => {
              resolve(true);
            },
            error: error => {},
          });
        });
      } else {
        this.allSampleGoods.map(good => {
          const sampleGood: ISampleGood = {
            sampleGoodId: good.sampleGoodId,
            restitutionStatus: 'PENDIENTE_LIBERACION',
          };
          this.samplingService.editSamplingGood(sampleGood).subscribe({
            next: response => {
              resolve(true);
            },
            error: error => {},
          });
        });
      }
    });
  }

  updateStatusSample(status: string) {
    return new Promise((resolve, reject) => {
      const sample: ISample = {
        sampleId: this.idSample,
        sampleStatus: status,
      };

      this.samplingService.updateSample(sample).subscribe({
        next: () => {
          resolve(true);
        },
      });
    });
  }

  getSearchForm(event: any) {
    this.filterObject = event;

    if (this.filterObject != false) {
      if (this.filterObject.noManagement)
        this.params.getValue()['filter.goodId'] =
          this.filterObject.noManagement;

      if (this.filterObject.noInventory)
        this.params.getValue()['filter.inventoryNumber'] =
          this.filterObject.noInventory;

      if (this.filterObject.descriptionAsset)
        this.params.getValue()['filter.description'] =
          this.filterObject.descriptionAsset;

      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getGoodsSampling());
    } else if (this.filterObject == false) {
      this.params = new BehaviorSubject<ListParams>(new ListParams());
      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getGoodsSampling());
    }
  }

  goodsSamplingSelect(event: any) {
    this.assetsSelected = event.selected;
  }

  getSampleDeductives() {
    this.params.getValue()['filter.sampleId'] = `$eq:${this.idSample}`;
    this.samplingService
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

  deductivesSelect(event: any) {
    this.deductivesSel.push(event.selected[0]);
  }

  save(): void {}
}
