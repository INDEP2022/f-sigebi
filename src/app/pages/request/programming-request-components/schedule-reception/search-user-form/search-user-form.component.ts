import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { USER_COLUMNS } from '../../acept-programming/columns/users-columns';

@Component({
  selector: 'app-search-user-form',
  templateUrl: './search-user-form.component.html',
  styles: [],
})
export class SearchUserFormComponent extends BasePage implements OnInit {
  usersData: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  constructor(private modalRef: BsModalRef) {
    super();
    this.settings = { ...this.settings, actions: false, columns: USER_COLUMNS };
  }

  ngOnInit(): void {}

  confirm() {}

  close() {
    this.modalRef.hide();
  }
}
