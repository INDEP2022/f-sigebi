import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { minDate } from 'src/app/common/validations/date.validators';
import { ICity } from 'src/app/core/models/catalogs/city.model';
import { ILocality } from 'src/app/core/models/catalogs/locality.model';
import { IMunicipality } from 'src/app/core/models/catalogs/municipality.model';
import { IRegionalDelegation } from 'src/app/core/models/catalogs/regional-delegation.model';
import { IStateOfRepublic } from 'src/app/core/models/catalogs/state-of-republic.model';
import { ITypeWarehouse } from 'src/app/core/models/catalogs/type-warehouse.model';
import { IZipCodeGoodQuery } from 'src/app/core/models/catalogs/zip-code.model';
import { ICatThirdView } from 'src/app/core/models/ms-goods-inv/goods-inv.model';
import { ITask } from 'src/app/core/models/ms-task/task-model';
import { IUserProcess } from 'src/app/core/models/ms-user-process/user-process.model';
import { IUserTurn } from 'src/app/core/models/user-turn/user-turn.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { CityService } from 'src/app/core/services/catalogs/city.service';
import { DelegationStateService } from 'src/app/core/services/catalogs/delegation-state.service';
import { LocalityService } from 'src/app/core/services/catalogs/locality.service';
import { MunicipalityService } from 'src/app/core/services/catalogs/municipality.service';
import { TypeWarehouseService } from 'src/app/core/services/catalogs/type-warehouse.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { StoreAliasStockService } from 'src/app/core/services/ms-store/store-alias-stock.service';
import { TaskService } from 'src/app/core/services/ms-task/task.service';
import { UserProcessService } from 'src/app/core/services/ms-user-process/user-process.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-warehouse-form',
  templateUrl: './warehouse-form.component.html',
  styles: [],
})
export class WarehouseFormComponent extends BasePage implements OnInit {
  regDelData: IRegionalDelegation;
  warehouseForm: FormGroup = new FormGroup({});
  users = new DefaultSelect<IUserProcess>();
  typeTercero = new DefaultSelect<ICatThirdView>();
  states = new DefaultSelect<IStateOfRepublic>();
  municipalities = new DefaultSelect<IMunicipality>();
  cities = new DefaultSelect<ICity>();
  localities = new DefaultSelect<ILocality>();
  zipCode = new DefaultSelect<IZipCodeGoodQuery>();
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  userNameSelect: string = '';
  userFirstName: string = '';
  typeWarehouse = new DefaultSelect<ITypeWarehouse>();
  stateKey: string = '';
  municipalityId: string = '';
  localityId: string = '';
  show_city_municipality: boolean = false;
  showLocality: boolean = false;
  showZipCode: boolean = false;
  programmingId: number = 0;
  task: ITask;
  stateKeySelect: number = 0;
  constructor(
    private modalService: BsModalService,
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private municipalityService: MunicipalityService,
    private typeWarehouseService: TypeWarehouseService,
    private cityService: CityService,
    private localityService: LocalityService,
    private goodsQueryService: GoodsQueryService,
    private stateService: DelegationStateService,
    private programmingService: ProgrammingRequestService,
    private userProcessService: UserProcessService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private taskService: TaskService,
    private router: Router,
    private storeService: StoreAliasStockService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getStateSelect(new ListParams());
    this.getTypeWarehouseSelect(new ListParams());
    this.getResponsibleUserSelect(new ListParams());
    this.getTypeTerceroSelect(new ListParams());
  }

  //Verificar typeTercero//
  prepareForm() {
    const now = moment();
    const date = new Date(now.format());
    this.warehouseForm = this.fb.group({
      nbidstore: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      nbusername: [
        null,
        [
          Validators.required,
          Validators.maxLength(1000),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      tpThird: [null],

      wildebeestSettlement: [null, [Validators.required]],
      nbwithlocator: [null],

      nbcontract: [
        null,
        [Validators.maxLength(40), Validators.pattern(STRING_PATTERN)],
      ],

      nbstoresiab: [
        null,
        [
          Validators.maxLength(60),
          Validators.required,
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      fhstart: [null, [Validators.required, minDate(new Date(date))]],
      fhend: [null, [Validators.required, minDate(new Date(date))]],

      wildebeestDelegationregion: [
        this.regDelData.description,
        [Validators.maxLength(150), Validators.pattern(STRING_PATTERN)],
      ],

      nbadmonby: [
        null,
        [Validators.maxLength(100), Validators.pattern(STRING_PATTERN)],
      ],
      idState: [null, [Validators.required]],
      idCity: [null, [Validators.required]],
      wildebeestmunicipality: [null, [Validators.required]],
      idProgramming: [this.programmingId],
      nbzipcode: [null],
      nbstreet: [
        null,
        [
          Validators.maxLength(200),
          Validators.pattern(STRING_PATTERN),
          Validators.required,
        ],
      ],
      nbnoexternal: [
        null,
        [Validators.maxLength(100), Validators.pattern(STRING_PATTERN)],
      ],
      nblatitude: [
        null,
        [Validators.maxLength(150), Validators.pattern(STRING_PATTERN)],
      ],
      tpstore: [null, [Validators.required]],

      nblength: [
        null,
        [Validators.maxLength(100), Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  userSelect(user: IUserTurn) {
    this.userNameSelect = user.username;
    this.userFirstName = user.firstName;
  }

  confirm() {
    this.alertQuestion(
      'question',
      'Confirmación',
      '¿Seguro de mandar a solicitar un nuevo almacén?'
    ).then(async question => {
      if (question.isConfirmed) {
        this.loading = true;
        this.warehouseForm
          .get('wildebeestDelegationregion')
          .setValue(this.regDelData.id);

        this.storeService.createdataStore(this.warehouseForm.value).subscribe({
          next: async response => {
            this.loading = false;
            await this.createTaskWarehouse(response.id);
          },
          error: error => {},
        });
        //Verificar donde se guarda el almacén//
      }
    });
  }

  async createTaskWarehouse(idWarehouse: number) {
    const _task = JSON.parse(localStorage.getItem('Task'));
    const user: any = this.authService.decodeToken();
    let body: any = {};
    body['type'] = 'SOLICITUD_PROGRAMACION';
    body['subtype'] = 'Realizar_Programacion';
    body['ssubtype'] = 'ALTA_ALMACEN';

    let task: any = {};
    task['id'] = 0;
    task['assignees'] = this.userNameSelect;
    task['assigneesDisplayname'] = this.userFirstName;
    task['creator'] = user.username;
    task['taskNumber'] = Number(this.programmingId);
    task['title'] =
      'Solicitud de alta de almacén con folio: ' + this.programmingId;
    task['programmingId'] = this.programmingId;
    task['expedientId'] = 0;
    task['idDelegationRegional'] = this.regDelData.id;
    task['urlNb'] = 'pages/request/programming-request/warehouse';
    task['processName'] = 'SolicitudProgramacion';
    task['taskDefinitionId'] = _task.id;
    body['task'] = task;
    const taskResult = await this.createTaskOrderService(body);
    if (taskResult) {
      const closeTaskPerformProg = await this.closeTaskPerform();
      if (closeTaskPerformProg) {
        this.alert(
          'success',
          'Registro guardado',
          `Solicitud de alta de almacén con folio: ${this.programmingId}`
        );
        this.close();
        this.router.navigate(['/pages/siab-web/sami/consult-tasks']);
      }
    }
  }

  closeTaskPerform() {
    return new Promise((resolve, reject) => {
      this.task = JSON.parse(localStorage.getItem('Task'));
      const params = new BehaviorSubject<ListParams>(new ListParams());
      params.getValue()['filter.id'] = `$eq:${this.task.id}`;
      this.taskService.getAll(params.getValue()).subscribe({
        next: async response => {
          const updateStatusTMP = await this.updateTask(response.data[0]);
          if (updateStatusTMP == true) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        error: error => {},
      });
    });
  }

  updateTask(task: ITask) {
    return new Promise((resolve, reject) => {
      const taskForm: ITask = {
        State: 'FINALIZADA',
        taskDefinitionId: task.id,
      };
      this.taskService.update(task.id, taskForm).subscribe({
        next: () => {
          resolve(true);
        },
        error: error => {
          resolve(false);
        },
      });
    });
  }

  createTaskOrderService(body: any) {
    return new Promise((resolve, reject) => {
      this.taskService.createTaskWitOrderService(body).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: error => {
          this.onLoadToast('error', 'Error', 'No se pudo crear la tarea');
          reject(false);
        },
      });
    });
  }

  getResponsibleUserSelect(params: ListParams) {
    const user: any = this.authService.decodeToken();

    params['filter.search'] = params.text;
    this.userProcessService.getAll(params).subscribe({
      next: data => {
        const concatNom = data.data.map(user => {
          user['nomComplete'] = user.firstName + ' ' + user.lastName;
          return user;
        });
        this.users = new DefaultSelect(concatNom, data.count);
      },
      error: error => {},
    });
  }

  getTypeTerceroSelect(params: ListParams) {
    params.page = 0;
    const language = {
      language: 'US',
    };
    this.programmingService
      .postCatThirdView(params, language)
      .subscribe(data => {
        this.typeTercero = new DefaultSelect(data.data, data.count);
      });
  }

  //Revisar error //
  getStateSelect(params?: ListParams) {
    params['filter.regionalDelegation'] = this.regDelData.id;
    this.stateService.getAll(params).subscribe(data => {
      const filterStates = data.data.filter(_states => {
        return _states.stateCode;
      });

      const states = filterStates.map(items => {
        return items.stateCode;
      });

      this.states = new DefaultSelect(states, data.count);
    });
  }

  stateSelect(item: IStateOfRepublic) {
    this.stateKey = item.id;
    this.getCitySelect(new ListParams());
    this.getMunicipalitiesSelect(new ListParams());
  }

  getCitySelect(params?: ListParams) {
    if (this.stateKey) {
      this.show_city_municipality = true;
      params['filter.state'] = this.stateKey;
      this.cityService.getAll(params).subscribe(data => {
        this.cities = new DefaultSelect(data.data, data.count);
      });
    }
  }

  getMunicipalitiesSelect(params?: ListParams) {
    if (this.stateKey) {
      this.show_city_municipality = true;
      params['filter.stateKey'] = this.stateKey;
      this.municipalityService.getAll(params).subscribe(data => {
        this.municipalities = new DefaultSelect(data.data, data.count);
      });
    }
  }

  municipalitySelect(item: IMunicipality) {
    this.municipalityId = item.idMunicipality;
    this.getLocalitySelect(new ListParams());
  }

  getLocalitySelect(params?: ListParams) {
    if (this.stateKey && this.municipalityId) {
      this.showLocality = true;
      params['filter.stateKey'] = this.stateKey;
      params['filter.municipalityId'] = this.municipalityId;
      this.localityService.getAll(params).subscribe(data => {
        this.localities = new DefaultSelect(data.data, data.count);
      });
    }
  }

  localitySelect(item: ILocality) {
    this.localityId = item.id;
    this.getZipCodeSelect(new ListParams());
  }

  getZipCodeSelect(params?: ListParams) {
    if (this.stateKey && this.municipalityId && this.localityId) {
      this.showZipCode = true;
      params['filter.keyState'] = this.stateKey;
      params['filter.keyTownship'] = this.municipalityId;
      params['filter.keySettlement'] = this.localityId;
      this.goodsQueryService.getZipCode(params).subscribe(data => {
        this.zipCode = new DefaultSelect(data.data, data.count);
      });
    }
  }

  getTypeWarehouseSelect(params: ListParams) {
    this.typeWarehouseService.getAll(params).subscribe(data => {
      const filterType = data.data.filter(item => {
        return item.description;
      });
      this.typeWarehouse = new DefaultSelect(filterType, data.count);
    });
  }

  close() {
    this.modalService.hide();
    this.modalRef.content.callback(true);
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
