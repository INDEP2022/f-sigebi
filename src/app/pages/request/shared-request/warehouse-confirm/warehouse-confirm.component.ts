import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ITask } from 'src/app/core/models/ms-task/task-model';
import { CityService } from 'src/app/core/services/catalogs/city.service';
import { LocalityService } from 'src/app/core/services/catalogs/locality.service';
import { MunicipalityService } from 'src/app/core/services/catalogs/municipality.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { WarehouseService } from 'src/app/core/services/catalogs/warehouse.service';
import { StoreAliasStockService } from 'src/app/core/services/ms-store/store-alias-stock.service';
import { TaskService } from 'src/app/core/services/ms-task/task.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-warehouse-confirm',
  templateUrl: './warehouse-confirm.component.html',
  styles: [],
})
export class WarehouseConfirmComponent extends BasePage implements OnInit {
  responseForm: FormGroup = new FormGroup({});
  store: any;
  task: ITask;
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private router: Router,
    private warehouseService: WarehouseService,
    private storeService: StoreAliasStockService,
    private taskService: TaskService,
    private localityService: LocalityService,
    private municipalityService: MunicipalityService,
    private cityService: CityService,
    private stateOfRepublicService: StateOfRepublicService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.responseForm = this.fb.group({
      nbidnewstore: [null, [Validators.required]],
      nbobservation: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  confirm() {
    this.alertQuestion(
      'question',
      'Confirmación',
      '¿Estás seguro que desea confirmar el alta de almacén?'
    ).then(async question => {
      if (question.isConfirmed) {
        const updateInfo = await this.updateInfoStore();
        if (updateInfo) {
          console.log('store', this.store);

          const localityName: any = await this.getLocalityName();
          const municipalityName: any = await this.getMunicipalityName();
          const cityName: any = await this.getCityName();
          const stateName: any = await this.getStateName();

          const warehouse =
            this.responseForm.get('nbidnewstore').value +
            ' ' +
            this.store.nbstoresiab +
            ' - ' +
            this.store.nbstreet +
            ', ' +
            localityName +
            ', ' +
            municipalityName +
            ', ' +
            cityName +
            ', ' +
            stateName;

          const warehouseForm = {
            description: warehouse,
            ubication: warehouse,
            manager: this.store.nbadmonby,
            registerNumber: this.store.nbidstore,
            stateCode: this.store.idState,
            cityCode: this.store.idCity,
            municipalityCode: this.store.wildebeestmunicipality,
            localityCode: this.store.wildebeestSettlement,
            indActive: '1',
            type: this.store.tpstore,
            responsibleDelegation: this.store.wildebeestDelegationregion,
          };

          this.warehouseService.create(warehouseForm).subscribe({
            next: async () => {
              const openTaskPerform = await this.openTaskPerform();
              if (openTaskPerform == true) {
                const closeTaskCreateWarehouse =
                  await this.closeTaskWarehouse();
                if (closeTaskCreateWarehouse) {
                  this.alert(
                    'success',
                    'Acción correcta',
                    'Alta de almacén confirmada correctamente'
                  );

                  this.close();
                  this.router.navigate(['/pages/siab-web/sami/consult-tasks']);
                }
              }
            },
            error: error => {},
          });
        }
      }
    });
  }

  getLocalityName() {
    return new Promise((resolve, reject) => {
      const paramsLocality = new BehaviorSubject<ListParams>(new ListParams());
      paramsLocality.getValue()['filter.stateKey'] = this.store.idState;
      paramsLocality.getValue()['filter.municipalityId'] =
        this.store.wildebeestmunicipality;
      paramsLocality.getValue()['filter.id'] = this.store.wildebeestSettlement;
      this.localityService.getAll(paramsLocality.getValue()).subscribe({
        next: response => {
          console.log('localida', response);
          resolve(response.data[0].description);
        },
        error: error => {},
      });
    });
  }

  getMunicipalityName() {
    return new Promise((resolve, reject) => {
      const paramsMun = new BehaviorSubject<ListParams>(new ListParams());
      paramsMun.getValue()['filter.idMunicipality'] =
        this.store.wildebeestmunicipality;
      paramsMun.getValue()['filter.stateKey'] = this.store.idState;
      this.municipalityService.getAll(paramsMun.getValue()).subscribe({
        next: response => {
          resolve(response.data[0].nameMunicipality);
        },
        error: error => {},
      });
    });
  }

  getCityName() {
    return new Promise((resolve, reject) => {
      const paramsCity = new BehaviorSubject<ListParams>(new ListParams());
      paramsCity.getValue()['filter.idCity'] = this.store.idCity;
      this.cityService.getAll(paramsCity.getValue()).subscribe({
        next: response => {
          resolve(response.data[0].nameCity);
        },
        error: error => {},
      });
    });
  }

  getStateName() {
    return new Promise((resolve, reject) => {
      const paramsState = new BehaviorSubject<ListParams>(new ListParams());
      paramsState.getValue()['filter.id'] = this.store.idState;
      this.stateOfRepublicService.getAll(paramsState.getValue()).subscribe({
        next: response => {
          resolve(response.data[0].descCondition);
        },
      });
    });
  }

  openTaskPerform() {
    return new Promise((resolve, reject) => {
      this.task = JSON.parse(localStorage.getItem('Task'));
      const params = new BehaviorSubject<ListParams>(new ListParams());
      params.getValue()['filter.id'] = `$eq:${this.task.id}`;
      this.taskService.getAll(params.getValue()).subscribe({
        next: response => {
          const taskForm: ITask = {
            State: null,
            taskDefinitionId: null,
          };

          this.taskService
            .update(response.data[0].taskDefinitionId, taskForm)
            .subscribe({
              next: response => {
                resolve(true);
              },
              error: error => {},
            });
        },
        error: error => {},
      });
    });
  }

  closeTaskWarehouse() {
    return new Promise((resolve, reject) => {
      const task = JSON.parse(localStorage.getItem('Task'));
      const taskForm: ITask = {
        State: 'FINALIZADA',
        taskDefinitionId: null,
      };
      this.taskService.update(task.id, taskForm).subscribe({
        next: response => {
          resolve(true);
        },
        error: error => {},
      });
    });
  }

  updateInfoStore() {
    return new Promise((resolve, reject) => {
      this.storeService
        .updateDataStore(this.store.id, this.responseForm.value)
        .subscribe({
          next: response => {
            resolve(true);
          },
          error: error => {},
        });
    });
  }

  close() {
    this.modalService.hide();
  }
}
