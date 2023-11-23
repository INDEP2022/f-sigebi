import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { GoodSubtypeService } from 'src/app/core/services/catalogs/good-subtype.service';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { StatusGoodService } from 'src/app/core/services/ms-good/status-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ButtonColumnDocComponent } from 'src/app/shared/components/button-column-doc/button-column-doc.component';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import * as XLSX from 'xlsx';
import { ReportExposureForSaleModalComponent } from '../report-exposure-for-sale-modal/report-exposure-for-sale-modal.component';
import {
  CONSULT_COLUMNS,
  GOOD_COLUMNS,
  MONTH_COLUMNS,
  UNEXPOSED_GOODS_COLUMNS,
} from './columns';

@Component({
  selector: 'app-report-exposure-for-sale',
  templateUrl: './report-exposure-for-sale.component.html',
  styles: [
    `
      input[type='file']::file-selector-button {
        margin-right: 20px;
        border: none;
        background: #9d2449;
        padding: 10px 20px;
        border-radius: 5px;
        color: #fff;
        cursor: pointer;
        /* transition: background.2s ease-in-out; */
      }

      /* input[type = file]::file-selector-button:hover {
        background: #9D2449;
      } */
    `,
  ],
})
export class ReportExposureForSaleComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  form2: FormGroup = new FormGroup({});
  form3: FormGroup = new FormGroup({});
  show: boolean = false;
  showMonth: boolean = false;
  showConsult: boolean = false;
  showGood: boolean = false;
  valorDelInput: number;
  txtSearch: boolean = true;
  goodSearch: boolean = false;
  validTxt: boolean = true;

  typeGood = new DefaultSelect();
  subType = new DefaultSelect();
  delegation = new DefaultSelect();
  state = new DefaultSelect();

  idTypeGood: number = 0;
  totalAssets: number;

  columnFilters: any = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  data: LocalDataSource = new LocalDataSource();

  settings1 = { ...this.settings };
  columnFilters1: any = [];
  params1 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems1: number = 0;
  data1: LocalDataSource = new LocalDataSource();

  settings2 = { ...this.settings };
  columnFilters2: any = [];
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems2: number = 0;
  data2: LocalDataSource = new LocalDataSource();

  settings3 = { ...this.settings };
  columnFilters3: any = [];
  params3 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems3: number = 0;
  data3: LocalDataSource = new LocalDataSource();

  settings4 = { ...this.settings };
  columnFilters4: any = [];
  params4 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems4: number = 0;
  data4: LocalDataSource = new LocalDataSource();

  settings5 = { ...this.settings };
  columnFilters5: any = [];
  params5 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems5: number = 0;
  data5: LocalDataSource = new LocalDataSource();

  settings6 = { ...this.settings };
  columnFilters6: any = [];
  params6 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems6: number = 0;
  data6: LocalDataSource = new LocalDataSource();

  settings7 = { ...this.settings };
  columnFilters7: any = [];
  params7 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems7: number = 0;
  data7: LocalDataSource = new LocalDataSource();

  settings8 = { ...this.settings };
  columnFilters8: any = [];
  params8 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems8: number = 0;
  data8: LocalDataSource = new LocalDataSource();

  result: any;
  result2: any;
  result3: any;
  result4: any;

  validate: boolean = false;
  validate1: boolean = false;
  validate2: boolean = false;
  validate3: boolean = false;
  typeProccess: string;

  type: number | string;
  subtype: number | string;
  delegation1: number | string;
  state1: number | string;

  records: any[] = [];

  get filterGoods() {
    return this.form.get('filterGoods');
  }

  get filterText() {
    return this.form.get('filterText');
  }

  constructor(
    private fb: FormBuilder,
    private goodTypesService: GoodTypeService,
    private goodSubTypesService: GoodSubtypeService,
    private regionalDelegationService: RegionalDelegationService,
    private statusGoodService: StatusGoodService,
    private goodProcessService: GoodProcessService,
    private datePipe: DatePipe,
    private modalService: BsModalService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      hideSubHeader: false,
      columns: {
        office: {
          title: 'Detalle',
          width: '5%',
          type: 'custom',
          sort: false,
          filter: false,
          renderComponent: ButtonColumnDocComponent,
          onComponentInitFunction: (instance: any) => {
            instance.onClick.subscribe((row: any) => {
              //console.log(row);
              this.onSelectOffice(row);
            });
          },
        },
        ...UNEXPOSED_GOODS_COLUMNS,
      },
    };
    this.settings1 = {
      ...this.settings,
      actions: false,
      hideSubHeader: false,
      columns: {
        office: {
          title: 'Detalle',
          width: '5%',
          type: 'custom',
          sort: false,
          filter: false,
          renderComponent: ButtonColumnDocComponent,
          onComponentInitFunction: (instance: any) => {
            instance.onClick.subscribe((row: any) => {
              //console.log(row);
              this.onSelectOffice(row);
            });
          },
        },
        ...MONTH_COLUMNS,
      },
    };
    this.settings5 = {
      ...this.settings,
      actions: false,
      hideSubHeader: false,
      columns: {
        office: {
          title: 'Detalle',
          width: '5%',
          type: 'custom',
          sort: false,
          filter: false,
          renderComponent: ButtonColumnDocComponent,
          onComponentInitFunction: (instance: any) => {
            instance.onClick.subscribe((row: any) => {
              //console.log(row);
              this.onSelectOffice(row);
            });
          },
        },
        ...CONSULT_COLUMNS,
      },
    };
    this.settings7 = {
      ...this.settings,
      actions: false,
      hideSubHeader: false,
      columns: {
        office: {
          title: 'Detalle',
          width: '5%',
          type: 'custom',
          sort: false,
          filter: false,
          renderComponent: ButtonColumnDocComponent,
          onComponentInitFunction: (instance: any) => {
            instance.onClick.subscribe((row: any) => {
              //console.log(row);
              this.onSelectOffice(row);
            });
          },
        },
        ...GOOD_COLUMNS,
      },
    };
  }

  onSelectOffice(event: any) {
    const modalConfig = MODAL_CONFIG;
    const goodNumber: number = event.no_bien;
    modalConfig.initialState = {
      goodNumber,
      callback: (next: boolean) => {
        if (next) {
          if (this.typeProccess == 'TwoMonths') {
            this.reporTwoMonths();
          } else if (this.typeProccess == 'NoAttempt') {
            this.reportNoAttempt();
          }
        }
      },
    };
    this.modalService.show(ReportExposureForSaleModalComponent, modalConfig);
  }

  ngOnInit(): void {
    this.prepareForm();
    this.prepareForm2();
    this.prepareForm3();
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
              case 'id_estatusvta':
                searchFilter = SearchFilter.EQ;
                break;
              case 'no_bien':
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
          this.getReportNoAttempt(this.idTypeGood);
        }
      });

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
              case 'id_estatusvta':
                searchFilter = SearchFilter.EQ;
                break;
              case 'no_bien':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters1[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters1[field];
            }
          });
          this.params1 = this.pageFilter(this.params1);
          this.getReporTwoMonths(this.idTypeGood);
        }
      });

    this.data5
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
              case 'id_estatusvta':
                searchFilter = SearchFilter.EQ;
                break;
              case 'no_bien':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters5[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters5[field];
            }
          });
          this.params5 = this.pageFilter(this.params5);
          this.getConsultGood(
            this.type,
            this.subtype,
            this.delegation1,
            this.state1
          );
        }
      });
  }

  private prepareForm() {
    this.form = this.fb.group({
      subtype: [null, []],
      delegation: [null, []],
      status: [null, []],
      totalAssets: [null],
    });

    this.form.get('totalAssets').disable();

    /*setTimeout(() => {
      this.getTypeGood(new ListParams());
    }, 1000);*/
  }

  private prepareForm2() {
    this.form2 = this.fb.group({
      filterGoods: [],
      filterText: [],
    });
    this.form2.get('filterGoods').setValue('0');
  }

  private prepareForm3() {
    this.form3 = this.fb.group({
      typeGood: [null, []],
    });
  }

  onInputChange() {
    const filtertxt = this.form2.get('filterGoods').value;
    if (filtertxt == 1) {
      this.txtSearch = true;
      this.goodSearch = false;
      if (this.form.valid) {
        this.form.reset();
      }
    } else if (filtertxt == 0) {
      this.txtSearch = false;
      this.goodSearch = true;

      this.data7.load([]);
      this.data7.refresh();
      this.totalItems7 = 0;
      this.showGood = false;

      this.form2.get('filterText').setValue('');
      this.validTxt = true;
    }
    //console.log(event.target);
  }

  getTypeGood(params: ListParams) {
    console.log(params.text);
    if (params.text) {
      if (!isNaN(parseInt(params.text))) {
        params['filter.typeNumber'] = `$eq:${params.text}`;
        params['search'] = '';
      } else if (typeof params.text === 'string') {
        params['filter.typeDesc'] = `$ilike:${params.text}`;
      }
    }
    this.goodProcessService.getVGoodTpye(params).subscribe({
      next: resp => {
        console.log(resp.data);
        this.result = resp.data.map(async (item: any) => {
          item['numDesc'] = item.typeNumber + ' - ' + item.typeDesc;
        });
        this.typeGood = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.typeGood = new DefaultSelect();
      },
    });
  }

  changeTypeGood(event: any) {
    if (event) {
      console.log(event);
      this.idTypeGood = event.typeNumber;
      this.form.get('subtype').setValue(null);
      //this.form.get('subtype').enable();
      this.getSubTypeGood(new ListParams(), event.typeNumber);
    } else {
      this.form.get('subtype').setValue(null);
      //this.form.get('subtype').disable();
      setTimeout(() => {
        this.getTypeGood(new ListParams());
      }, 1000);
    }
  }

  getSubTypeGood(params: ListParams, idType?: number | string) {
    console.log(params.text);
    if (idType) {
      params['filter.typeNumber'] = `$eq:${idType}`;
    }
    if (params.text) {
      if (!isNaN(parseInt(params.text))) {
        params['filter.subTypeNumber'] = `$eq:${params.text}`;
        params['search'] = '';
      } else if (typeof params.text === 'string') {
        params['filter.subTypeDesc'] = `$ilike:${params.text}`;
      }
    }
    this.goodProcessService.getVGoodTpye(params).subscribe({
      next: resp => {
        console.log(resp.data);
        this.result2 = resp.data.map(async (item: any) => {
          item['numSubDesc'] = item.subTypeNumber + ' - ' + item.subTypeDesc;
        });
        this.subType = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.subType = new DefaultSelect();
      },
    });
  }

  changeSubTypeGood(event: any) {
    if (event) {
      console.log(event);
    } else {
      /*setTimeout(() => {
        this.getSubTypeGood(new ListParams(), this.idTypeGood);
      }, 1000);*/
    }
  }
  getDelegation(params: ListParams) {
    if (params.text) {
      if (!isNaN(parseInt(params.text))) {
        params['filter.id'] = `$eq:${params.text}`;
        params['search'] = '';
      } else if (typeof params.text === 'string') {
        params['filter.description'] = `$ilike:${params.text}`;
      }
    }
    this.regionalDelegationService.getAll(params).subscribe({
      next: resp => {
        this.result3 = resp.data.map(async (item: any) => {
          item['idDescription'] = item.id + ' - ' + item.description;
        });
        this.delegation = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.delegation = new DefaultSelect();
      },
    });
  }
  changeDelegation(event: any) {
    if (event) {
      console.log(event);
    } else {
      setTimeout(() => {
        this.getDelegation(new ListParams());
      }, 1000);
    }
  }
  getStatusGood(params: ListParams) {
    if (params.text) {
      params['search'] = `${params.text}`;
      //params['filter.status'] = `$ilike:${params.text}`;
    }
    this.statusGoodService.getAll(params).subscribe({
      next: resp => {
        console.log(resp.data);
        this.result4 = resp.data.map(async (item: any) => {
          item['statusDescription'] = item.status + ' - ' + item.description;
        });
        this.state = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.state = new DefaultSelect();
      },
    });
  }
  changeStatusGood(event: any) {
    if (event) {
      console.log(event);
    } else {
      setTimeout(() => {
        this.getStatusGood(new ListParams());
      }, 1000);
    }
  }

  onSubmit() {
    if (this.form.valid || this.form3.valid) {
      this.form.reset();
      this.form3.reset();

      this.data7.load([]);
      this.data7.refresh();
      this.totalItems7 = 0;

      this.data.load([]);
      this.data.refresh();
      this.totalItems = 0;

      this.data1.load([]);
      this.data1.refresh();
      this.totalItems1 = 0;

      this.data5.load([]);
      this.data5.refresh();
      this.totalItems5 = 0;
    }
    console.warn('Your order has been submitted');
  }

  async chargeFile(event: any) {
    if (event) {
      //console.log(event);
      const file = event.target.files[0];

      let readFile = await this.arrayTxt(file);
      /*if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          this.records = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          console.log(this.records);
        };
        reader.readAsArrayBuffer(file);
      }*/
      this.validTxt = false;
      console.log(readFile);
    } else {
      this.validTxt = true;
    }
  }

  async arrayTxt(file: any) {
    return new Promise((resolve, reject) => {
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          this.records = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          //console.log(this.records);
          console.log(this.records);
          resolve(this.records);
        };
        reader.readAsArrayBuffer(file);
      } else {
        resolve(null);
      }
    });
  }

  reporGood() {
    if (this.form2.get('filterText').value) {
      if (this.records.length === 0) {
        this.alert('warning', 'No se encontraron registros', ``);
      } else {
        this.show = false;
        this.showMonth = false;
        this.showConsult = false;
        this.showGood = true;
        console.log(this.records);
        this.params7
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getReportGood(this.records));
      }
    } else {
      this.alert('warning', 'Debe insertar un archivo .txt', ``);
    }
  }

  getReportGood(array: any) {
    this.loading = true;
    if (array) {
      this.params7.getValue()['filter.no_bien'] = `$in:${array}`;
    }
    let param = {
      ...this.params7.getValue(),
      ...this.columnFilters7,
    };
    this.goodProcessService.getSpObtnxGood(param).subscribe({
      next: resp => {
        this.data7.load(resp.data);
        this.data7.refresh();
        this.totalItems7 = resp.count;
        this.loading = false;
        this.validate3 = true;
        this.typeProccess = 'Good';
      },
      error: err => {
        this.alert(
          'warning',
          'No se encontraron registros',
          `Con el criterio de búsqueda seleccionado`
        );
        this.loading = false;
        this.data7.load([]);
        this.data7.refresh();
        this.totalItems7 = 0;
      },
    });
  }

  reportNoAttempt() {
    if (this.form3.get('typeGood').value) {
      if (this.idTypeGood) {
        this.data1.load([]);
        this.data1.refresh();
        this.totalItems1 = 0;

        this.data5.load([]);
        this.data5.refresh();
        this.totalItems5 = 0;

        this.show = true;
        this.showMonth = false;
        this.showConsult = false;
        this.showGood = false;

        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() =>
            this.getReportNoAttempt(this.idTypeGood, '', '', '')
          );
      }
    } else {
      this.alert('warning', 'Debe insertar un tipo bien', '');
    }
  }

  getReportNoAttempt(
    typeGood?: number | string,
    subType?: number | string,
    delegation?: number | string,
    status?: number | string
  ) {
    this.loading = true;
    if (typeGood) {
      this.params.getValue()['filter.no_tipo'] = `$eq:${typeGood}`;
    }
    let param = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.goodProcessService.getReportNingevent(param).subscribe({
      next: resp => {
        this.data.load(resp.data);
        this.data.refresh();
        this.totalItems = resp.count;
        this.loading = false;
        this.validate = true;
        this.typeProccess = 'NoAttempt';
      },
      error: err => {
        this.alert(
          'warning',
          'No se encontraron registros',
          `Con el criterio de búsqueda seleccionado`
        );
        this.loading = false;
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
      },
    });
    //Endpoint en construccion
    /*if (this.totalAssets > 0) {
      //this.totalAssets = count
      this.form.get('totalAssets').setValue(this.totalAssets);
    } else {
      
    }*/
  }

  reporTwoMonths() {
    if (this.form3.get('typeGood').value) {
      if (this.idTypeGood) {
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;

        this.data5.load([]);
        this.data5.refresh();
        this.totalItems5 = 0;

        this.showMonth = true;
        this.show = false;
        this.showConsult = false;
        this.showGood = false;
        this.params1
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getReporTwoMonths(this.idTypeGood, '', '', ''));
      }
    } else {
      this.alert('warning', 'Debe insertar un tipo bien', '');
    }
  }

  getReporTwoMonths(
    typeGood?: number | string,
    subType?: number | string,
    delegation?: number | string,
    status?: number | string
  ) {
    this.loading = true;
    if (typeGood) {
      this.params1.getValue()['filter.no_tipo'] = `$eq:${typeGood}`;
    }
    let param = {
      ...this.params1.getValue(),
      ...this.columnFilters1,
    };

    this.goodProcessService.getReportMonth(param).subscribe({
      next: resp => {
        this.data1.load(resp.data);
        this.data1.refresh();
        this.totalItems1 = resp.count;
        this.loading = false;
        this.validate1 = true;
        this.typeProccess = 'TwoMonths';
      },
      error: err => {
        this.alert(
          'warning',
          'No se encontraron registros',
          `Con el criterio de búsqueda seleccionado`
        );
        this.loading = false;
        this.data1.load([]);
        this.data1.refresh();
        this.totalItems1 = 0;
      },
    });

    //Endpoint en construccion
    /*if (this.totalAssets > 0) {
      //this.totalAssets = count
      this.form.get('totalAssets').setValue(this.totalAssets);
    } else {
      this.alert(
        'warning',
        'No se encontraron registros',
        `Con el criterio de búsqueda seleccionado`
      );
    }*/
  }

  consult() {
    if (
      this.form3.get('typeGood').value &&
      this.form.get('subtype').value &&
      this.form.get('delegation').value &&
      this.form.get('status').value
    ) {
      this.data1.load([]);
      this.data1.refresh();
      this.totalItems1 = 0;

      this.data.load([]);
      this.data.refresh();
      this.totalItems = 0;

      this.showMonth = false;
      this.show = false;
      this.showConsult = true;
      this.showGood = false;
      //this.show = !this.show;
      this.type = this.form3.get('typeGood').value;
      this.subtype = this.form.get('subtype').value;
      this.delegation1 = this.form.get('delegation').value;
      this.state1 = this.form.get('status').value;
      this.params5
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() =>
          this.getConsultGood(
            this.type,
            this.subtype,
            this.delegation1,
            this.state1
          )
        );
    } else {
      this.alert('warning', 'Debe llenar todos los campos', '');
    }
  }

  getConsultGood(
    typeGood?: number | string,
    subType?: number | string,
    delegation?: number | string,
    status?: number | string
  ) {
    //LLamar al endpoint
    //this.totalAssets = count
    this.loading = true;
    if (typeGood && subType && delegation && status) {
      this.params5.getValue()['filter.TypeNumber'] = `$eq:${typeGood}`;
      this.params5.getValue()['filter.subTypeNumber'] = `$eq:${subType}`;
      this.params5.getValue()['filter.coordAdminNumber'] = `$eq:${delegation}`;
      this.params5.getValue()['filter.status'] = `$eq:${status}`;
    }
    let param = {
      ...this.params5.getValue(),
      ...this.columnFilters5,
    };
    this.goodProcessService.getCheckAllGoodPag(param).subscribe({
      next: resp => {
        this.data5.load(resp.data);
        this.data5.refresh();
        this.totalItems5 = resp.count;
        this.loading = false;
        this.validate2 = true;
        this.typeProccess = 'ConsultGood';
      },
      error: err => {
        this.alert(
          'warning',
          'No se encontraron registros',
          `Con el criterio de búsqueda seleccionado`
        );
        this.loading = false;
        this.data5.load([]);
        this.data5.refresh();
        this.totalItems5 = 0;
      },
    });
    /*if (this.totalAssets > 0) {
      this.form.get('totalAssets').setValue(this.totalAssets);
    } else {
      this.alert(
        'warning',
        'No se encontraron registros',
        `Con el criterio de búsqueda seleccionado`
      );
    }*/
  }

  rowsSelected(event: any) {}

  rowsSelected1(event: any) {}

  onExportExcelGood() {
    if (this.records) {
      this.params8.getValue()['filter.no_bien'] = `$in:${this.records}`;
    }
    let param = {
      ...this.params8.getValue(),
      ...this.columnFilters8,
    };
    param['limit'] = '';
    const date = new Date(Date());
    const dateFormat = this.datePipe.transform(date, 'dd-MM-yyyy HH:mm:ss');
    this.goodProcessService.getSpObtnxGoodExcel(param).subscribe({
      next: resp => {
        this.downloadDocument(
          `Consulta de bienes sin vender al - ${dateFormat}`,
          'excel',
          resp.base64File
        );
      },
      error: err => {
        console.log(err);
      },
    });
  }

  onExportExcelConsult() {
    if (this.idTypeGood) {
      this.params6.getValue()['filter.no_tipo'] = `$eq:${this.type}`;
      this.params6.getValue()['filter.no_subtipo'] = `$eq:${this.subtype}`;
      this.params6.getValue()[
        'filter.no_coord_admin'
      ] = `$eq:${this.delegation1}`;
      this.params6.getValue()['filter.estatus'] = `$ilike:${this.state1}`;
    }
    let param = {
      ...this.params6.getValue(),
      ...this.columnFilters6,
    };
    param['limit'] = '';
    const date = new Date(Date());
    const dateFormat = this.datePipe.transform(date, 'dd-MM-yyyy HH:mm:ss');
    this.goodProcessService.getCheckAllGoodPagExcel(param).subscribe({
      next: resp => {
        this.downloadDocument(
          `Consulta de bienes sin vender al - ${dateFormat}`,
          'excel',
          resp.base64File
        );
      },
      error: err => {
        console.log(err);
      },
    });
  }

  onExportExcel() {
    if (this.idTypeGood) {
      this.params3.getValue()['filter.no_tipo'] = `$eq:${this.idTypeGood}`;
    }
    let param = {
      ...this.params3.getValue(),
      ...this.columnFilters3,
    };
    //param['limit'] = '';
    const date = new Date(Date());
    const dateFormat = this.datePipe.transform(date, 'dd-MM-yyyy HH:mm:ss');
    this.goodProcessService.getReportNingeventExcel(param).subscribe({
      next: resp => {
        this.downloadDocument(
          `Consulta de bienes sin vender al - ${dateFormat}`,
          'excel',
          resp.base64File
        );
      },
      error: err => {
        console.log(err);
      },
    });
  }

  onExportExcelMonth() {
    if (this.idTypeGood) {
      this.params4.getValue()['filter.no_tipo'] = `$eq:${this.idTypeGood}`;
    }
    let param = {
      ...this.params4.getValue(),
      ...this.columnFilters4,
    };
    param['limit'] = '';
    const date = new Date(Date());
    const dateFormat = this.datePipe.transform(date, 'dd-MM-yyyy HH:mm:ss');
    this.goodProcessService.getReportMonthExcel(param).subscribe({
      next: resp => {
        this.downloadDocument(
          `Consulta de bienes sin vender al - ${dateFormat}`,
          'excel',
          resp.base64File
        );
      },
      error: err => {
        console.log(err);
      },
    });
  }

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
