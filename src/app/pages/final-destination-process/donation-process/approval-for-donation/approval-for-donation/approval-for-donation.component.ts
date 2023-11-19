import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, catchError, takeUntil, tap, throwError } from 'rxjs';
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
  styles: [],
})
export class ApprovalForDonationComponent extends BasePage implements OnInit {
  form: FormGroup;
  response: boolean = false;
  detail: boolean = false;
  data: LocalDataSource = new LocalDataSource();
  data1: LocalDataSource = new LocalDataSource();
  origin: '';
  ropid: LocalDataSource = new LocalDataSource();
  selectRow: boolean = false;
  // user: string = '';
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  dataTableGood: LocalDataSource = new LocalDataSource();
  bienes: IGood[] = [];
  delegation: string;
  delegations$ = new DefaultSelect<IDelegation>();
  totalItems: number = 0;
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
  // user = localStorage.getItem('username');
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
  constructor(
    private fb: FormBuilder,
    private donationService: DonationService,
    private router: Router,
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
        if (row.data.di_disponible == 'S') {
          return 'bg-success text-white';
        } else {
          return 'bg-dark text-white';
        }
      },
    };
  }

  ngOnInit(): void {
    this.initForm();
    // this.userTracker();
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
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'estatusAct':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'noDelegation1':
                searchFilter = SearchFilter.EQ;
                break;
              case 'elaborated':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
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
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'goodId':
                searchFilter = SearchFilter.EQ;
                break;
              case 'amount':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              this.columnFilter1[field] = `${searchFilter}:${filter.search}`;
              //this.params.value.page = 1;
            } else {
              delete this.columnFilter1[field];
            }
          });
          this.params1 = this.pageFilter(this.params1);
          this.getDetailComDonation();
        }
      });

    this.inicialice();
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
      captureDate: ['', []],
      closeDate: ['', []],
      estatusAct: ['', []],
      noDelegation1: [null],
      elaborated: [null, []],
    });
    // this.form.get('elaborated').disable();
    // this.form.get('noDelegation1').disable();
    this.getEventComDonation(new ListParams());
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
            console.log(m);
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

  filterButton() {
    if (
      this.form.get('cveActa').value === null ||
      this.form.get('captureDate').value === null ||
      this.form.get('closeDate').value === null ||
      this.form.get('estatusAct').value === null ||
      this.form.get('noDelegation1').value === null ||
      this.form.get('elaborated').value === null
    ) {
      this.alert(
        'warning',
        'Debe seleccionar al menos una opción para filtrar',
        ''
      );
      return;
    }
    this.from = this.datePipe.transform(
      this.form.controls['captureDate'].value,
      'dd/MM/yyyy'
    );
    this.to = this.datePipe.transform(
      this.form.controls['closeDate'].value,
      'dd/MM/yyyy'
    );
    this.response = true;
    const captureDate = this.form.get('captureDate').value ? this.from : '';
    const closeDate = this.form.get('closeDate').value ? this.to : '';
    const cveAc = this.form.get('cveActa').value
      ? this.form.get('cveActa').value
      : '';
    const state = this.status ? this.status : '';
    const noDelegation1 = this.form.get('noDelegation1').value
      ? this.form.get('noDelegation1').value
      : '';
    const elaborated = this.form.get('elaborated').value
      ? this.form.get('elaborated').value
      : '';
    this.getEventComDonationAll(
      'COMPDON',
      captureDate,
      closeDate,
      cveAc,
      state,
      noDelegation1,
      elaborated
    );
    localStorage.setItem('cveAc', cveAc);
    localStorage.setItem('area', noDelegation1);
    localStorage.setItem('elaborated', elaborated);
    localStorage.setItem('state', state);
  }
  delegationToolbar: any = null;
  getDelegation(params: FilterParams) {
    params.addFilter('id', this.form.get('elaborated').value, SearchFilter.EQ);
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
    this.donationService.getEventComDonation(params).subscribe({
      next: resp => {
        this.donation = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.donation = new DefaultSelect();
      },
    });
  }

  getEventComDonationAll(
    actType?: string | number,
    captureDate?: string | number,
    closeDate?: string | number,
    cveAct?: string | number,
    estatusAct?: string | number,
    NoDelegation1?: string | number,
    elaborated?: string | number
  ) {
    this.loading = true;
    this.params.getValue()['filter.actType'] = `$eq:${actType}`;
    this.params.getValue()['filter.cveAct'] = `$eq:${cveAct}`;
    this.params.getValue()['filter.captureDate'] = `$eq:${captureDate}`;
    this.params.getValue()['filter.closeDate'] = `$eq:${closeDate}`;
    if (NoDelegation1) {
      this.params.getValue()['filter.NoDelegation1'] = `$eq:${NoDelegation1}`;
    }
    if (estatusAct) {
      this.params.getValue()['filter.estatusAct'] = `$eq:${estatusAct}`;
    }
    if (elaborated) {
      this.params.getValue()['filter.elaborated'] = `$eq:${elaborated}`;
    }
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.donationService.getEventComDonation(params).subscribe({
      next: resp => {
        this.data.load(resp.data);
        this.event = resp.data.filter(filt => {
          console.log(filt);
          this.fileNumber = filt.fileId;
          this.actaId = filt.actId;
        });
        localStorage.setItem('actaId', this.actaId);
        this.getGoodsByStatus(this.fileNumber);
        console.log(this.actaId);
        this.data.refresh();
        this.totalItems = resp.count;
        this.loading = false;
        //this.donation = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        //this.donation = new DefaultSelect();
        this.loading = false;
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
      },
    });
  }

  changeEvent(event: any) {
    if (event) {
      this.selectRow = true;
      this.excelValid = true;
      const data: any = event.data;
      this.getDetailComDonation(data.actId);
      console.log(event.data);
    }
  }
  getGoodsByStatus(id: number) {
    this.loading = true;
    // ACTUALIZA EL ESTADO DEL BIEN CUANDO BAJA A LA TABLA BIENES RELACIONADOS CON EL ACTA
    this.dataTableGood_ = [];
    this.dataTableGood.load(this.dataTableGood_);
    this.dataTableGood.refresh();
    console.log('CAMBIA COLOR');
    let params: any = {
      ...this.paramsList.getValue(),
      ...this.columnFilters,
    };
    console.log('1412212', params);
    params['sortBy'] = `goodNumber:DESC`;
    this.GoodprocessService_.GetMinuteDetailDelivery(id, params).subscribe({
      next: data => {
        this.bienes = data.data;

        // console.log('Bienes', this.bienes);

        let result = data.data.map(async (item: any) => {
          let obj = {
            vcScreen: 'FACTDESAPROBDONAC',
            pNumberGood: item.goodNumber,
          };
          const di_dispo = await this.getStatusScreen(obj);
          item['di_disponible'] = di_dispo;
          if (item.minutesKey) {
            item.di_disponible = 'N';
          }
          item['quantity'] = item.amount;
          item['recordId'] = item.minutesKey;
          item['id'] = item.goodNumber;
          // const acta: any = await this.getActaGoodExp(item.id, item.fileNumber);
          // // console.log('acta', acta);
          // item['acta_'] = acta;
        });

        Promise.all(result).then(item => {
          this.dataTableGood_ = this.bienes;
          this.dataTableGood.load(this.bienes);
          this.dataTableGood.refresh();
          // Define la función rowClassFunction para cambiar el color de las filas en función del estado de los bienes
          this.totalItems = data.count;
          this.loading = false;
          // // console.log(this.bienes);
        });
      },
      error: error => {
        this.loading = false;
        this.dataTableGood.load([]);
        this.dataTableGood.refresh();
        this.totalItems = 0;
      },
    });
  }
  async getStatusScreen(body: any) {
    return new Promise((resolve, reject) => {
      this.GoodprocessService_.getScreenGood(body).subscribe({
        next: async (state: any) => {
          if (state.data) {
            // console.log('di_disponible', state);
            resolve('S');
          } else {
            // console.log('di_disponible', state);
            resolve('N');
          }
        },
        error: () => {
          resolve('N');
        },
      });
    });
  }

  getDetailComDonation(idActa?: number | string) {
    this.loading2 = true;
    if (idActa) {
      this.params1.getValue()['filter.recordId'] = `$eq:${idActa}`;
    }
    let params = {
      ...this.params1.getValue(),
      ...this.columnFilter1,
    };
    this.donationService.getEventComDonationDetail(params).subscribe({
      next: resp => {
        console.log(resp.data);
        this.data1.load(resp.data);
        this.data1.refresh();
        this.totalItems1 = resp.count;
        this.loading2 = false;
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

  getDels($params: ListParams) {
    let params = new FilterParams();
    params.page = $params.page;
    params.limit = $params.limit;
    const area = this.form.controls['noDelegation1'].value;
    params.search = $params.text;
    this.getDelegations(params).subscribe();
  }
  getDelegations(params: FilterParams) {
    return this.delegationService.getAll(params.getParams()).pipe(
      catchError(error => {
        this.delegations$ = new DefaultSelect([], 0, true);
        return throwError(() => error);
      }),
      tap(response => {
        if (response.count > 0) {
          const name = this.form.get('noDelegation1').value;
          const data = response.data.filter(m => {
            return m.id == name;
          });
          this.form.get('noDelegation1').patchValue(data[0]);
        }
        this.delegations$ = new DefaultSelect(response.data, response.count);
      })
    );
  }
  updateSelectedIds(event: any) {
    if (this.form && this.form.get('noDelegation1')) {
      this.idDelegation = this.form.get('noDelegation1').value;
    }
  }
  selectedDetailActa(event: any) {
    console.log(event.data);
  }

  getEventComDonationExcel(body: IExportDetail) {
    this.loading = true;
    this.donationService.getExcel(body).subscribe({
      next: response => {
        this.downloadDocument(
          'Detalle de Eventos Donación',
          'excel',
          response.base64File
        );
      },
      error: error => {
        this.loading = false;
      },
    });
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
            resolve(resp);
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

  async getFaVal() {
    return new Promise((resolve, reject) => {
      let body = {
        pUser: this.authService.decodeToken().username,
        pIndicatorNumber: 12,
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

  async inicialice() {
    let access = await this.getAccessArea(new ListParams());
    console.log(access);
    let FaVal = await this.getFaVal();
    console.log(FaVal);
    let indicated = await this.getIndicator();
    console.log(indicated);

    if (indicated == null) {
      this.alert(
        'error',
        `El Usuario`,
        'No tiene privilegios para esta pantalla'
      );
      this.form.get('cveActa').disable();
      this.form.get('estatusAct').disable();
      this.form.get('noDelegation1').disable();
      this.form.get('elaborated').disable();
      this.validate = true;
      return;
    }
    const faVal: any = FaVal;
    const level = faVal[0].fa_val_usuario_ind;
    console.log(level);
    if (level == 0) {
      this.alert(
        'error',
        `El Usuario`,
        'No tiene privilegios para esta pantalla'
      );
      this.form.get('cveActa').disable();
      this.form.get('estatusAct').disable();
      this.form.get('noDelegation1').disable();
      this.form.get('elaborated').disable();

      this.validate = true;
      return;
    } else if (level == 2) {
      const delegation: any = access;
      const valDele = delegation[0].delegationNumber;
      this.form.get('noDelegation1').setValue(valDele);
    } else if (level == 3) {
      this.form
        .get('elaborated')
        .setValue(this.authService.decodeToken().username);
    }
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
    this.form.get('cveActa').setValue(null);
    this.validate = true;
    this.form.get('captureDate').setValue(null);
    this.form.get('closeDate').setValue(null);
    this.form.get('estatusAct').setValue([]);
    this.form.get('noDelegation1').setValue([]);
    this.form.get('noDelegation1').setValue([]);
    this.form.get('elaborated').setValue([]);
    this.getDetailComDonation(-1);
  }

  getRowSelec(event: any) {
    this.status = event;
    console.log(event);
  }

  exportAll(): void {
    this.body = {
      recordId: Number(this.actaId),
      typeActa: 'COMPDON',
      delegationId: Number(localStorage.getItem('noDelegation1')),
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
}
