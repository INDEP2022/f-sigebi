import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { IUser } from 'src/app/core/models/catalogs/user.model';
import { DonationService } from 'src/app/core/services/ms-donationgood/donation.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { APPROVAL_COLUMNS } from './approval-columns';

@Component({
  selector: 'app-approval-for-donation',
  templateUrl: './approval-for-donation.component.html',
  styles: [],
})
export class ApprovalForDonationComponent extends BasePage implements OnInit {
  form: FormGroup;
  response: boolean = false;
  data: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilter: any = [];
  users = new DefaultSelect<IUser>();

  constructor(
    private fb: FormBuilder,
    private donationService: DonationService,
    private excelService: ExcelService,
    private serviceUser: UsersService
  ) {
    super();
    this.settings = { ...this.settings, actions: false };
    this.settings.columns = APPROVAL_COLUMNS;
    this.settings.hideSubHeader = false;
  }

  ngOnInit(): void {
    this.initForm();
    // this.search();
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'captureDate':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              case 'noDelegation1':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              this.columnFilter[field] = `${searchFilter}:${filter.search}`;
              this.params.value.page = 1;
            } else {
              delete this.columnFilter[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.search();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.search());
  }

  initForm() {
    this.form = this.fb.group({
      cveAct: [null, []],
      estatusAct: ['todos', []],
      noDelegation1: [null, [Validators.pattern(STRING_PATTERN)]],
      elaborated: [null, []],
    });
  }

  onSubmit() {}

  filterButton() {
    this.params.value.page = 1;
    this.search(false);
  }

  search(filter: boolean = true) {
    this.loading = true;
    //Poner this.form.value en una variable para poder modificarla
    let forma: any = {};
    Object.keys(this.form.value).forEach(key => {
      const value = this.form.value[key];
      console.log(key + ': ' + value);
      if (value !== null && value !== '') {
        forma['filter.' + key] = '$ilike:' + value;
      }
    });

    let params = {
      ...this.params.value,
      ...forma,
    };

    if (filter) {
      params = {
        ...params,
        ...this.columnFilter,
      };
    }

    //si el valor de estatusAct es "todos" se elimina del objeto
    if (params['filter.estatusAct'] == '$ilike:todos') {
      delete params['filter.estatusAct'];
    }

    console.log(JSON.stringify(params));

    this.donationService.getEventComDonation(params).subscribe(
      data => {
        if (!filter) {
          this.columnFilter = [];
          this.response = true;
        }
        this.data.load(data.data);
        this.data.refresh();
        this.totalItems = data.count;
        this.loading = false;
      },
      err => {
        this.loading = false;
        this.data.load([]);
        console.log(err);
      }
    );
  }

  export() {
    this.data.getAll().then(data => {
      this.excelService.export(data, { filename: 'hoja1.xls' });
    });
  }

  getUsers(params: ListParams) {
    const routeUser = `?filter.name=$ilike:${params.text}`;
    this.serviceUser.getAllSegUsers(routeUser).subscribe(res => {
      this.users = new DefaultSelect(res.data, res.count);
    });
  }

  onUsersChange(type: any) {}
}
