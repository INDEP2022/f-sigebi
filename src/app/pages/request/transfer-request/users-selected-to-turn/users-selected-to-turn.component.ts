import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IRequestInTurnSelected } from 'src/app/core/models/catalogs/request-in-turn-selected.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { TURN_SELECTED_COLUMNS } from '../../request-in-turn/request-in-turn-selected/request-in-turn-selected-columns';

@Component({
  selector: 'app-users-selected-to-turn',
  templateUrl: './users-selected-to-turn.component.html',
  styles: [],
})
export class UsersSelectedToTurnComponent extends BasePage implements OnInit {
  title: string = '¿DESEAS TURNAR LAS SOLICITUDES SELECCIONAS?';
  settings = TABLE_SETTINGS;
  paragraphs: IRequestInTurnSelected[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  public event: EventEmitter<any> = new EventEmitter();
  totalItems: number = 0;
  typeTurn: string;

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
    //todo: search users by the type user and display
    console.log(this.typeTurn);
  }

  triggerEvent(item: IRequestInTurnSelected) {
    this.event.emit(item);
  }

  confirm(): void {
    let user = { user: 'Jon Estragos', email: 'email.com' };

    this.triggerEvent(user);
    this.close();
  }

  close(): void {
    this.modalRef.hide();
  }
}
