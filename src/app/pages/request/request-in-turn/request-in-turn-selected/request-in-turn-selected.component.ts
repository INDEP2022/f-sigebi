import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { IUserProcess } from 'src/app/core/models/ms-user-process/user-process.model';
import { UserProcessService } from 'src/app/core/services/ms-user-process/user-process.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { IRequest } from '../../../../core/models/requests/request.model';
import { RequestService } from '../../../../core/services/requests/request.service';
import { TURN_SELECTED_COLUMNS } from './request-in-turn-selected-columns';

var users: any[] = [
  {
    id: 1,
    user: 'Jose',
    email: 'jose@gmail.com',
    otro: 'otro dato',
  },
  {
    id: 2,
    user: 'Mari',
    email: 'maroa@gmail.com',
    otro: 'otro dato',
  },
  {
    id: 3,
    user: 'Noe',
    email: 'Noe@gmail.com',
    otro: 'otro dato',
  },
];

@Component({
  selector: 'app-request-in-turn-selected',
  templateUrl: './request-in-turn-selected.component.html',
  styles: [],
})
export class RequestInTurnSelectedComponent extends BasePage implements OnInit {
  requestForm: FormGroup;
  title: string = '¿DESEAS TURNAR LAS SOLICITUDES SELECCIONAS?';
  paragraphs: any[] = [];
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  totalItems: number = 0;
  requestToTurn: any;
  listUser: IUserProcess[] = [];
  typeUser: string = 'TE';
  user: any;
  requestService = inject(RequestService);
  userProcessService = inject(UserProcessService);

  constructor(public modalRef: BsModalRef, public fb: FormBuilder) {
    super();
    this.settings.columns = TURN_SELECTED_COLUMNS;
    this.settings.actions = {
      columnTitle: 'Acciones',
      position: 'right',
      add: false,
      edit: false,
      delete: false,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.removeUnNecessaryData();

    this.requestForm.controls['typeUser'].valueChanges.subscribe(
      (data: any) => {
        this.typeUser = data;
        this.getUserList();
      }
    );

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      this.getUserList();
    });
  }

  prepareForm() {
    this.requestForm = this.fb.group({
      typeUser: ['TE'],
    });
  }

  getUserList() {
    this.loading = true;
    this.typeUser = this.requestForm.controls['typeUser'].value;
    this.params.value.addFilter('employeeType', this.typeUser);
    const filter = this.params.getValue().getParams();
    this.userProcessService.getAll(filter).subscribe({
      next: resp => {
        this.listUser = resp.data;
        this.paragraphs = this.listUser;
        this.totalItems = resp.count;
        this.loading = false;
        this.params.value.removeAllFilters();
      },
      error: error => {
        console.log(error);
        this.loading = false;
        this.params.value.removeAllFilters();
      },
    });
  }

  removeUnNecessaryData() {
    for (let i = 0; i < this.requestToTurn.length; i++) {
      const request = this.requestToTurn[i];
      delete request.delegationName;
      delete request.stateOfRepublicName;
      delete request.transferentName;
      delete request.stationName;
      delete request.authorityName;
      delete request.affairName;
      delete request.dateApplication;
      delete request.datePaper;

      //eliminar objetos
      delete request.delegation;
      delete request.transferent;
      delete request.authority;
      delete request.emisora;
      delete request.state;
      delete request.proceedings;
    }
  }

  getRow(user: any) {
    this.user = user.data;
  }

  confirm() {
    if (this.user === undefined) {
      this.onLoadToast('info', 'Informacion', `Seleccione un usuario!`);
      return;
    }
    this.loading = true;
    for (let i = 0; i < this.requestToTurn.length; i++) {
      let request = this.requestToTurn[i];
      request.requestStatus = 'A_TURNAR';
      request.targetUserType = this.requestForm.controls['typeUser'].value;
      request.targetUser = this.user.id;
      request.modificationDate = new Date().toISOString();

      this.requestService.update(request.id, request as IRequest).subscribe(
        (data: any) => {
          console.log(data);
          if (data.statusCode != 200) {
            this.message(
              'error',
              'Turnado',
              'Ocurrio un error no se pudo turnar las solicitudes'
            );
          }

          if (data.id != null) {
            this.message(
              'success',
              'Turnado',
              'Se turnaron las solicitudes correctamente'
            );

            this.loading = false;
            this.modalRef.content.callback(true);
          }
          this.loading = false;
          this.close();
        },
        error => {
          this.loading = false;
        }
      );
    }
  }

  close() {
    this.modalRef.hide();
  }

  message(header: any, title: string, body: string) {
    this.onLoadToast(header, title, body);
  }
}
