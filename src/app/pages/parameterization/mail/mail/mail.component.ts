import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { MailModalComponent } from '../mail-modal/mail-modal.component';
//Models
import { LocalDataSource } from 'ng2-smart-table';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { EMAIL_COLUMNS } from './email-columns';
//servicios

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styles: [],
})
export class MailComponent extends BasePage implements OnInit {
  segUsers: ISegUsers[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  constructor(
    private modalService: BsModalService,
    private usersService: UsersService
  ) {
    super();

    /*this.settings.columns = EMAIL_COLUMNS;
    this.settings.actions.delete = true;
    this.settings.actions.add = false;
    this.settings.hideSubHeader = false;*/
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        add: false,
        position: 'right',
      },
      columns: { ...EMAIL_COLUMNS },
    };
    /*this.settings.actions.add = false;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
    };*/
  }

  ngOnInit(): void {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'name':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'rfc':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'userDetail':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}.delegationNumber`;
                break;
              case 'email':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'registryNumber':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'curp':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'street':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'suburb':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'zipCode':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'phone':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'profession':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'positionKey':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'firstTimeLoginDate':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'userSirsae':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'sendEmail':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'attribAsign':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'clkdetSirsae':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'exchangeAlias':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'clkdet':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'clkid':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'profileMimKey':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'nameAd':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'posPrevKey':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            /*filter.field == 'id' ||
            filter.field == 'name' ||
            filter.field == 'usuario' ||
            filter.field == 'email' ||
            filter.field == 'registryNumber'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);*/
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getSegRelEmail();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getSegRelEmail());
  }

  getSegRelEmail() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.usersService.getAllDetailSegUsers(params).subscribe({
      next: response => {
        console.log(response.data);
        this.segUsers = response.data;
        this.totalItems = response.count || 0;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(segUsers?: ISegUsers) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      segUsers,
      callback: (next: boolean) => {
        if (next) this.getSegRelEmail();
      },
    };
    this.modalService.show(MailModalComponent, modalConfig);
  }
}
