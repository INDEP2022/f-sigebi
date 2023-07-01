import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ITask } from 'src/app/core/models/ms-task/task-model';
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
    private taskService: TaskService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    console.log('store', this.store);
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
      'warning',
      'Confirmación',
      '¿Estás seguro que desea confirmar el alta de almacén?'
    ).then(async question => {
      if (question.isConfirmed) {
        const updateInfo = await this.updateInfoStore();
        if (updateInfo) {
          const warehouseForm = {
            description: this.store.nbstoresiab,
            ubication: this.store.nbstreet,
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
          this.close();
          console.log('cerro1');
          console.log('warehouseForm', warehouseForm);
          this.warehouseService.create(warehouseForm).subscribe({
            next: async response => {
              console.log('cerro2');
              const openTaskPerform = await this.openTaskPerform();
              if (openTaskPerform == true) {
                this.onLoadToast(
                  'success',
                  'Acción correcta',
                  'Alta de almacén confirmada correctamente'
                );
                console.log('cerro3');
                this.close();
                this.router.navigate(['/pages/siab-web/sami/consult-tasks']);
                console.log('cerro4');
              }
            },
            error: error => {},
          });
        }
      }
    });
  }

  openTaskPerform() {
    return new Promise((resolve, reject) => {
      this.task = JSON.parse(localStorage.getItem('Task'));
      const params = new BehaviorSubject<ListParams>(new ListParams());
      params.getValue()['filter.id'] = this.task.id;
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
