import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, skip, takeUntil, tap } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { DonationService } from 'src/app/core/services/ms-donationgood/donation.service';
import { EventProgrammingService } from 'src/app/core/services/ms-event-programming/event-programing.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { IndUserService } from 'src/app/core/services/ms-users/ind-user.service';
import { SegAcessXAreasService } from 'src/app/core/services/ms-users/seg-acess-x-areas.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { APPROVAL_COLUMNS, GOOD_COLUMNS } from './approval-columns';

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
  selectRow: boolean = false;
  delegation: string;
  totalItems: number = 0;
  totalItems1: number = 0;

  params1 = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilter: any = [];
  columnFilter1: any = [];
  donation = new DefaultSelect();
  user = localStorage.getItem('username');

  area: string;
  validate: boolean = true;
  columnFilters: any = [];

  status: string = null;
  cveEvent: string;

  settings1 = { ...this.settings };
  loading2: boolean = false;
  constructor(
    private fb: FormBuilder,
    private donationService: DonationService,
    private router: Router,
    private excelService: ExcelService,
    private serviceUser: UsersService,
    private regionalDelegacionService: RegionalDelegationService,
    private segAccessXAreas: SegAcessXAreasService,
    private eventProgrammingService: EventProgrammingService,
    private indUserService: IndUserService,
    private delegationService: DelegationService,
    private securityService: SecurityService,
    private authService: AuthService
  ) {
    super();
    this.settings = { ...this.settings, actions: false };
    this.settings.columns = APPROVAL_COLUMNS;
    this.settings.hideSubHeader = false;

    this.settings1 = {
      ...this.settings,
      hideSubHeader: false,
      columns: { ...GOOD_COLUMNS },
    };
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
              if (filter.field == 'captureDate') {
                var fecha1 = filter.search;
                var ano1 = fecha1.getFullYear();
                var mes1 = ('0' + (fecha1.getMonth() + 1)).slice(-2);
                var dia1 = ('0' + fecha1.getDate()).slice(-2);
                var fechaFormateada1 = ano1 + '-' + mes1 + '-' + dia1;
                this.columnFilters[
                  field
                ] = `${searchFilter}:${fechaFormateada1}`;
              } else {
                this.columnFilters[field] = `${searchFilter}:${filter.search}`;
              }

              //this.params.value.page = 1;
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

    //this.getUsers(new ListParams());
    const user: any = this.authService.decodeToken() as any;
    this.user = user.username;
    this.delegation = this.authService.decodeToken().delegacionreg;
    this.area = this.authService.decodeToken().department;
    // this.form.get('noDelegation1').setValue(this.delegation);
    // this.form.get('elaborated').setValue(this.user);
    console.log(this.user, user);
    // console.log(this.delegation);
    this.inicialice();
  }

  initForm() {
    this.form = this.fb.group({
      cveActa: [null, []],
      estatusAct: [null, []],
      noDelegation1: [null, [Validators.pattern(STRING_PATTERN)]],
      elaborated: [null, []],
    });
    // this.form.get('elaborated').disable();
    // this.form.get('noDelegation1').disable();
    this.getEventComDonation(new ListParams());
  }

  onSubmit() {}

  filterButton() {
    //this.params.value.page = 1;
    //this.search(false);
    this.response = true;
    const state = this.status ? this.status : '';
    const cveAc = this.form.get('cveActa').value
      ? this.form.get('cveActa').value
      : '';
    const noDelegation1 = this.form.get('noDelegation1').value
      ? this.form.get('noDelegation1').value
      : '';
    const elaborated = this.form.get('elaborated').value
      ? this.form.get('elaborated').value
      : '';
    this.getEventComDonationAll(
      'COMPDON',
      state,
      cveAc,
      noDelegation1,
      elaborated
    );
  }
  /*getUserDelegation() {
    return firstValueFrom(
      this.segAccessXAreas.getDelegationUser(this.user).pipe(
        catchError(() => of('0')),
        map(res => res.no_delegacion)
      )
    );
  }*/
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
    estatusAct?: string | number,
    cveAct?: string | number,
    NoDelegation1?: string | number,
    elaborated?: string | number
  ) {
    this.loading = true;
    // this.params.getValue()['filter.actType'] = `$eq:${actType}`;
    if (cveAct) this.params.getValue()['filter.cveAct'] = `$eq:${cveAct}`;
    // else
    //   delete this.params.getValue()['filter.cveAct']
    // if (NoDelegation1) {
    //   this.params.getValue()['filter.NoDelegation1'] = `$eq:${NoDelegation1}`;
    // }
    if (estatusAct) {
      this.params.getValue()['filter.estatusAct'] = `$eq:${estatusAct}`;
      // }else{
      //   delete this.params.getValue()['filter.estatusAct']
    }
    // if (elaborated) {
    //   this.params.getValue()['filter.elaborated'] = `$eq:${elaborated}`;
    // }
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.donationService.getEventComDonation(params).subscribe({
      next: resp => {
        this.data.load(resp.data);
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
      const data: any = event.data;
      this.getDetailComDonation(data.actId);
      console.log(event.data);
    }
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
          origin: this.origin,
          recordId: this.params1.getValue()['filter.recordId'],
          cveEvent: this.cveEvent,
          area: this.area,
        },
      }
    );
  }
  // getDelegationRegional(id: number | string) {
  //   const params = new ListParams();
  //   params['filter.id'] = `$eq:${id}`;
  //   this.regionalDelegacionService.getAll(params).subscribe({
  //     next: resp => {
  //       this.delegation = resp.data[0].id + ' - ' + resp.data[0].description;
  //     },
  //     error: error => { },
  //   });
  // }

  /*getEventComDonationExcel(
    actType?: string | number,
    estatusAct?: string | number,
    cveAct?: string | number,
    NoDelegation1?: string | number,
    elaborated?: string | number
  ) {
    this.loading = true;
    this.params2.getValue()['filter.actType'] = `$eq:${actType}`;
    this.params2.getValue()['filter.cveAct'] = `$eq:${cveAct}`;
    if (NoDelegation1) {
      this.params2.getValue()['filter.NoDelegation1'] = `$eq:${NoDelegation1}`;
    }
    if (estatusAct) {
      this.params2.getValue()['filter.estatusAct'] = `$eq:${estatusAct}`;
    }
    if (elaborated) {
      this.params2.getValue()['filter.elaborated'] = `$eq:${elaborated}`;
    }
    let params = {
      ...this.params2.getValue()
    };
    this.donationService.getExcel(params).subscribe({
      next: response => {
        this.downloadDocument(
          'Aprobaci&oacute;n para Donaci&oacute;n',
          'excel',
          response.base64File
        );
      },
      error: error => {
        this.loading = false;
      },
    });
  }*/
  selectedDetailActa(event: any) {
    console.log(event.data);
  }

  getEventComDonationExcel(cveAct?: string | number) {
    this.loading = true;
    this.params2.getValue()['filter.cveAct'] = `$eq:${cveAct}`;
    let params = {
      ...this.params2.getValue(),
    };
    this.donationService.getExcel().subscribe({
      next: response => {
        this.downloadDocument(
          'Aprobación para Donación',
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
        user: this.user,
        indicatorNumber: 12,
      };
      this.serviceUser.getAllIndicator(body).subscribe({
        next: resp => {
          //console.log(resp);
          if (resp.data) {
            resolve(resp);
          } else {
            resolve(null);
          }
        },
        error: err => {
          //console.log(err);
          resolve(null);
        },
      });
    });
  }

  async getFaVal() {
    return new Promise((resolve, reject) => {
      let body = {
        pUser: this.user,
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
      params['filter.user'] = `$eq:${this.user}`;
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
      this.validate = true;
      return;
    } else if (level == 2) {
      const delegation: any = access;
      const valDele = delegation[0].delegationNumber;
      this.form.get('noDelegation1').setValue(valDele);
    } else if (level == 3) {
      this.form.get('elaborated').setValue(this.user);
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
    this.status = null;
    this.form.get('estatusAct').setValue(null);
    this.getDetailComDonation(-1);
  }

  getRowSelec(event: any) {
    this.status = event;
    console.log(event);
  }

  exportAll(): void {
    //this.loading = true;
    const state = this.status ? this.status : '';
    const cveAc = this.cveEvent;
    const noDelegation1 = this.form.get('noDelegation1').value
      ? this.form.get('noDelegation1').value
      : '';
    const elaborated = this.form.get('elaborated').value
      ? this.form.get('elaborated').value
      : '';
    /*this.getEventComDonationExcel(
      //'COMPDON',
      state,
      cveAc
      //noDelegation1,
      //elaborated
    );*/
    this.getEventComDonationExcel(
      //'COMPDON',
      cveAc
      //noDelegation1,
      //elaborated
    );
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
