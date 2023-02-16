import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IUser } from 'src/app/core/models/catalogs/user.model';
import { ProgrammingGoodService } from 'src/app/core/services/ms-programming-request/programming-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { USER_COLUMNS } from '../../acept-programming/columns/users-columns';

@Component({
  selector: 'app-search-user-form',
  templateUrl: './search-user-form.component.html',
  styles: [],
})
export class SearchUserFormComponent extends BasePage implements OnInit {
  usersData: IUser[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  typeUser: string = '';
  userInfo: IUser[];
  textButton: string = 'Seleccionar';
  constructor(
    private modalRef: BsModalRef,
    private programmingGoodService: ProgrammingGoodService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: USER_COLUMNS,
      selectMode: 'multi',
    };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getUsers());
  }

  getUsers() {
    this.loading = true;
    //console.log('Tipo de usuario', this.typeUser);
    this.params.getValue()['search'] = this.params.getValue().text;
    this.programmingGoodService
      .getUsersProgramming(this.params.getValue())
      .subscribe({
        next: response => {
          this.usersData = response.data;
          console.log(this.usersData);
          this.totalItems = response.count;
          this.loading = false;
        },
      });
  }

  userSelect(event: any) {
    this.userInfo = event.selected;
  }

  confirm() {
    if (this.userInfo) {
      this.modalRef.content.callback(this.userInfo);
      this.modalRef.hide();
    } else {
      this.onLoadToast(
        'warning',
        'Advertencía',
        'Debes seleccionar al menos un usuario'
      );
    }
  }

  close() {
    this.modalRef.hide();
  }
}
