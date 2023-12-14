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
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import Swal from 'sweetalert2';
import { BasePage, TABLE_SETTINGS } from '../../../../../core/shared/base-page';
import { LIST_DEDUCTIVES_COLUMNS } from '../../sampling-assets/sampling-assets-form/columns/list-deductivas-column';

@Component({
  selector: 'app-deposit-payment-validations',
  templateUrl: './payment-validations.component.html',
  styles: [],
})
export class PaymentValidationsComponent extends BasePage implements OnInit {
  title: string = '';
  showFilterAssets: boolean = true;
  showSamplingDetail: boolean = true;
  willSave: boolean = false;
  sampleInfo: ISample;
  idSample: number = 0;
  filterForm: ModelForm<any>;
  loadingDeductives: boolean = false;
  paragraphsDeductivas = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  filterObject: any;
  allDeductives: IDeductiveVerification[] = [];
  constructor(
    private samplingGoodService: SamplingGoodService,
    private fb: FormBuilder,
    private deductiveService: DeductiveVerificationService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private taskService: TaskService,
    private router: Router
  ) {
    super();
    this.idSample = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.title = `Validación de pagos de avalúo ${this.idSample}`;
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: '',
      columns: LIST_DEDUCTIVES_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.getSampleInfo();
    this.initFilterForm();
    this.getSampleDeductives();
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

  getSearchForm(event: any) {
    this.filterObject = this.filterForm.value;
  }

  finishSampling() {
    let message =
      'Se a concluido la Aprobación de Restitución de bienes. ¿Esta de acuerdo que la información es correcta para guardar?';
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

  async turnSampling() {
    const goodNumerary: any = await this.getSampleGoods();

    const statusRestitution = goodNumerary.filter(item => {
      if (!item.restitutionStatus) return item;
    });

    if (statusRestitution.length == 0) {
      const approvate = goodNumerary.filter(item => {
        if (item.restitutionStatus == 'APROBAR') return item;
      });

      const decline = goodNumerary.filter(item => {
        if (item.restitutionStatus == 'RECHAZAR') return item;
      });

      if (approvate.length == goodNumerary.length) {
        this.alertQuestion(
          'question',
          'Confirmación',
          'Todos los bienes han sido aprobados en el pago de la ficha de orden de ingreso. ¿Esta de acuerdo que la información es correcta para finalizar?'
        ).then(async question => {
          if (question.isConfirmed) {
            const updateSampleGood = await this.updateSampleGood(goodNumerary);
            if (updateSampleGood) {
              this.createTask();
            }
          }
        });
      } else if (decline.length >= 1) {
        this.alertQuestion(
          'question',
          'Confirmación',
          'Hay bienes que han sido rechazados en el pago de la ficha de orden de ingreso. ¿Esta de acuerdo que la información es correcta para finalizar?'
        ).then(async question => {
          if (question.isConfirmed) {
            const updateSampleGood = await this.updateSampleGoodDecline(
              goodNumerary
            );
            if (updateSampleGood) {
              this.createTask();
            }
          }
        });
      }
    } else {
      this.alert(
        'warning',
        'Acción Invalida',
        'Todos los bienes deben contar con un resultado'
      );
    }
  }

  updateSampleGood(sampleGood: ISampleGood[]) {
    return new Promise((resolve, reject) => {
      sampleGood.map(item => {
        const sampleGood: ISampleGood = {
          sampleGoodId: item.sampleGoodId,
          goodStatus: 'APROBADO_NUMERARIO',
          restitutionStatus: 'APROBAR',
        };

        this.samplingGoodService.editSamplingGood(sampleGood).subscribe({
          next: () => {
            resolve(true);
          },
        });
      });
    });
  }

  updateSampleGoodDecline(sampleGood: ISampleGood[]) {
    return new Promise((resolve, reject) => {
      sampleGood.map(item => {
        const sampleGood: ISampleGood = {
          sampleGoodId: item.sampleGoodId,
          goodStatus: 'RECHAZADO_NUMERARIO',
          restitutionStatus: 'RECHAZAR',
        };

        this.samplingGoodService.editSamplingGood(sampleGood).subscribe({
          next: () => {
            resolve(true);
          },
        });
      });
    });
  }

  getSampleGoods() {
    return new Promise((resolve, reject) => {
      const params = new BehaviorSubject<ListParams>(new ListParams());
      params.getValue()['filter.typeRestitution'] = 'NUMERARIO';
      params.getValue()['filter.sampleId'] = this.idSample;
      this.samplingGoodService.getSamplingGoods(params.getValue()).subscribe({
        next: response => {
          resolve(response.data);
        },
        error: error => {},
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
    body['subtype'] = 'Verificar_pago';
    body['ssubtype'] = 'CERRAR';

    const taskResult: any = await this.createTaskOrderService(body);
    this.loading = false;
    if (taskResult || taskResult == false) {
      this.msgGuardado(
        'success',
        'Creación de Tarea Correcta',
        `Tarea de verificación de pago de avaluo correctamente`
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

  save() {}
}
