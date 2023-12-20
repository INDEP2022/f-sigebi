import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IDeductiveVerification } from 'src/app/core/models/catalogs/deductive-verification.model';
import { ISample } from 'src/app/core/models/ms-goodsinv/sample.model';
import { ISampleGood } from 'src/app/core/models/ms-goodsinv/sampling-good-view.model';
import { ISamplingDeductive } from 'src/app/core/models/ms-sampling-good/sampling-deductive.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DeductiveVerificationService } from 'src/app/core/services/catalogs/deductive-verification.service';
import { SamplingGoodService } from 'src/app/core/services/ms-sampling-good/sampling-good.service';
import { TaskService } from 'src/app/core/services/ms-task/task.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { BasePage, TABLE_SETTINGS } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import Swal from 'sweetalert2';
import { LIST_DEDUCTIVES_COLUMNS } from '../../sampling-assets/sampling-assets-form/columns/list-deductivas-column';

@Component({
  selector: 'app-approve-restitution',
  templateUrl: './approve-restitution.component.html',
  styleUrls: ['./approve-restitution.component.scss'],
})
export class ApproveRestitutionComponent extends BasePage implements OnInit {
  title: string = 'Aprobación de bienes';
  showSamplingDetail: boolean = true;
  showFilterAssets: boolean = true;

  sampleInfo: ISample;
  data: any;
  filterObject: any;
  willSave: boolean = false;
  filterForm: ModelForm<any>;
  loadingDeductives: boolean = false;
  disabledButton: boolean = false;
  paragraphsDeductivas = new LocalDataSource();
  //datos para el detalle de anexo
  annexDetail: any[] = [];
  allDeductives: IDeductiveVerification[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  idSample: number = 0;
  constructor(
    private samplingGoodService: SamplingGoodService,
    private fb: FormBuilder,
    private deductiveService: DeductiveVerificationService,
    private samplingService: SamplingGoodService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private taskService: TaskService,
    private wContentService: WContentService
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
    this.idSample = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.getSampleInfo();
    this.initFilterForm();
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

  initFilterForm() {
    this.filterForm = this.fb.group({
      noManagement: [null],
      noInventory: [null],
      descriptionAsset: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  getSampleInfo() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.sampleId'] = `$eq:${this.idSample}`;
    this.samplingGoodService.getSample(params.getValue()).subscribe({
      next: response => {
        this.sampleInfo = response.data[0];
      },
      error: () => {},
    });
  }

  async turnSampling() {
    this.alertQuestion(
      'question',
      'Confirmación',
      '¿Desea aprobar el muestreo de bien?'
    ).then(async question => {
      if (question.isConfirmed) {
        const allGoodsSample: any = await this.getGoods();
        if (allGoodsSample) {
          const ckeckResultEvaluation: any = await this.checkResultEvaluation(
            allGoodsSample
          );
          if (ckeckResultEvaluation) {
            this.alert(
              'warning',
              'Acción Invalida',
              'Todos los bienes deben contar con un resultado'
            );
          } else {
            const checkApproveRes: any = await this.checkApproveRes(
              allGoodsSample
            );
            if (checkApproveRes.length == allGoodsSample.length) {
              const checkUpdateImage: any = await this.checkExistImages();
              if (checkUpdateImage) {
                this.alertQuestion(
                  'question',
                  'Todos los bienes han sido aprobados en el pago de la ficha de orden de ingreso.',
                  '¿Esta de acuerdo que la información es correcta para finalizar?'
                ).then(async question => {
                  if (question.isConfirmed) {
                    const updateGoodsSample = await this.updateGoodSample(
                      checkApproveRes,
                      'APROBADO_NUMERARIO',
                      'APROBAR'
                    );
                    if (updateGoodsSample) {
                      this.closeTask();
                    }
                  }
                });
              } else {
                this.alert(
                  'warning',
                  'Acción Invalida',
                  'Es requerido adjuntar una fotografia'
                );
              }
            } else {
              const checkDeclineRes: any = await this.checkDeclineRes(
                allGoodsSample
              );

              if (checkDeclineRes.length > 0) {
                this.alertQuestion(
                  'question',
                  'Hay bienes Rechazados.',
                  '¿Esta de acuerdo que la información es correcta para turnar?'
                ).then(async question => {
                  if (question.isConfirmed) {
                    const updateGoodsSample: any = await this.updateGoodSample(
                      checkDeclineRes,
                      'RECHAZADO_NUMERARIO',
                      'RECHAZAR'
                    );
                    console.log('updateGoodsSample', updateGoodsSample);
                    if (updateGoodsSample) {
                      this.closeTask();
                      this.createTask();
                    }
                  }
                });
              }
            }
          }
        }
      }
    });
  }

  getGoods() {
    return new Promise((resolve, reject) => {
      const params = new BehaviorSubject<ListParams>(new ListParams());
      params.getValue()['filter.sampleId'] = this.idSample;
      params.getValue()['filter.typeRestitution'] = 'EN ESPECIE';
      this.samplingService.getSamplingGoods(params.getValue()).subscribe({
        next: response => {
          resolve(response.data);
        },
        error: error => {},
      });
    });
  }

  checkResultEvaluation(goodsSample: ISampleGood[]) {
    return new Promise((resolve, reject) => {
      const filter = goodsSample.filter((good: any) => {
        if (good.restitutionStatus == 'PENDIENTE_LIBERACION') return good;
      });

      if (filter.length > 0) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

  checkApproveRes(goodsSample: ISampleGood[]) {
    return new Promise((resolve, reject) => {
      const filter = goodsSample.filter((good: any) => {
        if (good.restitutionStatus == 'APROBAR') return good;
      });

      if (filter.length > 0) {
        resolve(filter);
      } else {
        resolve(filter);
      }
    });
  }

  checkDeclineRes(goodsSample: ISampleGood[]) {
    return new Promise((resolve, reject) => {
      const filter = goodsSample.filter((good: any) => {
        if (good.restitutionStatus == 'RECHAZAR') return good;
      });

      if (filter.length > 0) {
        resolve(filter);
      } else {
        resolve(filter);
      }
    });
  }

  updateGoodSample(
    goodsSample: ISampleGood[],
    statusGood: string,
    statusRestitution: string
  ) {
    return new Promise((resolve, reject) => {
      goodsSample.map(good => {
        const goodData: ISampleGood = {
          sampleGoodId: good.sampleGoodId,
          goodStatus: statusGood,
          restitutionStatus: statusRestitution,
        };

        this.samplingGoodService.editSamplingGood(goodData).subscribe({
          next: () => {
            resolve(true);
          },
          error: () => {
            resolve(false);
          },
        });
      });
    });
  }

  async closeTask() {
    const user: any = this.authService.decodeToken();
    const _task = JSON.parse(localStorage.getItem('Task'));
    let body: any = {};

    body['idTask'] = _task.id;
    body['userProcess'] = user.username;
    body['type'] = 'MUESTREO_BIENES';
    body['subtype'] = 'Verificar_pago';
    body['ssubtype'] = 'CERRAR';

    const taskResult: any = await this.createTaskOrderService(body);
    this.loading = false;
    if (taskResult || taskResult == false) {
      this.msgGuardado(
        'success',
        'Cierre de Tarea Correctamente',
        `Muestreo de bien aprobado correctamente`
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

  checkExistImages() {
    return new Promise(async (resolve, reject) => {
      const goodNumerary: any = await this.getGoods();
      let good: string = '';
      goodNumerary.map(item => {
        good += item.goodId;
      });
      const formDatra: Object = {
        xidBien: good,
      };
      this.wContentService.getDocumentos(formDatra).subscribe({
        next: response => {
          const _data = response.data.filter((img: any) => {
            if (img.dDocType == 'DigitalMedia') {
              return img;
            }
          });

          if (_data.length > 0) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        error: () => {
          resolve(false);
        },
      });
    });
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
    task['userComment'] = 'check-again';
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

  getSearchForm(event: any) {
    this.filterObject = this.filterForm.value;
  }
}
