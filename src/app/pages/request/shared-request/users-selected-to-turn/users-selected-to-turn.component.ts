import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { TURN_SELECTED_COLUMNS } from '../../request-in-turn/request-in-turn-selected/request-in-turn-selected-columns';

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
  selector: 'app-users-selected-to-turn',
  templateUrl: './users-selected-to-turn.component.html',
  styles: [],
})
export class UsersSelectedToTurnComponent extends BasePage implements OnInit {
  title: string = '¿DESEAS TURNAR LAS SOLICITUDES SELECCIONAS?';
  paragraphs: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  public event: EventEmitter<any> = new EventEmitter();
  totalItems: number = 0;
  //typeTurn: string;
  request: any;
  user: any;

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
    let typeUser = this.request.requestStatus;
    console.log(this.request);
    this.getAllUsers(typeUser);
  }

  getAllUsers(typeUser: string) {
    this.paragraphs = users;
  }

  selectedRow(user: any) {
    this.user = user.data;
  }
  triggerEvent(item: any) {
    this.event.emit(item);
  }

  confirm(): void {
    this.triggerEvent(this.user);
    this.close();
  }

  close(): void {
    this.modalRef.hide();
  }
}
