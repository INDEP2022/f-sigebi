import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { showHideErrorInterceptorService } from 'src/app/common/services/show-hide-error-interceptor.service';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
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
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsUsers = new BehaviorSubject<ListParams>(new ListParams());
  paramsShowUsers = new BehaviorSubject<ListParams>(new ListParams());
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
    private programmingService: ProgrammingRequestService,
    private authService: AuthService
  ) {
    super();
    this.settings = {
      ...this.settings,
      selectMode: 'multi',
      actions: false,
      columns: {
        ...USER_COLUMNS,
        /*name: {
          title: 'Selección usuario',
          sort: false,
          type: 'custom',
          valuePrepareFunction: (user: any, row: any) =>
            this.isUserSelected(row),
          renderComponent: CheckboxElementComponent,
          onComponentInitFunction: (instance: CheckboxElementComponent) =>
            this.onUserChange(instance),
        },*/
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
    const user = this.authService.decodeToken();
    const deleRegionalId = user.delegacionreg;
    this.params.getValue()['filter.delegationreg'] = deleRegionalId;
    this.userProcessService
      .getAllUsersWithRolDistint(this.params.getValue())
      .subscribe({
        next: response => {
          this.filterUsersProg(response.data);
          this.totalItems = response.count;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.alert('warning', 'Usuarios no encontrados', '');
          this.totalItems = 0;
        },
      });
  }

  //Filtrar los usuarios que ya estén programados
  filterUsersProg(users: any[]) {
    this.paramsUsers.getValue()['filter.programmingId'] = this.idProgramming;
    this.programmingGoodService
      .getUsersProgramming(this.paramsUsers.getValue())
      .subscribe({
        next: data => {
          const filter = users.filter(user => {
            const index = data.data.findIndex(
              _user => _user.email == user.email
            );
            return index >= 0 ? false : true;
          });

          this.totalItems = this.totalItems - data.count;
          this.usersData.load(filter);
          //this.totalItems = this.usersData.count();
          this.loading = false;
        },
        error: error => {
          this.userProgramming(users);
        },
      });
  }

  userSelect(info: any) {
    this.userInfo = info.selected;
  }

  userProgramming(data: any) {
    this.usersData.load(data);

    this.loading = false;
  }

  sendUser(user: any, selected: boolean) {
    if (selected) {
      this.userInfo.push(user);
    } else {
      this.userInfo = this.userInfo.filter(
        _user => _user.wheelNumber != _user.wheelNumber
      );
    }
  }

  confirm() {
    if (this.userInfo.length > 0) {
      this.alertQuestion(
        'question',
        'Confirmación',
        '¿Desea agregar los usuarios a la Programación?'
      ).then(question => {
        if (question.isConfirmed) {
          let count: number = 0;
          this.userInfo.map(info => {
            let user: Object = {
              programmingId: this.idProgramming,
              user: info.firstName,
              email: info.email,
              version: 1,
            };

            this.programmingService
              .createUsersProgramming(user)
              .subscribe(data => {
                count = count + 1;
                if (count == 1) {
                  this.modalRef.content.callback(true);
                  this.modalRef.hide();
                }
              });
          });
        }
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
