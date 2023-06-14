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

    this.settings.columns = EMAIL_COLUMNS;
    this.settings.actions.delete = true;
    this.settings.actions.add = false;
    this.settings.hideSubHeader = false;
    // this.settings = {
    //   ...this.settings,
    //   actions: {
    //     columnTitle: 'Acciones',
    //     edit: true,
    //     delete: false,
    //     position: 'right',
    //   },
    //   columns: { ...EMAIL_COLUMNS },
    // };
    // this.settings.actions.add = false;
    // this.settings = {
    //   ...this.settings,
    //   hideSubHeader: false,
    // };
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
            filter.field == 'id' ||
            filter.field == 'name' ||
            filter.field == 'usuario' ||
            filter.field == 'email' ||
            filter.field == 'registryNumber'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
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
    this.usersService.getAllSegUsers(params).subscribe({
      next: response => {
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
