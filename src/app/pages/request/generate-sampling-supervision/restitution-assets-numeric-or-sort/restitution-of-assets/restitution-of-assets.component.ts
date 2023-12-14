import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ISample } from 'src/app/core/models/ms-goodsinv/sample.model';
import { ISampleGood } from 'src/app/core/models/ms-goodsinv/sampling-good-view.model';
import { ISamplingDeductive } from 'src/app/core/models/ms-sampling-good/sampling-deductive.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DeductiveVerificationService } from 'src/app/core/services/catalogs/deductive-verification.service';
import { SamplingGoodService } from 'src/app/core/services/ms-sampling-good/sampling-good.service';
import { TaskService } from 'src/app/core/services/ms-task/task.service';
import Swal from 'sweetalert2';
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
  title: string =
    'Muestreo de Bienes: Clasificación de bienes por tipo de restitución';
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
    private deductiveService: DeductiveVerificationService,
    private activatedRoute: ActivatedRoute,
    private taskService: TaskService,
    private router: Router,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    //El id de el muestreo saldra la tarea
    this.idSample = Number(this.activatedRoute.snapshot.paramMap.get('id'));
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
    params.getValue()['filter.sampleId'] = `$eq:${this.idSample}`;
    this.samplingGoodService.getSample(params.getValue()).subscribe({
      next: response => {
        this.sampleInfo = response.data[0];
      },
      error: error => {},
    });
  }

  getSearchForm(event: any): void {}

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

  async turnSampling() {
    const goodsSample: any = await this.getGoodsSample();

    const typeRestitution = goodsSample.filter((item: any) => {
      if (!item.typeRestitution) return item;
    });

    if (typeRestitution.length == 0) {
      const numeraryRest = goodsSample.filter(item => {
        if (item.typeRestitution == 'NUMERARIO') return item;
      });
      const espRest = goodsSample.filter(item => {
        if (item.typeRestitution == 'EN ESPECIE') return item;
      });

      if (numeraryRest.length > 0) {
        numeraryRest.map((good: ISampleGood) => {
          const sampleGood: ISampleGood = {
            sampleGoodId: good.sampleGoodId,
            goodStatus: 'PENDIENTE_NUMERARIO',
          };

          this.samplingGoodService.editSamplingGood(sampleGood).subscribe({
            next: () => {},
          });
        });
      }

      if (espRest.length > 0) {
        espRest.map((good: ISampleGood) => {
          const sampleGood: ISampleGood = {
            sampleGoodId: good.sampleGoodId,
            goodStatus: 'PENDIENTE_ESPECIE',
          };

          this.samplingGoodService.editSamplingGood(sampleGood).subscribe({
            next: () => {},
          });
        });
      }

      this.alertQuestion(
        'question',
        'Confirmación',
        '¿Esta de acuerdo que la información es correcta para turnar el muestreo?'
      ).then(question => {
        if (question.isConfirmed) {
          this.createTask();
        }
      });
    } else {
      this.alert(
        'warning',
        'Acción Invalida',
        'Todos los bienes deben tener un Tipo de Restitución'
      );
    }
    /* let message =
      'Hay bienes en especie y seran enviado a aprobacion.\n¿Esta de acuerdo que la información es correcta para turnar la restitución?';
    this.alertQuestion(undefined, 'Confirmación', message, 'Aceptar').then(
      question => {
        if (question.isConfirmed) {
          console.log('enviar mensaje');
        }
      }
    ); */
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

  async createTask() {
    const user: any = this.authService.decodeToken();
    const _task = JSON.parse(localStorage.getItem('Task'));
    let body: any = {};

    body['idTask'] = _task.id;
    body['userProcess'] = user.username;
    body['type'] = 'MUESTREO_BIENES';
    body['subtype'] = 'Verificar_pago';
    body['ssubtype'] = 'CREATE';

    let task: any = {};
    task['id'] = 0;
    task['assignees'] = user.username;
    task['assigneesDisplayname'] = user.username;
    task['creator'] = user.username;
    task['reviewers'] = user.username;

    task['idSampling'] = this.idSample;
    task[
      'title'
    ] = `Validación de pago de ficha de deposito para el avalúo de los bienes ${this.idSample}`;
    task['idDelegationRegional'] = this.sampleInfo.regionalDelegationId;
    task['idTransferee'] = this.sampleInfo.transfereeId;
    task['processName'] = 'Verificacion_pago';
    task['urlNb'] = 'pages/request/deposit-payment-validations';
    body['task'] = task;

    const taskResult: any = await this.createTaskOrderService(body);
    this.loading = false;
    if (taskResult || taskResult == false) {
      this.msgGuardado(
        'success',
        'Creación de Tarea Correcta',
        `Validación de pago de ficha de deposito para el avalúo de los bienes ${this.idSample}`
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
}
