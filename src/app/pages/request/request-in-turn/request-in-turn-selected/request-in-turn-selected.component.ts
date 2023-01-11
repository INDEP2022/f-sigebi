import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
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
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  requestToTurn: any;
  user: any;
  requestService = inject(RequestService);

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
    this.getUsers();
    this.requestForm.valueChanges.subscribe((data: any) => {
      this.getUsers(data.typeUser);
    });
  }

  prepareForm() {
    this.requestForm = this.fb.group({
      typeUser: ['TE'],
    });
  }

  getUsers(user: any = 'id') {
    this.paragraphs = users;
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
    console.log(this.requestToTurn);
    for (let i = 0; i < this.requestToTurn.length; i++) {
      let request = this.requestToTurn[i];
      request.requestStatus = 'A_TURNAR';
      request.targetUserType = 'SAE'; //this.requestForm.controls['typeUser'].value;
      request.targetUser = 'OST13227'; //this.user.id;
      request.modificationDate = new Date().toISOString();

      this.requestService.update(request.id, request as IRequest).subscribe(
        (date: any) => {
          console.log(date);
          this.onLoadToast(
            'success',
            'Actualización',
            `La actualización se realizo correctamente`
          );
          this.loading = false;
          this.modalRef.content.callback(true);
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
}
