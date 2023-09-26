import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { AdduserComponent } from './adduser/adduser.component';
import { USER_ACCESS_COLUMNS } from './user-access-columns';

@Component({
  selector: 'app-user-access',
  templateUrl: './user-access.component.html',
  styles: [],
})
export class UserAccessComponent extends BasePage implements OnInit {
  users: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  filters = new FilterParams();
  columnFilters: any = [];
  paramsList = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private userService: UsersService,
    private modalService: BsModalService
  ) {
    super();
    this.settings = {
      ...this.settings,
      edit: {
        editButtonContent:
          '<i class="fa fa-pencil-alt text-warning mx-2 pl-2"></i>',
      },
    };

    this.settings.columns = USER_ACCESS_COLUMNS;

    this.settings.hideSubHeader = false;
    this.settings.actions.add = false;
    this.settings.actions.delete = true;
    this.settings.actions.edit = true;
  }

  ngOnInit(): void {
    this.users
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              userKey: () => (searchFilter = SearchFilter.ILIKE),
              userRole: () => (searchFilter = SearchFilter.EQ),
              estAccess: () => (searchFilter = SearchFilter.EQ),
            };

            search[filter.field]();

            if (filter.search !== '') {
              console.log('filter.search', filter.search);
              if (filter.search == 'motionDate') {
              }
              // this.columnFilters[field] = `${filter.search}`;
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;

              console.log(
                'this.columnFilters[field]',
                this.columnFilters[field]
              );
            } else {
              delete this.columnFilters[field];
            }
          });
          this.paramsList = this.pageFilter(this.paramsList);
          //Su respectivo metodo de busqueda de datos
          this.getAccessUsers();
        }
      });

    this.paramsList.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.getAccessUsers();
    });

    // this.params.subscribe(res => {
    //   this.getAccessUsers(res);
    // });
  }

  getAccessUsers(): void {
    this.loading = true;
    this.users.load([]);
    this.users.refresh();
    this.totalItems = 0;
    let params: any = {
      ...this.paramsList.getValue(),
      ...this.columnFilters,
    };
    // params[`sortBy`] = `userKey:ASC`;

    this.userService.getAccessUsers(params).subscribe({
      next: response => {
        console.log('response', response);
        this.users.load(response.data);
        this.users.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: () => {
        this.users.load([]);
        this.users.refresh();
        this.totalItems = 0;
        this.loading = false;
      },
    });
  }

  onDeleteConfirm(event: { data: any }): void {
    console.log(event);
    this.alertQuestion(
      'question',
      '¿Está seguro de eliminar el registro?',
      ''
    ).then(async question => {
      if (question.isConfirmed) {
        this.userService.deleteAccessUsers(event.data.userKey).subscribe({
          next: response => {
            this.alert(
              'success',
              'El registro se ha eliminado correctamente',
              ''
            );
            this.getAccessUsers();
            // this.loading = false;
          },
          error: () => {
            this.alert('error', 'Error al eliminar el registro', '');
            // this.loading = false;
          },
        });
        // this.deleteUser(event.data);
      }
    });
  }

  onEditConfirm(event: { data: any }): void {
    this.openForm(event.data, true);
  }

  openForm(data?: any, edit?: boolean) {
    const modalConfig = MODAL_CONFIG;
    const editDialogData = edit;
    modalConfig.initialState = {
      data,
      editDialogData,
      callback: (next: boolean) => {
        if (next) this.getAccessUsers();
      },
    };
    this.modalService.show(AdduserComponent, modalConfig);
  }

  addUser() {
    this.openForm(null, false);
  }
}
