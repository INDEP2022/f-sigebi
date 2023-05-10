import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { showHideErrorInterceptorService } from 'src/app/common/services/show-hide-error-interceptor.service';
import { ProgrammingGoodService } from 'src/app/core/services/ms-programming-request/programming-good.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
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
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  paramsUsers = new BehaviorSubject<ListParams>(new ListParams());
  idProgramming: number = 0;
  totalItems: number = 0;
  typeUser: string = '';
  delegationUserLog: string = '';
  userInfo: any[] = [];
  itemsInTable: number = 0;
  textButton: string = 'Seleccionar';
  constructor(
    private modalRef: BsModalRef,
    private programmingGoodService: ProgrammingGoodService,
    private userProcessService: UserProcessService,
    private showHideErrorInterceptorService: showHideErrorInterceptorService,
    private programmingService: ProgrammingRequestService
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
    console.log('delegation', this.delegationUserLog);
    this.showHideErrorInterceptorService.showHideError(false);
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getUsers());
  }

  getUsers() {
    this.loading = true;

    this.params.value.addFilter('employeeType', this.typeUser);
    this.params.value.addFilter(
      'regionalDelegation',
      this.delegationUserLog,
      SearchFilter.ILIKE
    );
    const filter = this.params.getValue().getParams();

    this.userProcessService.getAll(filter).subscribe({
      next: resp => {
        resp.data.map((item: any) => {
          item['fullName'] = item.firstName + ' ' + item.lastName;
        });

        resp.data.sort(function (a: any, b: any) {
          return a.fullName - b.fullName;
        });

        this.usersData.load(resp.data);
        this.totalItems = resp.count;
        this.loading = false;
      },
      error: error => {
        console.log(error);
        this.loading = false;
      },
    });

    /*this.params.getValue()['search'] = this.params.getValue().text;
    this.params.getValue()['filter.employeeType'] = this.typeUser;
    //this.params.getValue()['filter.regionalDelegation'] = this.delegation;
    this.userProcessService.getAll(this.params.getValue()).subscribe(data => {
      console.log('data', data);
      //this.filterUsersProg(data.data);
      this.usersData.load(data.data);
      this.totalItems = data.count;
      this.loading = false;
    }); */
  }

  //Filtrar los usuarios que ya estén programados
  /*filterUsersProg(users: any[]) {
    console.log('dont', users);
    this.paramsUsers.getValue()['filter.programmingId'] = 8426;
    this.programmingGoodService
      .getUsersProgramming(this.paramsUsers.getValue())
      .pipe(
        catchError(error => {
          this.showHideErrorInterceptorService.showHideError(false);
          if (error.status == 400) {
            this.userProgramming(users);
          }
          return throwError(() => error);
        })
      )
      .subscribe(data => {
        const filter = users.filter(user => {
          const index = data.data.findIndex(_user => _user.email == user.email);
          return index >= 0 ? false : true;
        });
        console.log(data);
        this.totalItems = this.totalItems - data.count;
        this.usersData.load(filter);
        this.loading = false;
      });
  } */

  userProgramming(data: any) {
    this.usersData.load(data);
    this.loading = false;
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
    console.log('Usuario a guardar', this.userInfo);
    if (this.userInfo.length > 0) {
      this.userInfo.map(info => {
        let user: Object = {
          programmingId: this.idProgramming,
          user: info.firstName,
          email: info.email,
          version: 1,
        };

        this.programmingService.createUsersProgramming(user).subscribe(data => {
          this.modalRef.content.callback(true);
          this.modalRef.hide();
        });
      });
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
