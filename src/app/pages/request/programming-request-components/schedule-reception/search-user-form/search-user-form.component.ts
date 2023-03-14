import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ProgrammingGoodService } from 'src/app/core/services/ms-programming-request/programming-good.service';
import { UserProcessService } from 'src/app/core/services/ms-user-process/user-process.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { USER_COLUMNS } from '../../acept-programming/columns/users-columns';
@Component({
  selector: 'app-search-user-form',
  templateUrl: './search-user-form.component.html',
  styles: [],
})
export class SearchUserFormComponent extends BasePage implements OnInit {
  usersData: LocalDataSource = new LocalDataSource();
  loadUsersData: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  typeUser: string = '';
  userInfo: any[] = [];
  itemsInTable: number = 0;
  textButton: string = 'Seleccionar';
  constructor(
    private modalRef: BsModalRef,
    private programmingGoodService: ProgrammingGoodService,
    private userProcessService: UserProcessService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: {
        ...USER_COLUMNS,
        name: {
          title: 'Selección usuario',
          sort: false,
          type: 'custom',
          valuePrepareFunction: (user: any, row: any) =>
            this.isUserSelected(row),
          renderComponent: CheckboxElementComponent,
          onComponentInitFunction: (instance: CheckboxElementComponent) =>
            this.onUserChange(instance),
        },
      },
    };
  }

  onUserChange(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => this.sendUser(data.row, data.toggle),
    });
  }
  isUserSelected(user: any) {
    const exist = this.userInfo.find(
      _user =>
        _user.programmingId == user.programmingId && user.email == _user.email
    );
    if (!exist) return false;
    return true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getUsers());
  }

  getUsers() {
    this.loading = true;
    console.log('Tipo de usuario', this.typeUser);
    this.params.getValue()['search'] = this.params.getValue().text;
    this.params.getValue()['filter.employeeType'] = this.typeUser;
    this.userProcessService.getAll(this.params.getValue()).subscribe(data => {
      console.log('usuarios', data.data);
      this.usersData.load(data.data);
      this.totalItems = data.count;
      this.loading = false;
    });
  }

  sendUser(user: any, selected: boolean) {
    if (selected) {
      this.userInfo.push(user);
      console.log(this.userInfo);
    } else {
      this.userInfo = this.userInfo.filter(
        _user => _user.wheelNumber != _user.wheelNumber
      );
    }
  }

  confirm() {
    if (this.userInfo) {
      this.removeUsersSelected(this.userInfo);
      this.modalRef.content.callback(this.userInfo);
      this.close();
    } else {
      this.onLoadToast(
        'warning',
        'Advertencía',
        'Debes seleccionar al menos un usuario'
      );
    }
  }

  removeUsersSelected(userInfo: any) {
    this.usersData.getElements().then(items => {
      userInfo.map((itemsRemove: any) => {
        this.usersData.remove(itemsRemove);
      });
    });
  }

  close() {
    this.modalRef.hide();
  }
}
