import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { USER_COLUMNS } from '../../acept-programming/columns/users-columns';
import { userData } from './users-data';

@Component({
  selector: 'app-search-user-form',
  templateUrl: './search-user-form.component.html',
  styles: [],
})
export class SearchUserFormComponent extends BasePage implements OnInit {
  usersData: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  typeUser: string = '';
  userInfo = userData;
  constructor(private modalRef: BsModalRef) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: USER_COLUMNS,
      selectMode: 'multi',
    };
  }

  ngOnInit(): void {
    this.usersData = userData;
  }

  getUsers() {
    console.log('Tipo de usuario', this.typeUser);
  }

  userSelect(event: any) {
    this.userInfo = event.selected;
  }

  confirm() {
    this.modalRef.content.callback(this.userInfo);
    this.modalRef.hide();
  }

  close() {
    this.modalRef.hide();
  }
}
