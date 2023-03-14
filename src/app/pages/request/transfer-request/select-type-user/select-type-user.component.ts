import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IUserProcess } from 'src/app/core/models/ms-user-process/user-process.model';
import { IRequest } from 'src/app/core/models/requests/request.model';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { UserProcessService } from 'src/app/core/services/ms-user-process/user-process.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { TURN_SELECTED_COLUMNS } from './request-in-turn-selected-columns';

@Component({
  selector: 'app-select-tipe-user',
  templateUrl: './select-type-user.component.html',
  styles: [],
})
export class SelectTypeUserComponent extends BasePage implements OnInit {
  userForm: ModelForm<any>;
  data: any;
  typeAnnex: string;

  paragraphs: any[] = [];
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  totalItems: number = 0;
  user: IUserProcess = null;
  warningTLP: boolean = false;

  //injections
  private fb = inject(FormBuilder);
  private userProcessService = inject(UserProcessService);
  private transferentService = inject(TransferenteService);
  private requestService = inject(RequestService);

  constructor(private modalRef: BsModalRef) {
    super();
  }

  ngOnInit(): void {
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      columns: TURN_SELECTED_COLUMNS,
    };
    this.initForm();

    this.userForm.controls['typeUser'].valueChanges.subscribe((data: any) => {
      this.getUsers();
      this.TLPMessage();
    });

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      this.getUsers();
    });
  }

  initForm() {
    this.userForm = this.fb.group({
      typeUser: ['TE'],
    });
  }

  getUsers() {
    this.loading = true;
    const typeEmployee = this.userForm.controls['typeUser'].value;
    this.params.value.addFilter('employeeType', typeEmployee);
    const filter = this.params.getValue().getParams();
    this.userProcessService.getAll(filter).subscribe({
      next: resp => {
        this.paragraphs = resp.data;
        this.totalItems = resp.count;
        this.loading = false;
        this.params.value.removeAllFilters();
      },
      error: error => {
        this.loading = false;
        this.params.value.removeAllFilters();
      },
    });
  }

  getTransferent(id: number) {
    return new Promise((resolve, reject) => {
      this.transferentService.getById(id).subscribe({
        next: resp => {
          resolve(resp.typeTransferent);
        },
      });
    });
  }

  async TLPMessage() {
    const transferente = this.data.transferenceId;
    const typeUser = this.userForm.controls['typeUser'].value;
    if (transferente != null) {
      const transferenteType = await this.getTransferent(transferente);
      if ('CE' !== transferenteType && 'TE' === typeUser) {
        this.warningTLP = true;
      }
    }
  }

  userSelected(event: any) {
    if (event.isSelected) {
      this.user = event.data;
    } else {
      this.user = null;
    }
  }

  async turnRequest() {
    if (this.user) {
      //this.data.targetUserType = this.userForm.controls['typeUser'].value;
      //this.data.targetUserType = this.user.id;

      //Todo: guardar solicitud
      const isUpdated = await this.saveRequest(this.data as IRequest);

      if (isUpdated === true) {
        //TODO: generar o recuperar el reporte
        //TODO: Guardarlo en el content
        //TODO: Generar una nueva tarea en task  table
      }
    } else {
      this.message(
        'error',
        'Seleccione un usuario',
        'Es requerido seleccionar un usuario'
      );
    }
  }

  saveRequest(request: IRequest) {
    return new Promise((resolve, reject) => {
      this.requestService.update(request.id, request).subscribe({
        next: resp => {
          if (resp.id) {
            resolve(true);
          } else {
            this.message(
              'error',
              'Error al guardar',
              'Ocurrio un error al guardar la solicitud'
            );
            reject(false);
          }
        },
        error: error => {
          this.message(
            'error',
            'Error al guardar',
            'Ocurrio un error al guardar la solicitud'
          );
          reject(false);
        },
      });
    });
  }

  close() {
    console.log('entro');

    this.modalRef.hide();
  }

  message(header: any, title: string, body: string) {
    this.onLoadToast(header, title, body);
  }
}
