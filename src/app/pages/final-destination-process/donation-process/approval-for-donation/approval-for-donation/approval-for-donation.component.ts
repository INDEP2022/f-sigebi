import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { TheadFitlersRowComponent } from 'ng2-smart-table/lib/components/thead/rows/thead-filters-row.component';
import {
  BehaviorSubject,
  catchError,
  skip,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { IGood } from 'src/app/core/models/good/good.model';
import { IExportDetail } from 'src/app/core/models/ms-donation/donation.model';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { DonationService } from 'src/app/core/services/ms-donationgood/donation.service';
import { EventProgrammingService } from 'src/app/core/services/ms-event-programming/event-programing.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { IndUserService } from 'src/app/core/services/ms-users/ind-user.service';
import { SegAcessXAreasService } from 'src/app/core/services/ms-users/seg-acess-x-areas.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { APPROVAL_COLUMNS, GOOD_COLUMNS } from './approval-columns';

export type IGoodAndAvailable = IGood & {
  available: boolean;
  selected: boolean;
};
@Component({
  selector: 'app-approval-for-donation',
  templateUrl: './approval-for-donation.component.html',
  styles: [
    `
      .bg-gray {
        background-color: white !important;
      }

      button.loading:after {
        content: '';
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid #fff;
        border-top-color: transparent;
        border-right-color: transparent;
        animation: spin 0.8s linear infinite;
        margin-left: 5px;
        vertical-align: middle;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class ApprovalForDonationComponent extends BasePage implements OnInit {
  form: FormGroup;
  response: boolean = false;
  detail: boolean = false;
  data: LocalDataSource = new LocalDataSource();
  data1: LocalDataSource = new LocalDataSource();
  origin: string = '';
  ropid: LocalDataSource = new LocalDataSource();
  selectRow: boolean = false;
  responseDetail: boolean = false;
  origin2: '';
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  dataTableGood: LocalDataSource = new LocalDataSource();
  bienes: IGood[] = [];
  delegation: string;
  delegations$ = new DefaultSelect<IDelegation>();
  totalItems3: number = 0;
  totalItems1: number = 0;
  excelValid: boolean = false;
  useracept: boolean = true;
  userName: string = '';
  to: string = '';
  from: string = '';
  body: IExportDetail;
  edit = false;
  fileNumber: number = 0;
  event: any[] = [];
  params1 = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilter: any = [];
  columnFilter1: any = [];
  donation = new DefaultSelect();
  error: number = 0;
  users$ = new DefaultSelect<ISegUsers>();
  area: string;
  dataTableGood_: any[] = [];
  validate: boolean = true;
  columnFilters: any = [];
  maxDate = new Date();
  idDelegation: number[] = [];
  status: string = null;
  cveEvent: string;
  actaId: string = '';
  paramsScreen = {
    origin: 'FMCOMDONAC',
  };
  dataTableGoodsMap = new Map<number, IGoodAndAvailable>();
  dataGoodsSelected = new Map<number, IGoodAndAvailable>();
  settings1 = { ...this.settings };
  loading2: boolean = false;
  get noDelegation1() {
    return this.form.get('noDelegation1');
  }
  get user() {
    return this.form.get('elaborated');
  }
  get captureDate() {
    return this.form.get('captureDate');
  }
  get closeDate() {
    return this.form.get('closeDate');
  }
  get estatusAct() {
    return this.form.get('estatusAct');
  }
  get cveActa() {
    return this.form.get('cveActa');
  }
  @ViewChild('myTable', { static: false }) table: TheadFitlersRowComponent;
  loadingExport: boolean = false;
  delegationRegional: any = null;
  constructor(
    private fb: FormBuilder,
    private donationService: DonationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private excelService: ExcelService,
    private GoodprocessService_: GoodprocessService,
    private serviceUser: UsersService,
    private regionalDelegacionService: RegionalDelegationService,
    private segAccessXAreas: SegAcessXAreasService,
    private eventProgrammingService: EventProgrammingService,
    private indUserService: IndUserService,
    private delegationService: DelegationService,
    private securityService: SecurityService,
    private datePipe: DatePipe,
    private authService: AuthService
  ) {
    super();
    this.settings = { ...this.settings, actions: false };
    this.settings.columns = APPROVAL_COLUMNS;
    this.settings.hideSubHeader = false;
    this.settings1 = {
      ...this.settings,
      hideSubHeader: false,
      columns: {
        ...GOOD_COLUMNS,
      },
      rowClassFunction: (row: any) => {
        // if (row.data.error === 0) {
        //   return 'bg-success text-white';
        // } else {
        //   return 'bg-dark text-white';
        // }
        return '';
      },
    };
  }

  ngOnInit(): void {
    this.initForm();
    this.inicialice();
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(paramsQuery => {
        this.origin = paramsQuery['origin'] ?? null;
        if (this.origin == 'FMCOMDONAC') {
          for (const key in this.paramsScreen) {
            if (Object.prototype.hasOwnProperty.call(paramsQuery, key)) {
              this.paramsScreen[key as keyof typeof this.paramsScreen] =
                paramsQuery[key] ?? null;
            }
          }
          this.origin2 = paramsQuery['origin2'] ?? null;
        }
        if (this.origin !== null) {
          console.log('traigo parametros');
        }
      });
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
            const search: any = {
              captureDate_: () => {
                // filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
              },
              noDelegation1: () => (searchFilter = SearchFilter.EQ),
              elaborated_: () => (searchFilter = SearchFilter.ILIKE),
              estatusAct_: () => (searchFilter = SearchFilter.EQ),
              cveAct_: () => (searchFilter = SearchFilter.ILIKE),
              closeDate: () => (searchFilter = SearchFilter.EQ),
            };
            search[filter.field]();
            if (filter.search !== '') {
              if (filter.field == 'captureDate') {
                this.columnFilter[field] = `${filter.search}`;
              } else {
                this.columnFilter[field] = `${searchFilter}:${filter.search}`;
              }
            } else {
              delete this.columnFilter[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getEventComDonationAll();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getEventComDonationAll());

    this.data1
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            const search: any = {
              goodId: () => (searchFilter = SearchFilter.EQ),
              amount: () => (searchFilter = SearchFilter.EQ),
            };
            search[filter.field]();
            if (filter.search !== '') {
              this.columnFilter1[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilter1[field];
            }
          });
          this.params1 = this.pageFilter(this.params1);
          this.getDetailComDonation();
        }
      });
    this.params1
      .pipe(
        skip(1),
        tap(() => {
          this.getDetailComDonation();
        }),
        takeUntil(this.$unSubscribe)
      )
      .subscribe(() => {});
    // this.params1
    //   .pipe(takeUntil(this.$unSubscribe))
    //   .subscribe(() => this.getDetailComDonation());
  }
  formatDate(dateString: string): string {
    if (dateString === '') {
      return '';
    }

    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${year}-${month}-${day}`;
  }

  initForm() {
    this.form = this.fb.group({
      cveActa: [null],
      captureDate: [null, []],
      closeDate: [null, []],
      estatusAct: [null, []],
      noDelegation1: [null],
      elaborated: [null, []],
    });

    // this.getEventComDonation(new ListParams());
  }

  onSubmit() {}

  getUsers($params: ListParams) {
    let params = new FilterParams();
    params.page = $params.page;
    params.limit = $params.limit;
    const area = this.form.controls['elaborated'].value;
    params.search = $params.text;
    this.getAllUsers(params).subscribe();
  }

  getAllUsers(params: FilterParams) {
    return this.serviceUser.getAllSegUsers(params.getParams()).pipe(
      catchError(error => {
        this.users$ = new DefaultSelect([], 0, true);
        return throwError(() => error);
      }),
      tap(response => {
        if (response.count > 0) {
          const name = this.form.get('elaborated').value;
          const data = response.data.filter(m => {
            // m.id == name ;
            m['userAndName'] = m.id + '-' + m.name;
          });

          this.form.get('elaborated').patchValue(data[0]);
        }
        this.users$ = new DefaultSelect(response.data, response.count);
      })
    );
  }
  onUsersChange(event: any) {
    const selectedUserId = event;
    // Update the form with the selected user ID
  }

  async filterButton() {
    this.from = this.datePipe.transform(
      this.form.controls['captureDate'].value,
      'yyyy-MM-dd'
    );
    this.to = this.datePipe.transform(
      this.form.controls['closeDate'].value,
      'yyyy-MM-dd'
    );
    this.response = true;
    const captureDate = this.form.get('captureDate').value ? this.from : '';
    const closeDate = this.form.get('closeDate').value ? this.to : '';
    const cveAc = this.form.get('cveActa').value
      ? this.form.get('cveActa').value
      : '';
    const state = this.status ? this.status : '';
    const noDelegation1 = this.form.get('noDelegation1').value
      ? this.form.get('noDelegation1').value.id
      : 0;
    const elaborated = this.form.get('elaborated').value
      ? this.form.get('elaborated').value
      : 0;

    await this.getSearch();
    // this.getEventComDonationAll(
    //   'COMPDON',
    //   captureDate,
    //   closeDate,
    //   cveAc,
    //   state,
    //   noDelegation1,
    //   elaborated
    // );
    localStorage.setItem('cveAc', cveAc);
    localStorage.setItem('area', noDelegation1);
    localStorage.setItem('elaborated', elaborated);
    localStorage.setItem('captureDate', captureDate);
  }
  delegationToolbar: any = null;
  getDelegation(params: FilterParams) {
    params.addFilter('id', this.user.value, SearchFilter.ILIKE);
    return this.serviceUser.getAllSegUsers(params.getParams()).subscribe({
      next: (value: any) => {
        const data = value.data[0].usuario;
        if (data) this.delegationToolbar = data.delegationNumber;
      },
      error(err) {
        console.log('NO');
      },
    });
  }
  export() {
    this.data.getAll().then(data => {
      this.excelService.export(data, { filename: 'hoja1.xls' });
    });
  }

  getEventComDonation(params: ListParams) {
    // params['sortBy'] = `captureDate:DESC`;
    if (this.valDele != 0)
      params['filter.noDelegation1'] = `$eq:${this.valDele}`;
    if (params.text.length > 0)
      params['filter.cveAct'] = `$ilike:${params.text}`;
    params.text = '';
    delete params['search'];
    this.donationService.getEventComDonation(params).subscribe({
      next: resp => {
        this.donation = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.donation = new DefaultSelect();
      },
    });
  }

  async getSearch() {
    this.from = this.datePipe.transform(
      this.form.controls['captureDate'].value,
      'yyyy-MM-dd'
    );
    this.to = this.datePipe.transform(
      this.form.controls['closeDate'].value,
      'yyyy-MM-dd'
    );
    const cveAct = this.form.get('cveActa').value;
    console.log('cveAct', cveAct);
    const noDelegation1 = this.form.get('noDelegation1').value
      ? this.form.get('noDelegation1').value.id
      : 0;
    const captureDate = this.form.get('captureDate').value ? this.from : '';
    const closeDate = this.form.get('closeDate').value ? this.to : '';
    const elaborated = this.form.get('elaborated').value
      ? this.form.get('elaborated').value
      : null;
    const estatusAct = this.form.get('estatusAct').value
      ? this.form.get('estatusAct').value
      : null;

    if (estatusAct) {
      this.params.getValue()['filter.estatusAct'] = `$ilike:${estatusAct}`;
      // await this.forArrayFilters('estatusAct_', estatusAct);
    } else {
      delete this.params.getValue()['filter.estatusAct'];
    }

    if (elaborated) {
      this.params.getValue()['filter.elaborated'] = `$ilike:${elaborated}`;
      // await this.forArrayFilters('elaborated_', elaborated);
    } else {
      delete this.params.getValue()['filter.elaborated'];
    }

    if (cveAct) {
      this.params.getValue()['filter.cveAct'] = `$ilike:${cveAct}`;
      // await this.forArrayFilters('cveAct_', cveAct);
    } else {
      delete this.params.getValue()['filter.cveAct'];
    }

    if (noDelegation1) {
      this.params.getValue()['filter.noDelegation1'] = `$eq:${noDelegation1}`;
      // await this.forArrayFilters('batchId', noDelegation1);
    } else {
      delete this.params.getValue()['filter.noDelegation1'];
    }

    if (captureDate && closeDate) {
      this.params.getValue()['filter.captureDate'] = `$eq:${captureDate}`;
      this.params.getValue()['filter.closeDate'] = `$eq:${closeDate}`;
    }

    if (captureDate && !closeDate) {
      var fecha1 = new Date(captureDate);
      var ano1 = fecha1.getFullYear();
      var mes1 = ('0' + (fecha1.getMonth() + 1)).slice(-2);
      var dia1 = ('0' + fecha1.getDate()).slice(-2);
      var fechaFormateada1 = ano1 + '-' + mes1 + '-' + dia1;
      this.params.getValue()['filter.captureDate'] = `$eq:${captureDate}`;
    }

    if (!captureDate && closeDate) {
      var fecha1 = new Date(closeDate);
      var ano1 = fecha1.getFullYear();
      var mes1 = ('0' + (fecha1.getMonth() + 1)).slice(-2);
      var dia1 = ('0' + fecha1.getDate()).slice(-2);
      var fechaFormateada1 = ano1 + '-' + mes1 + '-' + dia1;
      this.params.getValue()['filter.closeDate'] = `$eq:${closeDate}`;
    }

    if (!captureDate && !closeDate) {
      delete this.params.getValue()['filter.captureDate'];
      delete this.params.getValue()['filter.closeDate'];
    }

    // await this.clearSubheaderFields();
    this.columnFilters = [];
    this.data1.load([]);
    this.data1.refresh();
    this.totalItems1 = 0;
    await this.getEventComDonationAll();
  }
  async forArrayFilters(field: any, value: any) {
    const subheaderFields: any = this.table.grid.source;

    const filterConf = subheaderFields.filterConf;
    if (filterConf.filters.length > 0) {
      filterConf.filters.forEach((item: any) => {
        if (item.field == field) {
          item.search = value;
        }
      });
    }
    return true;
  }

  async getEventComDonationAll(
    actType?: string | number,
    captureDate?: string | number,
    closeDate?: string | number,
    cveAct?: string | number,
    estatusAct?: string | number,
    NoDelegation1?: string | number,
    elaborated?: string | number
  ) {
    // closeDate ? (this.params.getValue()['filter.closeDate'] = `$eq:${closeDate}`) : delete this.params.getValue()['filter.closeDate'];
    // cveAct ? (this.params.getValue()['filter.cveAct'] = `$ilike:${cveAct}`) : delete this.params.getValue()['filter.cveAct'];
    // NoDelegation1 ? (this.params.getValue()['filter.noDelegation1'] = `$eq:${NoDelegation1}`) : delete this.params.getValue()['filter.NoDelegation1'];
    // estatusAct ? (this.params.getValue()['filter.estatusAct'] = `$eq:${estatusAct}`) : delete this.params.getValue()['filter.estatusAct'];
    // elaborated ? (this.params.getValue()['filter.elaborated'] = `$eq:${elaborated}`) : delete this.params.getValue()['filter.elaborated'];
    const estatusAct_ = this.form.get('estatusAct').value;
    const cveAct_ = this.form.get('cveActa').value;
    const elaborated_ = this.form.get('elaborated').value;

    let params: any = {
      ...this.params.getValue(),
      ...this.columnFilter,
    };

    if (params['filter.cveAct_']) {
      if (cveAct_) {
        return;
      } else {
        params['filter.cveAct'] = params['filter.cveAct_'];
        delete params['filter.cveAct_'];
      }
    }

    if (params['filter.elaborated_']) {
      if (elaborated_) {
        return;
      } else {
        params['filter.elaborated'] = params['filter.elaborated_'];
        delete params['filter.elaborated_'];
      }
    }
    if (params['filter.estatusAct_']) {
      if (estatusAct_) {
        return;
      } else {
        params['filter.estatusAct'] = params['filter.estatusAct_'];
        delete params['filter.estatusAct_'];
      }
    }

    this.loading = true;
    if (params['filter.captureDate_']) {
      const fechas = params['filter.captureDate_'];
      var fecha1 = new Date(fechas);

      var ano1 = fecha1.getFullYear();
      var mes1 = ('0' + (fecha1.getMonth() + 1)).slice(-2);
      var dia1 = ('0' + fecha1.getDate()).slice(-2);
      var fechaFormateada1 = this.datePipe.transform(
        params['filter.captureDate_'],
        'yyyy-MM-dd'
      );
      params['filter.captureDate'] = `$eq:${fechaFormateada1}`;
      delete params['filter.captureDate_'];
    }

    // EVENT_COM_DONACION
    params['sortBy'] = `captureDate:DESC`;
    params['filter.actType'] = '$eq:COMPDON';
    this.donationService.getEventComDonation(params).subscribe({
      next: resp => {
        let result = resp.data.map(item => {
          item['captureDate_'] = item.captureDate;
          item['elaborated_'] = item.elaborated;
          item['estatusAct_'] = item.estatusAct;
          item['cveAct_'] = item.cveAct;
          item['noDelegation1_'] = item.noDelegation1;
        });
        Promise.all(result).then(response => {
          this.data.load(resp.data);
          this.data.refresh();
          this.totalItems3 = resp.count;
          this.loading = false;
          this.loading2 = false;
          this.event = resp.data.filter(filt => {
            this.fileNumber = filt.fileId;
            this.actaId = filt.actId;
          });
          localStorage.setItem('actaId', this.actaId);
          // closeDate = '';
          // captureDate = '';
          // cveAct = '';
          // NoDelegation1 = 0;
          // estatusAct = '';
          // elaborated = 0;
        });
      },
      error: err => {
        this.loading = false;
        this.data.load([]);
        this.data.refresh();
        this.totalItems3 = 0;
      },
    });
  }

  dataSelected: any = null;
  async changeEvent(event: any) {
    if (event) {
      this.selectRow = true;
      this.excelValid = true;
      const data: any = event.data;
      this.dataSelected = data;
      this.actaId = data.actaId;
      console.log(event.data);
      await this.getDetailComDonation(event.data.actId);
      this.responseDetail = true;
    }
  }

  async getDetailComDonation(idActa?: any) {
    this.loading2 = true;
    if (idActa) {
      this.params1.getValue()['filter.recordId'] = `$eq:${idActa}`;
    }
    let params = {
      ...this.params1.getValue(),
      ...this.columnFilter1,
    };
    this.donationService.getEventComDonationDetail_(params).subscribe({
      next: resp => {
        if (resp.data.length == 0) {
          this.data1.load([]);
          this.data1.refresh();
          this.totalItems1 = 0;
          this.loading2 = false;
        } else {
          this.data1.load(resp.data);
          this.data1.refresh();
          this.totalItems1 = resp.count;
          this.loading2 = false;
        }
      },
      error: err => {
        this.loading2 = false;
        this.data1.load([]);
        this.data1.refresh();
        this.totalItems1 = 0;
      },
    });
  }
  goDetailDonation() {
    this.router.navigate(
      [
        '/pages/final-destination-process/donation-process/approval-for-donation/capture-approval-donation',
      ],
      {
        queryParams: {
          // origin: this.origin,
          // recordId: this.params1.getValue()['filter.recordId'],
          // cveEvent: this.cveEvent,
          // area: this.noDelegation1,
        },
      }
    );
  }

  getDels() {
    // this.getDelegations(params).subscribe();
  }
  async getDelegations(lparams: ListParams) {
    let params = new FilterParams();
    if (lparams.text)
      if (!isNaN(parseInt(lparams?.text))) {
        params.addFilter('id', lparams.text, SearchFilter.EQ);
        // params.addFilter('no_cuenta', lparams.text);
      } else {
        params.addFilter('description', lparams.text, SearchFilter.ILIKE);
        // params.addFilter('cve_banco', lparams.text);
      }
    console.log('AAQUII');
    this.delegationService.getAll(params.getParams()).subscribe({
      next: response => {
        this.delegations$ = new DefaultSelect(response.data, response.count);
      },
      error: err => {
        this.delegations$ = new DefaultSelect([], 0);
      },
    });
  }

  async getnoDelegation1(id: any) {
    const params = new FilterParams();
    // params.page = lparams.page;
    // params.limit = lparams.limit;
    // if (lparams?.text.length > 0)
    params.addFilter('id', id, SearchFilter.EQ);
    params.addFilter('description', 'DELE', SearchFilter.ILIKE);

    // this.hideError();

    this.delegationService.getAll(params.getParams()).subscribe({
      next: (data: any) => {
        this.delegationRegional = data.data[0];

        this.form.get('noDelegation1').setValue(this.delegationRegional);
      },
      error: () => {
        this.getDelegations(new ListParams());
        // this.cities = new DefaultSelect();
      },
    });
  }
  updateSelectedIds(event: any) {
    if (this.form && this.form.get('noDelegation1')) {
      this.idDelegation = this.form.get('noDelegation1').value.id;
    }
  }
  selectedDetailActa(event: any) {
    console.log(event.data);
  }

  getEventComDonationExcel(body: any) {
    this.loadingExport = true;
    const estatusAct_ = this.form.get('estatusAct').value;
    const cveAct_ = this.form.get('cveActa').value;
    const elaborated_ = this.form.get('elaborated').value;
    let params: any = {
      ...this.params.getValue(),
      ...this.columnFilter,
    };
    if (params['filter.cveAct_']) {
      if (cveAct_) {
        params['filter.cveAct'] = `$ilike:${cveAct_}`;
        delete params['filter.cveAct_'];
      } else {
        params['filter.cveAct'] = params['filter.cveAct_'];
        delete params['filter.cveAct_'];
      }
    }

    if (params['filter.elaborated_']) {
      if (elaborated_) {
        params['filter.elaborated'] = `$ilike:${elaborated_}`;
        delete params['filter.elaborated_'];
      } else {
        params['filter.elaborated'] = params['filter.elaborated_'];
        delete params['filter.elaborated_'];
      }
    }
    if (params['filter.estatusAct_']) {
      if (estatusAct_) {
        params['filter.estatusAct'] = `$ilike:${estatusAct_}`;
        delete params['filter.estatusAct_'];
      } else {
        let res = params['filter.estatusAct_'].split(':');
        params['filter.estatusAct'] = `$ilike:${res[1].toUpperCase()}`;
        delete params['filter.estatusAct_'];
      }
    }

    if (params['filter.elaborated']) {
      let res = params['filter.elaborated'].split(':');
      params['filter.elaborated'] = `$ilike:${res[1].toUpperCase()}`;
      //  delete params['filter.elaborated_'];
    }
    // if(params['filter.cveAct_']){
    //   params['filter.cveAct'] = params['filter.cveAct_']
    //   delete params['filter.cveAct_'];
    // }
    // if(params['filter.estatusAct_']){
    //   params['filter.estatusAct'] = params['filter.estatusAct_']
    //   delete params['filter.estatusAct_'];
    // }

    if (params['filter.captureDate_']) {
      const fechas = params['filter.captureDate_'];
      var fecha1 = new Date(fechas);

      var ano1 = fecha1.getFullYear();
      var mes1 = ('0' + (fecha1.getMonth() + 1)).slice(-2);
      var dia1 = ('0' + fecha1.getDate()).slice(-2);
      var fechaFormateada1 = this.datePipe.transform(
        params['filter.captureDate_'],
        'yyyy-MM-dd'
      );
      params['filter.captureDate'] = `$eq:${fechaFormateada1}`;
      delete params['filter.captureDate_'];
    }
    params.page = 1;
    params.limit = this.totalItems3;
    this.donationService.getEventComDonationExcelExport(params).subscribe({
      next: async response => {
        const base64 = response.base64File;
        const nameFile = response.nameFile;
        // const base64 = await this.decompressBase64ToString(response.data.base64File)
        await this.downloadExcel(base64, nameFile);
        // this.downloadDocument(
        //   'Detalle de Eventos Donación',
        //   'excel',
        //   response.base64File
        // );
      },
      error: error => {
        this.loadingExport = false;
        this.alert('warning', 'No se pudo descargar el excel', '');
      },
    });
  }

  async downloadExcel(base64String: any, nameFile: string) {
    const mediaType =
      'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,';
    const link = document.createElement('a');
    link.href = mediaType + base64String;
    link.download = nameFile;
    link.click();
    link.remove();
    this.loadingExport = false;
    this.alert('success', 'El archivo se ha descargado', '');
  }

  async getIndicator() {
    return new Promise((resolve, reject) => {
      let body = {
        user: this.authService.decodeToken().username,
        indicatorNumber: 12,
      };
      this.serviceUser.getAllIndicator(body).subscribe({
        next: resp => {
          if (resp.data) {
            resolve(resp.data[0].min);
          } else {
            resolve(null);
          }
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  async getFaVal(indicated: any) {
    return new Promise((resolve, reject) => {
      let body = {
        pUser: this.authService.decodeToken().username,
        pIndicatorNumber: indicated,
      };
      this.serviceUser.getAllFaVal(body).subscribe({
        next: resp => {
          if (resp.data) {
            resolve(resp.data);
          } else {
            resolve(null);
          }
        },
        error: err => {
          console.log(err);
          resolve(null);
        },
      });
    });
  }

  async getAccessArea(params: ListParams) {
    return new Promise((resolve, reject) => {
      params['filter.user'] = `$eq:${this.authService.decodeToken().username}`;
      this.segAccessXAreas.getAll(params).subscribe({
        next: resp => {
          if (resp.data) {
            resolve(resp.data);
          } else {
            resolve(null);
          }
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }
  valUser: boolean = false;
  valDele: any = 0;
  async inicialice() {
    // let access = await this.getAccessArea(new ListParams());
    // console.log("access", access)

    let indicated = await this.getIndicator();
    console.log('indicated', indicated);
    if (indicated == null) {
      this.alert(
        'warning',
        `El usuario no tiene privilegios para esta pantalla`,
        ''
      );
      this.disabledField();
      this.validate = true;
      return;
    }

    let FaVal = await this.getFaVal(indicated);
    const faVal: any = FaVal;
    const level: any = faVal ? faVal[0].fa_val_usuario_ind : 0;
    // console.log(level);
    if (level == 0) {
      this.alert(
        'warning',
        `El usuario no tiene privilegios para esta pantalla`,
        ''
      );
      this.disabledField();
      this.validate = true;
      return;
    } else if (level == 1) {
      this.getDelegations(new ListParams());
      this.getEventComDonation(new ListParams());
      this.valUser = false;
    } else if (level == 2) {
      this.valUser = true;
      const valDele = this.authService.decodeToken().department;
      this.valDele = valDele;
      this.getnoDelegation1(valDele);
      this.getEventComDonation(new ListParams());
      this.form.get('noDelegation1').disable();
    } else {
      this.valUser = false;
      this.form
        .get('elaborated')
        .setValue(this.authService.decodeToken().username);
      this.getDelegations(new ListParams());
      this.getEventComDonation(new ListParams());
    }
  }
  disabledField() {
    this.form.get('cveActa').disable();
    this.form.get('estatusAct').disable();
    this.form.get('noDelegation1').disable();
    this.form.get('elaborated').disable();
    this.form.get('captureDate').disable();
    this.form.get('closeDate').disable();
  }

  onEventChange(type: any) {
    if (type) {
      this.validate = false;
      //console.log(type.cveAct);
      this.cveEvent = type.cveAct;
    }
    //
  }

  clean() {
    this.response = false;
    this.responseDetail = false;
    this.validate = true;
    this.form.reset();
    localStorage.removeItem('actaId');
    localStorage.removeItem('cveActa');
    localStorage.removeItem('captureDate');
    localStorage.removeItem('closeDate');
    localStorage.removeItem('estatusAct');
    localStorage.removeItem('area');
    localStorage.removeItem('elaborated');
    this.data1.load([]);
    this.data1.refresh();
    this.data.load([]);
    this.data.refresh();

    if (this.valUser) {
      // const valDele = this.authService.decodeToken().department;
      // this.getnoDelegation1(valDele);
      this.form.get('noDelegation1').setValue(this.delegationRegional);
      this.form.get('noDelegation1').disable();
    } else {
      this.getDelegations(new ListParams());
    }
  }

  getRowSelec(event: any) {
    this.status = event;
    console.log(event);
  }

  exportAll(): void {
    this.body = {
      recordId: Number(this.actaId),
      typeActa: 'COMPDON',
      delegationId: Number(localStorage.getItem('area')),
      nombre_transferente: null,
    };
    this.getEventComDonationExcel(this.body);
  }

  //Descargar Excel
  downloadDocument(
    filename: string,
    documentType: string,
    base64String: string
  ): void {
    let documentTypeAvailable = new Map();
    documentTypeAvailable.set(
      'excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    documentTypeAvailable.set(
      'word',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    documentTypeAvailable.set('xls', '');

    let bytes = this.base64ToArrayBuffer(base64String);
    let blob = new Blob([bytes], {
      type: documentTypeAvailable.get(documentType),
    });
    let objURL: string = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = objURL;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    this._toastrService.clear();
    this.loading = false;
    this.alert('success', 'Reporte Excel', 'Descarga Finalizada');
    URL.revokeObjectURL(objURL);
  }

  base64ToArrayBuffer(base64String: string) {
    let binaryString = window.atob(base64String);
    let binaryLength = binaryString.length;
    let bytes = new Uint8Array(binaryLength);
    for (var i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  method2(data: any) {
    console.log('data', this.dataSelected);
    localStorage.setItem('actaId', this.dataSelected.actId);
    this.goDetailDonation();
    // this.alert("success", "AQUI", data)
  }
  method1() {
    this.clean();
    this.goDetailDonation();
  }
}
