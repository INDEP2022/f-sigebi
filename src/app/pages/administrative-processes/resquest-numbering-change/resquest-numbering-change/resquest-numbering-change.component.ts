import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
import {
  BsModalRef,
  BsModalService,
  ModalDirective,
} from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  catchError,
  firstValueFrom,
  Observable,
  skip,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IHistoryGood } from 'src/app/core/models/administrative-processes/history-good.model';
import { IGood, NumerGood_ } from 'src/app/core/models/good/good.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { SafeService } from 'src/app/core/services/catalogs/safe.service';
import { WarehouseService } from 'src/app/core/services/catalogs/warehouse.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { GoodSpentService } from 'src/app/core/services/ms-expense/good-expense.service';
import { ExpenseService } from 'src/app/core/services/ms-expense_/good-expense.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { NumeraryService } from 'src/app/core/services/ms-numerary/numerary.service';
import { StatusXScreenService } from 'src/app/core/services/ms-screen-status/statusxscreen.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  NUM_POSITIVE_LETTERS,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { AbandonmentsDeclarationTradesService } from 'src/app/pages/juridical-processes/abandonments-declaration-trades/service/abandonments-declaration-trades.service';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

export interface Example {
  number: number;
  description: string;
}

export interface ExampleData {
  numberGood: number;
  description: string;
  quantity: number;
  status: string;
  appraisedVig: string;
  amount: number;
  totalExpenses: number;
  numberFile: string;
  preliminaryInquiry: string;
  causePenal: string;
}

export interface ExampleData1 {
  nuberGood: number;
  legalstatus: string;
  reason: string;
}

@Component({
  selector: 'app-resquest-numbering-change',
  templateUrl: './resquest-numbering-change.component.html',
  // styles: [
  //   `
  //     .row-verde {
  //       background-color: green;
  //       font-weight: bold;
  //     }

  //     .row-negro {
  //       background-color: black;
  //       font-weight: bold;
  //     }

  //     .form-group.form-static-label.form-danger label.float-label {
  //       color: blue;
  //     }

  //   `,
  // ],

  styleUrls: ['./resquest-numbering-change.component.scss'],
})
export class ResquestNumberingChangeComponent
  extends BasePage
  implements OnInit
{
  selectedGooods: any[] = [];
  selectedGooodsValid: any[] = [];

  totalItems: number = 0;
  totalItems1: number = 0;
  totalItems2: number = 0;
  columnFilters: any = [];
  columnFilters2: any = [];
  people$: Observable<any[]>;
  selectedPeople: any = [];

  esta: string;
  es: string;

  //params = new BehaviorSubject<ListParams>(new ListParams());
  params = new BehaviorSubject<ListParams>(new ListParams());
  params1 = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  itemsBoveda = new DefaultSelect();
  itemsDelegation = new DefaultSelect();
  itemsUser = new DefaultSelect();
  itemsUser1 = new DefaultSelect();
  itemName = new DefaultSelect();
  itemsAlmacen = new DefaultSelect();
  columnFilters4: any = [];
  idSolicitud: any = null;
  selectGood: any = [];
  selectCamNum: any = [];
  dataCamNum: any = [];
  dataGood: any = [];
  validate: boolean = false;
  selectedCars = [3];
  rowClass: string = 'verde';

  params4 = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  data1: LocalDataSource = new LocalDataSource();
  data2: LocalDataSource = new LocalDataSource();
  data3: LocalDataSource = new LocalDataSource();
  tiposData = new DefaultSelect();
  @ViewChild('modal', { static: false }) modal?: ModalDirective;
  loadingText = 'Cargando ...';
  @Input() formControlName: string = 'folioEscaneo';

  //Data Table

  //Data Table final
  settings2 = {
    ...this.settings,
    actions: false,
    columns: {
      conceptSpentNumber: {
        title: 'Concepto',
        width: '10%',
        sort: false,
      },
      description: {
        title: 'Descripción',
        width: '30%',
        sort: false,
      },
      exercisedDate: {
        title: 'Fecha',
        width: '30%',
        sort: false,
        valuePrepareFunction: (text: string) => {
          console.log('text', text);
          return `${
            text ? text.split('T')[0].split('-').reverse().join('/') : ''
          }`;
        },
        filter: {
          type: 'custom',
          component: CustomDateFilterComponent,
        },
      },
      amount: {
        title: 'Monto',
        width: '30%',
        sort: false,
      },
      dirInd: {
        title: 'Dir/Ind',
        width: '30%',
        sort: false,
      },
    },
  };
  settings1 = {
    ...this.settings,
    // actions: false,
    // hideSubHeader: false,
    // selectMode: 'multi',
    columns: {
      name: {
        filter: false,
        sort: false,
        title: 'Selección',
        type: 'custom',
        showAlways: true,
        valuePrepareFunction: (isSelected: boolean, row: NumerGood_) =>
          this.isGoodSelectedValid(row),
        renderComponent: CheckboxElementComponent,
        onComponentInitFunction: (instance: CheckboxElementComponent) =>
          this.onGoodSelectValid(instance),
      },
      goodNumber: {
        title: 'No. Bien',
        width: '30%',
        sort: false,
      },
      situationlegal: {
        title: 'Situación Jurídica',
        width: '30%',
        sort: false,
      },
      reasonApplication: {
        title: 'Motivo',
        width: '30%',
        sort: false,
      },
    },
    rowClassFunction: (row: any) => {
      return 'bg-white text-black';
    },
  };

  // data3: ExampleData1[] = [
  //   {
  //     nuberGood: 1,
  //     legalstatus: 'Situacion juridica 1',
  //     reason: 'Motivo 1',
  //   },
  // ];

  //Reactive Forms
  form: FormGroup;
  authorizeDate: any;
  loading2: boolean = false;
  datePipe: any;

  get legalStatus() {
    return this.form.get('legalStatus');
  }
  get delegation() {
    return this.form.get('delegation');
  }
  get warehouse() {
    return this.form.get('warehouse');
  }
  get vault() {
    return this.form.get('vault');
  }
  get type() {
    return this.form.get('type');
  }

  //Reactive Forms
  formaplicationData: FormGroup;
  get dateRequest() {
    return this.formaplicationData.get('dateRequest');
  }
  get numberRequest() {
    return this.formaplicationData.get('numberRequest');
  }
  get usrRequest() {
    return this.formaplicationData.get('usrRequest');
  }
  get nameRequest() {
    return this.formaplicationData.get('nameRequest');
  }
  get charge() {
    return this.formaplicationData.get('charge');
  }
  get proposedProcedure() {
    return this.formaplicationData.get('proposedProcedure');
  }
  get usrAuthorized() {
    return this.formaplicationData.get('usrAuthorized');
  }
  get nameAuthorized() {
    return this.formaplicationData.get('nameAuthorized');
  }
  get causeAuthorized() {
    return this.formaplicationData.get('causeAuthorized');
  }
  get dateAutorized() {
    return this.formaplicationData.get('dateAutorized');
  }

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  @ViewChild('scrollContainer2') scrollContainer2!: ElementRef;
  formTotal: FormGroup;

  delegationNumber: any = null;
  subdelegation: any = null;
  areaDict: any = null;
  constructor(
    private fb: FormBuilder,
    private safeService: SafeService,
    private delegationService: DelegationService,
    private warehouseService: WarehouseService,
    private goodprocessService: GoodprocessService,
    private readonly goodServices: GoodService,
    private expenseService: GoodSpentService,
    private modalRef: BsModalRef,
    private numeraryService: NumeraryService,
    private siabService: SiabService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private securityService: SecurityService,
    private token: AuthService,
    private readonly historyGoodService: HistoryGoodService,
    private statusXScreenService: StatusXScreenService,
    private expenseService_: ExpenseService,
    private abandonmentsService: AbandonmentsDeclarationTradesService
  ) {
    super();
    this.esta = '';
    this.es = '';

    this.settings1.hideSubHeader = false;
    this.settings1.actions.delete = false;
    this.settings1.actions.add = false;
    this.settings1.actions.edit = false;

    this.settings = {
      ...this.settings,
      // selectedRowIndex: -1,
      // mode: 'external',

      // selectMode: 'multi',
      actions: {
        columnTitle: 'Visualizar',
        position: 'right',
        delete: false,
      },
      edit: {
        editButtonContent: '<i class="fa fa-eye text-white mx-2"></i>',
      },
      columns: {
        name: {
          filter: false,
          sort: false,
          title: 'Selección',
          type: 'custom',
          showAlways: true,
          valuePrepareFunction: (isSelected: boolean, row: IGood) =>
            this.isGoodSelected(row),
          renderComponent: CheckboxElementComponent,
          onComponentInitFunction: (instance: CheckboxElementComponent) =>
            this.onGoodSelect(instance),
        },
        id: {
          title: 'No. Bien',
          width: '10%',
          sort: false,
        },
        description: {
          title: 'Descripción',
          width: '30%',
          sort: false,
        },
        quantity: {
          title: 'Cantidad',
          width: '10%',
          sort: false,
        },
        status: {
          title: 'Estatus',
          width: '10%',
          sort: false,
        },
        appraisedValue: {
          title: 'Avalúo Vigente',
          width: '10%',
          sort: false,
        },
        armor: {
          title: 'Monto',
          width: '10%',
          sort: false,
        },
        totalExpenses: {
          title: 'Total Gastos',
          width: '20%',
          sort: false,
        },
        expedienteid: {
          title: 'No. Expediente',
          width: '10%',
          sort: false,
          valuePrepareFunction: (cell: any, row: any) => {
            if (row.expediente == null) {
              return '';
            } else {
              return row.expediente.id;
            }
          },
        },

        expedientepreliminaryInquiry: {
          title: 'Averiguación Previa',
          width: '10%',
          sort: false,
          valuePrepareFunction: (cell: any, row: any) => {
            if (row.expediente == null) {
              return '';
            } else {
              return row.expediente.preliminaryInquiry;
            }
          },
        },
        expedientecriminalCase: {
          title: 'Causa Penal',
          width: '40%',
          sort: false,
          valuePrepareFunction: (cell: any, row: any) => {
            if (row.expediente == null) {
              return '';
            } else {
              return row.expediente.criminalCase;
            }
          },
        },
      },
      rowClassFunction: (row: any) => {
        if (row.data.di_disponible == 'S') {
          return 'bg-success text-white';
        } else {
          return 'bg-dark text-white';
        }

        // if (row.data.status === 'CNE') {
        //   return 'bg-success text-white';
        // } else if (
        //   row.data.status === 'RRE' ||
        //   row.data.status === 'VXR' ||
        //   row.data.status === 'DON'
        // ) {
        //   return 'bg-dark text-white';
        // } else {
        //   return 'bg-success text-white';
        // }
      },
    };

    this.settings.hideSubHeader = false;
    this.settings.actions.delete = false;
    this.settings.actions.add = false;

    this.settings2.hideSubHeader = false;
  }

  onGoodSelect(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => this.goodSelectedChange(data.row, data.toggle),
    });
  }
  isGoodSelected(_good: IGood) {
    const exists = this.selectedGooods.find(good => good.id == _good.id);
    return !exists ? false : true;
  }
  goodSelectedChange(good: IGood, selected: boolean) {
    if (selected) {
      this.selectedGooods.push(good);
    } else {
      this.selectedGooods = this.selectedGooods.filter(
        _good => _good.id != good.id
      );
    }
  }

  onGoodSelectValid(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => this.goodSelectedChangeValid(data.row, data.toggle),
    });
  }
  isGoodSelectedValid(_good: NumerGood_) {
    const exists = this.selectedGooodsValid.find(
      good => good.goodNumber == _good.goodNumber
    );
    return !exists ? false : true;
  }
  goodSelectedChangeValid(good: NumerGood_, selected?: boolean) {
    if (selected) {
      this.selectedGooodsValid.push(good);
    } else {
      this.selectedGooodsValid = this.selectedGooodsValid.filter(
        _good => _good.goodNumber != good.goodNumber
      );
    }
  }

  async ngOnInit() {
    this.buildForm();
    this.buildFormaplicationData();
    this.getBoveda(new ListParams());
    this.getDelegations(new ListParams());
    this.getAlmacen(new ListParams());
    this.getTodos(new ListParams());

    this.getDataTable('no');
    this.getDataTableNum();

    if (this.modal?.isShown) {
    }
    this.loading = false;
    this.delegationNumber = this.token.decodeToken().department;
    setTimeout(async () => {
      await this.getUsuario(new ListParams());
      await this.getUsuario1(new ListParams());
    }, 1000);
    //this.people$ = this.goodprocessService.getTodos();
  }
  clearModel() {
    this.selectedPeople = [];
  }

  async validationScreen(id: any): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.goodprocessService.getScreenGood2(id).subscribe({
        next: async (response: any) => {
          if (response.data) {
            //console.log('di_dispo', response);
            resolve('S');
          } else {
            //console.log('di_dispo', response);
            resolve('N');
          }
        },
        error: () => {
          resolve('N');
        },
      });
    });
  }

  onLegalStatusChange() {
    const legalStatus = this.form.get('legalStatus').value;

    if (legalStatus === 'AS') {
      this.esta = 'ADM';
      this.es = `ESTATUS = ${this.esta}`;
    } else if (legalStatus === 'DE') {
      this.esta = 'DEA,AXC';
      this.es = `ESTATUS IN (${this.esta})`;
    } else if (legalStatus === 'AB') {
      this.esta = 'CND,CNA';
      this.es = `ESTATUS IN (${this.esta})`;
    }
  }

  showReceipt(event: any) {
    this.modal.show();
    // this.loading = true;
    let params = {
      ...this.params2.getValue(),
      ...this.columnFilters2,
    };

    // const params = new FilterParams()

    params['filter.goodNumber'] = `$eq:${event.id}`;
    let obj = {
      exercisedDate: '01/01/2000',
    };
    this.expenseService_.getData(params, obj).subscribe(
      (response: any) => {
        let finalPriceTot = 0;
        let result = response.data.map((item: any) => {
          if (item.amount) finalPriceTot = finalPriceTot + Number(item.amount);
        });

        Promise.all(result).then(resp => {
          this.formTotal.get('total').setValue(finalPriceTot);
          this.data2.load(response.data);
          this.data2.refresh();
          this.totalItems2 = response.count;
        });
        // this.loading = false;
      },
      error => {
        this.data2.load([]);
        this.data2.refresh();
        this.totalItems2 = 0;
        this.alert('warning', 'No se Encontraron Resultados', '');
        this.loading = false;
      }
    );
  }
  getBoveda(params: ListParams, id?: string) {
    if (id) {
      params['filter.id'] = `$eq:${id}`;
    }
    this.safeService.getAll(params).subscribe((data: any) => {
      this.itemsBoveda = new DefaultSelect(data.data, data.count);
    });
  }
  getDelegations(params: ListParams, id?: string) {
    if (id) {
      params['filter.id'] = `$eq:${id}`;
    }
    this.delegationService.getAllPaginated(params).subscribe((data: any) => {
      this.itemsDelegation = new DefaultSelect(data.data, data.count);
    });
  }

  public searchUsuario(data: any) {
    const params = new ListParams();
    if (data.usuario) params['filter.usuario'] = data.usuario;

    this.securityService.getAllUser(params).subscribe({
      next: (types: any) => {
        this.itemsUser = new DefaultSelect(types.data, types.count);

        this.formaplicationData.controls['postUserRequestCamnum'].setValue(
          types.data[0].otvalor
        );
        this.formaplicationData.controls['delegationRequestcamnum'].setValue(
          types.data[0].no_delegacion
        );
      },
      error: err => {
        this.formaplicationData.controls['postUserRequestCamnum'].setValue('');
        this.formaplicationData.controls['delegationRequestcamnum'].setValue(
          ''
        );
      },
    });
  }

  public searchUsuario1(dat: any) {
    const params1 = new ListParams();
    if (dat.usuario) params1['filter.usuario'] = dat.usuario;

    this.securityService.getAllUser(params1).subscribe({
      next: (type: any) => {
        // this.itemsUser1 = new DefaultSelect(type.data, type.count);

        this.formaplicationData.controls['authorizePostUser'].setValue(
          type.data[0].otvalor
        );
        this.formaplicationData.controls['authorizeDelegation'].setValue(
          type.data[0].no_delegacion
        );
      },
      error: err => {
        this.formaplicationData.controls['authorizePostUser'].setValue('');
        this.formaplicationData.controls['authorizeDelegation'].setValue('');
        // this.itemsUser1 = new DefaultSelect([], 0);
      },
    });
  }

  async getUsuario(params: ListParams, usuario?: string) {
    if (params.text) {
      params['filter.usuario'] = `$ilike:${params.text}`;
    }
    params['filter.no_delegacion'] = `$eq:${this.delegationNumber}`;
    this.securityService.getAllUser(params).subscribe(
      (data: any) => {
        const res: any = data.data.map((user: any) => {
          return user.usuario;
        });

        this.itemsUser = new DefaultSelect(res, data.count);

        //this.formaplicationData.controls['postUserRequestCamnum'].setValue(data.itemsUser.name);
        // Llamar a getNameUser solo si se proporcionó un usuario
      },
      error => {
        this.itemsUser = new DefaultSelect([], 0);
      }
    );
  }

  async getUsuario1(params1: ListParams, usuario?: string) {
    if (params1.text) {
      params1['filter.usuario'] = `$ilike:${params1.text}`;
    }

    params1['filter.no_delegacion'] = `$eq:${this.delegationNumber}`;
    this.securityService.getAllUser(params1).subscribe(
      (dat: any) => {
        const res: any = dat.data.map((userT: any) => {
          return userT.usuario;
        });

        this.itemsUser1 = new DefaultSelect(res, dat.count);
        // console.log(this.itemsUser1);
        // console.log(dat);
        //this.formaplicationData.controls['postUserRequestCamnum'].setValue(data.itemsUser.name);
        // Llamar a getNameUser solo si se proporcionó un usuario
      },
      error => {
        this.itemsUser1 = new DefaultSelect([], 0);
      }
    );
  }

  getAlmacen(params: ListParams, id?: string) {
    if (id) {
      params['filter.id'] = `$eq:${id}`;
    }
    this.warehouseService.getAll(params).subscribe((data: any) => {
      this.itemsAlmacen = new DefaultSelect(data.data, data.count);
    });
  }
  getTodos(params: ListParams, id?: string) {
    // this.loading = true;
    const params_ = new FilterParams();

    params_.page = params.page;
    params_.limit = params.limit;

    let params__ = '';
    if (params?.text.length > 0)
      if (!isNaN(parseInt(params?.text))) {
        console.log('SI');
        params_.addFilter('clasifGoodNumber', params.text, SearchFilter.EQ);
      } else {
        console.log('NO');
        params_.search = params.text;
      }

    this.goodprocessService.getGoodType_(params_.getParams()).subscribe(
      (response: any) => {
        console.log('rrr', response);
        let result = response.data.map(async (item: any) => {
          item['tipoSupbtipoDescription'] =
            item.clasifGoodNumber +
            ' - ' +
            item.typeDesc +
            ' - ' +
            item.subTypeDesc +
            ' - ' +
            item.ssubTypeDesc +
            ' - ' +
            item.sssubTypeDesc;
        });
        Promise.all(result).then((resp: any) => {
          this.tiposData = new DefaultSelect(response.data, response.count);
          // this.loading = false;
        });
        //console.log(response);
      },
      error => {
        this.tiposData = new DefaultSelect([], 0);
        console.log('ERR', error);
      }
    );
  }

  onOptionsSelected(options: any[]) {
    //console.log('Opciones seleccionadas:', options);
  }

  getDataTable(filter: any) {
    if (filter == 'si') {
      this.performScroll();
      this.params.getValue().limit = 10;
      this.params.getValue().page = 1;
    }
    this.loading = false;
    this.totalItems = 0;
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            //console.log(filter);
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;

              case 'quantity':
                searchFilter = SearchFilter.EQ;
                break;

              case 'status':
                searchFilter = SearchFilter.EQ;
                break;

              case 'appraisedValue':
                searchFilter = SearchFilter.EQ;
                break;

              case 'expedienteid':
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
          this.getDataTableDos('no');
        }
      });

    // this.params
    //   .pipe(
    //     skip(1),
    //     tap(() => {
    //       this.getDataTableDos()
    //     }),
    //     takeUntil(this.$unSubscribe)
    //   )
    //   .subscribe(() => {
    //     // this.getGoodsByStatus(this.fileNumber)
    //   });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDataTableDos(filter));
  }

  async getDataTableDos(filter: any) {
    this.loading = true;
    this.dataGood = [];

    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    if (this.form.get('type').value !== null)
      params['filter.goodClassNumber'] = `$in:${this.form.get('type').value}`;
    console.log(params);
    const legalStatus = this.form.get('legalStatus').value;

    let estados: string[] = [];

    if (legalStatus === 'AS') {
      estados = ['ADM'];
    } else if (legalStatus === 'DE') {
      estados = ['DEA', 'AXC'];
    } else if (legalStatus === 'AB') {
      estados = ['CND', 'CNA'];
    }
    if (this.form.get('warehouse').value !== null)
      params['filter.storeNumber'] = `$eq:${this.form.get('warehouse').value}`;

    if (this.form.get('vault').value !== null)
      params['filter.vaultNumber'] = `$eq:${this.form.get('vault').value}`;

    if (this.form.get('delegation').value !== null)
      params['filter.delegationNumber'] = `$eq:${
        this.form.get('delegation').value
      }`;

    if (estados.length > 0) {
      params['filter.status'] = `$in:${estados.join(',')}`;
    } else {
      params['filter.status'] = '';
    }
    let alertShown = false;
    if (this.form.get('type').value != null) {
      this.totalItems = 0;
      this.goodServices.getByExpedientAndParams__(params).subscribe({
        next: async (response: any) => {
          let result = response.data.map(async (item: any) => {
            let obj = {
              vcScreen: 'FACTADBSOLCAMNUME',
              goodNumber: item.id,
            };
            const di_dispo = await this.validationScreen(obj);
            item['di_disponible'] = di_dispo;
          });

          this.dataGood = response.data;
          this.totalItems = response.count;
          this.data.load(response.data);
          this.data.refresh();
          this.loading = false;
        },
        error: err => {
          console.log('error', err);
          // if (!alertShown) {
          if (filter == 'si') {
            this.alert('warning', 'No se Encontraron Registros', '');
          }

          this.totalItems = 0;
          this.data.load([]);
          this.data.refresh();
          alertShown = true; // Marcar el flag como true después de mostrar el mensaje
          // }
          this.loading = false;
        },
      });
    }

    //this.loading = false;
  }
  async getDataTableNum() {
    this.totalItems1 = 0;
    this.data1
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
              case 'goodNumber':
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
          this.params1 = this.pageFilter(this.params1);
          this.getDataTableNumDos('no');
        }
      });

    this.params1
      .pipe(
        skip(1),
        tap(() => {
          this.getDataTableNumDos('no');
        }),
        takeUntil(this.$unSubscribe)
      )
      .subscribe(() => {
        // this.getGoodsByStatus(this.fileNumber)
      });
    // this.params1
    //   .pipe(takeUntil(this.$unSubscribe))
    //   .subscribe(() => this.getDataTableNumDos());
  }

  async getDataTableNumDos(filter: any) {
    this.loading2 = true;
    this.dataCamNum = [];
    let params1 = {
      ...this.params1.getValue(),
      ...this.columnFilters,
    };
    params1['filter.applicationChangeCashNumber'] = `$eq:${this.idSolicitud}`;
    this.numeraryService.getSolCamNum(params1).subscribe({
      next: async (response: any) => {
        setTimeout(() => {
          this.selectedGooodsValid = [];
          this.dataCamNum = response.data;
          this.totalItems1 = response.count;
          this.data1.load(response.data);
          this.data1.refresh();
          this.loading2 = false;
        }, 1000);
      },
      error: err => {
        console.log('ERROR', err);
        setTimeout(() => {
          this.selectedGooodsValid = [];
          this.dataCamNum = [];
          this.data1.load([]);
          this.data1.refresh();
          this.totalItems1 = 0;
          this.loading2 = false;
        }, 1000);

        if (filter == 'si') {
          this.alert('warning', 'No se Encontraron Bienes Asociados', '');
        }
      },
    });
  }
  cerrarModal() {
    this.modal.hide();
  }

  selectData(event: { data: any; selected: any }) {
    // this.selectedGooods = event.selected;
    console.log('AQUI SELECT', event);
    this.selectGood = [];
    this.selectGood.push(event.data);
    console.log('this.selectedGooods', this.selectedGooods);
  }
  selectDataCamNum(event: { data: any; selected: any }) {
    this.selectCamNum = [];
    this.selectCamNum.push(event.data);
    console.log('this.selectedGooodsValid', this.selectedGooodsValid);
  }

  async pasar() {
    this.validate = false;
    var situacionJuridica = '';
    var motivo: any = null;
    var message = '';
    if (this.selectedGooods.length != 0) {
      if (!this.idSolicitud) {
        message = 'Debe Indicar el ID de la Solicitud';
        this.handleSuccess2(message);
        this.formaplicationData
          .get('applicationChangeCashNumber')
          .markAsTouched();
        // this.validate = true;
        return;
      }
      if (
        this.formaplicationData.get('dateRequestChangeNumerary').value == null
      ) {
        message = 'La Fecha de Solicitud no debe estar vacía';
        this.handleSuccess2(message);
        this.formaplicationData
          .get('dateRequestChangeNumerary')
          .markAsTouched();
        // this.validate = true;
        return;
      }
      if (
        this.formaplicationData.get('userRequestChangeNumber').value == null
      ) {
        message = 'El Usuario Solicitante no debe estar vacío';
        this.handleSuccess2(message);
        this.formaplicationData.get('userRequestChangeNumber').markAsTouched();
        // this.validate = true;
        return;
      }
      if (this.formaplicationData.get('procedureProposal').value == null) {
        message = 'Debe de seleccionar el campo Procedimiento Propuesto';
        this.handleSuccess2(message);
        this.formaplicationData.get('procedureProposal').markAsTouched();
        // this.validate = true;
        return;
      }
      if (
        this.formaplicationData.get('delegationRequestcamnum').value == null
      ) {
        message = 'El Cargo del Usuario no debe estar vacío';
        this.handleSuccess2(message);
        this.formaplicationData.get('delegationRequestcamnum').markAsTouched();
        // this.validate = true;
        return;
      }
      if (this.formaplicationData.get('authorizeUser').value == null) {
        message = 'El campo Usuario Autoriza no debe estar Vacío';
        this.handleSuccess2(message);
        this.formaplicationData.get('authorizeUser').markAsTouched();
        // this.validate = true;
        return;
      }
      if (this.formaplicationData.get('authorizeDate').value == null) {
        message = 'La Fecha de Autorización no debe estar Vacía';
        this.handleSuccess2(message);
        this.formaplicationData.get('authorizeDate').markAsTouched();
        // this.validate = true;
        return;
      }

      let result = this.selectedGooods.map(async (good: any) => {
        if (!good.appraisedValue) {
          console.log('ENTRO AQUI');
          message = 'El Bien ' + good.id + ' No tiene Valor Avalúo';
          this.handleSuccess3(
            message,
            'Verifique el Punto 2.1 del Manual de Procedimientos para Enajenación'
          );
          // this.validate = true;
          return;
        }

        // if (good.expediente) {
        //   if (!good.expediente.id) {
        //     message = 'El Bien ' + good.id + ' No tiene Número de Expediente';
        //     this.handleSuccess(message);
        //     // this.validate = true;
        //     return;
        //   }
        // } else {
        //   message = 'El Bien ' + good.id + ' No tiene Número de Expediente';
        //   this.handleSuccess(message);
        //   // this.validate = true;
        //   return;
        // }

        // if (good.expediente)
        //   if (!good.expediente.preliminaryInquiry) {
        //     message = 'El Bien' + good.id + ' No tiene Averiguación Previa';
        //     this.handleSuccess(message);
        //     // this.validate = true;
        //     return;
        //   }

        if (good.status == 'ADM') {
          situacionJuridica = 'ASEGURADO';
        }
        if (good.status == 'DEA' || good.status == 'AXC') {
          situacionJuridica = 'DECOMISADO';
          motivo = 'BIEN DECOMISADO';
        }
        if (good.status == 'CND' || good.status == 'CNA') {
          //this.selectGood[0].status == 'ADE'
          situacionJuridica = 'ABANDONADO';
          motivo = 'BIEN ABANDONADO';
        }
        if (
          good.goodClassNumber == '316' ||
          good.goodClassNumber == '317' ||
          good.goodClassNumber == '1025' ||
          good.goodClassNumber == '1038'
        ) {
          motivo = 'ASEGURADO PERECEDERO';
        }
        if (good.goodClassNumber == 319 || good.goodClassNumber == 1078) {
          motivo = 'ASEGURADO SEMOVIENTE';
        }

        if (good.di_disponible == 'N') {
          this.onLoadToast(
            'warning',
            `El Bien ${good.id} ya está en una Solicitud`
          );
          return;
        } else {
          console.log('GOOD', good);
          this.loading2 = true;

          const payload = {
            goodNumber: good.id,
            applicationChangeCashNumber: this.idSolicitud,
            ProceedingsNumber: good.fileNumber,
            situationlegal: situacionJuridica,
            reasonApplication: motivo,
            vcScreen: 'FACTADBSOLCAMNUME',
            toobarUser: this.token.decodeToken().preferred_username,
          };
          console.log(payload);
          await this.createRegistroGood(payload);
        }
      });

      Promise.all(result).then(async item => {
        this.selectedGooods = [];
        await this.getDataTableNumDos('no');
        await this.getDataTableDos('no');

        // await this.getDataTableNum();
      });
    } else {
      this.alertInfo(
        'warning',
        'Debe Seleccionar un Registro en la tabla Bien x Tipo',
        ''
      ).then(question => {
        if (question.isConfirmed) {
          setTimeout(() => {
            this.performScroll();
          }, 300);
        }
      });
      // this.warningAlert('Debe seleccionar un Registro en la tabla Bien x Tipo');
    }
  }

  pasarTodo() {
    var situacionJuridica = '';
    var motivo: any = null;
    var message = '';
    if (this.dataGood.length != 0) {
      if (!this.idSolicitud) {
        message = 'Debe Indicar el ID de la Solicitud';
        this.handleSuccess2(message);
        this.formaplicationData
          .get('applicationChangeCashNumber')
          .markAsTouched();
        // this.validate = true;
        return;
      }
      if (
        this.formaplicationData.get('dateRequestChangeNumerary').value == null
      ) {
        message = 'La Fecha de Solicitud no debe estar vacía';
        this.handleSuccess2(message);
        this.formaplicationData
          .get('dateRequestChangeNumerary')
          .markAsTouched();
        // this.validate = true;
        return;
      }
      if (
        this.formaplicationData.get('userRequestChangeNumber').value == null
      ) {
        message = 'El Usuario Solicitante no debe estar vacío';
        this.handleSuccess2(message);

        this.formaplicationData.get('userRequestChangeNumber').markAsTouched();
        // this.validate = true;
        return;
      }
      if (this.formaplicationData.get('procedureProposal').value == null) {
        message = 'Debe de seleccionar el campo Procedimiento Propuesto';
        this.handleSuccess2(message);
        this.formaplicationData.get('procedureProposal').markAsTouched();
        // this.validate = true;
        return;
      }
      if (
        this.formaplicationData.get('delegationRequestcamnum').value == null
      ) {
        message = 'El Cargo del Usuario no debe estar vacío';
        this.handleSuccess2(message);
        this.formaplicationData.get('delegationRequestcamnum').markAsTouched();
        // this.validate = true;
        return;
      }
      if (this.formaplicationData.get('authorizeUser').value == null) {
        message = 'El campo Usuario Autoriza no debe estar vacío';
        this.handleSuccess2(message);
        this.formaplicationData.get('authorizeUser').markAsTouched();
        // this.validate = true;
        return;
      }
      if (this.formaplicationData.get('authorizeDate').value == null) {
        message = 'La Fecha de Autorización no debe estar vacía';
        this.handleSuccess2(message);
        this.formaplicationData.get('authorizeDate').markAsTouched();
        // this.validate = true;
        return;
      }

      this.loading2 = true;
      let result = this.dataGood.map(async (good: any) => {
        console.log(good);

        if (good.di_disponible == 'N') {
          return;
        }

        if (!good.appraisedValue) {
          console.log('ENTRO AQUI');
          message = 'El Bien ' + good.id + ' No tiene Valor Avalúo';
          this.handleSuccess3(
            message,
            'Verifique el Punto 2.1 del Manual de Procedimientos para Enajenación'
          );
          // this.validate = true;
          return;
        }

        if (good.status == 'ADM') {
          situacionJuridica = 'ASEGURADO';
        }
        if (good.status == 'DEA' || good.status == 'AXC') {
          situacionJuridica = 'DECOMISADO';
          motivo = 'BIEN DECOMISADO';
        }
        if (good.status == 'CND' || good.status == 'CNA') {
          //this.selectGood[0].status == 'ADE'
          situacionJuridica = 'ABANDONADO';
          motivo = 'BIEN ABANDONADO';
        }
        if (
          good.goodClassNumber == '316' ||
          good.goodClassNumber == '317' ||
          good.goodClassNumber == '1025' ||
          good.goodClassNumber == '1038'
        ) {
          motivo = 'ASEGURADO PERECEDERO';
        }
        if (good.goodClassNumber == '319' || good.goodClassNumber == '1078') {
          motivo = 'ASEGURADO SEMOVIENTE';
        }

        if (good.di_disponible == 'S') {
          const payload = {
            goodNumber: good.id,
            applicationChangeCashNumber: this.idSolicitud,
            ProceedingsNumber: good.fileNumber,
            situationlegal: situacionJuridica,
            reasonApplication: motivo,
            vcScreen: 'FACTADBSOLCAMNUME',
            toobarUser: this.token.decodeToken().preferred_username,
          };
          console.log(payload);
          await this.createRegistroGood(payload);

          // const payload = {
          //   goodNumber: good.id,
          //   applicationChangeCashNumber: this.idSolicitud,
          //   ProceedingsNumber: good.fileNumber,
          //   situationlegal: situacionJuridica,
          //   reasonApplication: motivo,
          // };
          // await this.createSolCamNum(payload, 'no');
        }
      });
      Promise.all(result).then(async item => {
        await this.getDataTableNumDos('no');
        this.selectedGooods = [];
        await this.getDataTableDos('no');

        // await this.getDataTableNum();
      });
    } else {
      this.alertInfo(
        'warning',
        'No hay Registro en la tabla Bien x Tipo',
        ''
      ).then(question => {
        if (question.isConfirmed) {
          setTimeout(() => {
            this.performScroll();
          }, 300);
        }
      });
      // this.warningAlert('No hay Registro en la tabla Bien x Tipo');
    }
  }

  async createRegistroGood(payload: any) {
    return new Promise<any>((resolve, reject) => {
      this.goodprocessService.insertStatusBien(payload).subscribe({
        next: value => {
          this.alert(
            'success',
            'Se Agregó Correctamente el Bien: ' + payload.goodNumber,
            ''
          );
          resolve(true);
        },
        error: err => {
          this.handleSuccess('No se Agregó el Bien: ' + payload.goodNumber);
          resolve(false);
        },
      });
    });
    return await firstValueFrom(
      this.goodprocessService.insertStatusBien(payload).pipe(
        catchError(error => {
          this.handleSuccess('No se Agregó el No. Bien ' + payload.goodNumber);
          return throwError(() => error);
        }),
        tap(resp => {
          this.alert(
            'success',
            'Se Agregó Correctamente el No. Bien ' + payload.goodNumber,
            ''
          );
        })
      )
    );
  }

  quitarTodo() {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea Eliminar Todos los Registros?'
    ).then(async question => {
      if (question.isConfirmed) {
        if (this.dataCamNum.length != 0) {
          console.log(this.dataCamNum);
          // this.loading = true;
          let obj = {
            applicationChangeCashNumber:
              this.dataCamNum[0].applicationChangeCashNumber,
            vcScreen: 'FACTADBSOLCAMNUME',
            toobarUser: this.token.decodeToken().preferred_username,
          };
          await this.deleteRegistrosVarios(obj);
          await this.getDataTableDos('no');

          // this.numeraryService
          //   .DeleteAllCamNum(this.dataCamNum[0].applicationChangeCashNumber)
          //   .subscribe({
          //     next: async (response: any) => {
          //       this.dataCamNum = [];
          //       this.data1.refresh();
          //       this.data1.load([]);
          //       this.totalItems1 = 0;
          //       this.alert('success', 'Registros Eliminados Correctamente', '');

          //       // this.loading = false;
          //     },
          //     error: err => {
          //       this.alert('error', 'Ocurrió un Error al Intentar Eliminar los Registro', '');
          //       // this.loading = false;
          //     },
          //   });
        } else {
          this.warningAlert(
            'No hay Registros en la Tabla Bien Cambio Numerario'
          );
        }
      }
    });
  }

  quitar() {
    if (this.selectedGooodsValid.length != 0) {
      // this.loading = true;
      let result = this.selectedGooodsValid.map(async item => {
        let obj = {
          goodNumber: item.goodNumber,
          vcScreen: 'FACTADBSOLCAMNUME',
          toobarUser: this.token.decodeToken().preferred_username,
        };
        await this.deleteRegistro(obj);
        // let obj = {
        //   cveShape: 'FACTADBSOLCAMNUME',
        //   goodNumber: item.goodNumber,
        // };
        // const statusScreen = await this.getstatusXScreenService(obj);

        // if (statusScreen) {
        //   let objGood = {
        //     id: item.goodNumber,
        //     goodId: item.goodNumber,
        //     status: statusScreen,
        //   };
        //   const cccc = await this.updateGood(objGood);

        //   let objHistoric = {
        //     id: item.goodNumber,
        //     status: statusScreen,
        //   };
        //   const aaa = await this.saveHistoric(objHistoric);
        //   const bbb = await this.deleteRegistros(item.goodNumber);
        // } else {
        //   await this.deleteRegistros(item.goodNumber);
        // }
      });

      Promise.all(result).then(async resp => {
        await this.getDataTableNumDos('no');
        await this.getDataTableDos('no');

        // await this.deleteAlert();
      });
    } else {
      this.warningAlert(
        'Debe Seleccionar un Registro en la Tabla Bien Cambio Numerario'
      );
    }
  }

  async deleteRegistro(body: any) {
    return new Promise<any>((resolve, reject) => {
      this.goodprocessService.getDeleteStatusGoodnumber(body).subscribe({
        next: async (response: any) => {
          // this.loading = false;
          this.alert(
            'success',
            'Bien: ' + body.goodNumber + ' Eliminado Correctamente ',
            ''
          );
          resolve(true);
        },
        error: err => {
          this.alert(
            'error',
            'No se pudo Eliminar el Registro' + body.goodNumber,
            ''
          );
          resolve(false);
          // this.loading = false;
        },
      });
    });
  }
  async updateGood(objGood: any) {
    // return new Promise<any>((resolve, reject) => {
    return await firstValueFrom(this.goodServices.update(objGood));
    // })
  }

  getstatusXScreenService(body: any) {
    return new Promise<string>((resolve, reject) => {
      this.statusXScreenService.postApplication(body).subscribe({
        next(value) {
          console.log(value);
          resolve(value.data[0].estatus_final);
        },
        error(err) {
          resolve(null);
        },
      });
    });
  }
  async saveHistoric(good: any) {
    const historyGood: IHistoryGood = {
      propertyNum: good.id,
      status: good.status,
      changeDate: new Date(),
      userChange: this.token.decodeToken().preferred_username,
      statusChangeProgram: 'FACTADBSOLCAMNUME',
      reasonForChange: 'Automatico',
      registryNum: null,
      extDomProcess: null,
    };

    this.historyGoodService.create(historyGood).subscribe({
      next: response => {
        // this.loading = false;
      },
      error: error => {
        // this.loading = false;
      },
    });
  }

  async deleteRegistros(goodNumber: any) {
    this.numeraryService.DeleteOneCamNum(goodNumber).subscribe({
      next: async (response: any) => {
        // this.loading = false;
      },
      error: err => {
        this.alert(
          'error',
          'Ocurrió un Error al Intentar Eliminar el Registro',
          ''
        );
        // this.loading = false;
      },
    });
  }

  async createSolCamNum(body: any, filter: any) {
    this.numeraryService.createSolCamNum(body).subscribe({
      next: async (response: any) => {
        // this.loading = false;
      },
      error: err => {
        if (filter == 'si') {
          this.alert(
            'error',
            'Ocurrió un Error al Intentar Crear el Registro',
            ''
          );
        }
        // this.loading = false;
      },
    });
  }

  async deleteRegistrosVarios(body: any) {
    return new Promise<any>((resolve, reject) => {
      this.goodprocessService.deleteStatusBien(body).subscribe({
        next: async (response: any) => {
          // this.loading = false;
          this.dataCamNum = [];
          this.data1.refresh();
          this.data1.load([]);
          this.totalItems1 = 0;
          this.alert('success', 'Registros Eliminados Correctamente', '');
          resolve(true);
        },
        error: err => {
          this.alert(
            'error',
            'Ocurrió un Error al Intentar Eliminar los Registros',
            ''
          );
          resolve(false);
          // this.loading = false;
        },
      });
    });
  }

  handleSuccess(message: any) {
    if (message == 'Se Agregó Correctamente') {
      this.alert('success', `${message}`, '');
    } else {
      this.alert('warning', `${message}`, '');
    }
    // this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    //this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  handleSuccess3(message: any, msg: any) {
    this.alert('warning', `${message}`, msg);
  }

  handleSuccess2(message: any) {
    if (message == 'Debe Indicar el ID de la Solicitud') {
      this.alertInfo(
        'warning',
        message,
        'Realice una Búsqueda o Agregue una Nueva Solicitud'
      ).then(question => {
        if (question.isConfirmed) {
          setTimeout(() => {
            this.performScroll2();
          }, 300);
        }
      });
    } else {
      this.alertInfo('warning', message, '').then(question => {
        if (question.isConfirmed) {
          setTimeout(() => {
            this.performScroll2();
          }, 300);
        }
      });
    }
  }

  async validation(valor: any) {
    var message = '';
    // if (this.formaplicationData.get('dateRequest').value == null) {
    //   message = "El bien ya esta en una solicitud"
    //   this.handleSuccess(message)
    // }
    if (
      this.formaplicationData.get('dateRequestChangeNumerary').value == null
    ) {
      message = 'La Fecha de Solicitud no debe estar vacía';
      this.handleSuccess(message);
      this.formaplicationData.get('dateRequestChangeNumerary').markAsTouched();
      // this.validate = true;
      return;
    }
    if (this.formaplicationData.get('userRequestChangeNumber').value == null) {
      message = 'El Usuario Solicitante no debe estar vacío';
      this.handleSuccess(message);
      this.formaplicationData.get('userRequestChangeNumber').markAsTouched();
      // this.validate = true;
      return;
    }
    if (this.formaplicationData.get('procedureProposal').value == null) {
      message = 'Debe de seleccionar el campo Procedimiento Propuesto';
      this.handleSuccess(message);
      this.formaplicationData.get('procedureProposal').markAsTouched();
      // this.validate = true;
      return;
    }
    if (this.formaplicationData.get('delegationRequestcamnum').value == null) {
      message = 'El Cargo del Usuario no debe estar vacío';
      this.handleSuccess(message);
      this.formaplicationData.get('delegationRequestcamnum').markAsTouched();
      // this.validate = true;
      return;
    }
    if (this.formaplicationData.get('authorizeUser').value == null) {
      message = 'El campo Usuario Autoriza no debe estar vacío';
      this.handleSuccess(message);
      this.formaplicationData.get('authorizeUser').markAsTouched();
      // this.validate = true;
      return;
    }
    if (this.formaplicationData.get('authorizeDate').value == null) {
      message = 'La Fecha de Autorización no debe estar vacía';
      this.handleSuccess(message);
      this.formaplicationData.get('authorizeDate').markAsTouched();
      // this.validate = true;
      return;
    }

    for (let index = 0; index < this.dataGood.length; index++) {
      if (valor == 0) {
        if (this.dataGood[index].appraisedValue == null) {
          message =
            'El bien No tiene valor avalúo, verifique el punto 2.1 del manual de procedimientos para enajenación';
          this.handleSuccess(message);
          // this.validate = true;
          return;
        }

        console.log(this.dataGood[index].expediente);
        if (this.dataGood[index].expediente)
          if (this.dataGood[index].expediente.id == null) {
            console.log(this.dataGood[index].expediente.id);
            message =
              'El bien NO tiene Número de Expediente' +
              this.dataGood[index].expediente.id;
            this.handleSuccess(message);
            // this.validate = true;
            return;
          }
        if (this.dataGood[index].expediente)
          if (
            this.dataGood[index].expediente.preliminaryInquiry &&
            this.dataGood[index].expediente.preliminaryInquiry === ''
          ) {
            message = 'El bien NO tiene averiguación previa';
            this.handleSuccess(message);
            // this.validate = true;
            return;
          }
      }

      if (valor == 1) {
        if (this.dataGood[index].appraisedValue == null) {
          message =
            'El bien NO tiene valor avalúo, verifique el punto 2.1 del manual de procedimientos para enajenación';
          this.handleSuccess(message);
          // this.validate = true;
          return;
        }
        if (this.dataGood[index].expediente)
          if (this.dataGood[index].expediente.id == null) {
            message = 'El bien NO tiene Número de Expediente';
            this.handleSuccess(message);
            // this.validate = true;
            return;
          }
      }
    }
    if (message != '') {
      // this.validate = true;
      return;
    }
  }
  disabledSave: boolean = true;
  guardarSolicitud() {
    // this.loading = true;
    // Obtener la fecha actual
    const currentDate = new Date(); // Obtener la fecha actual

    // Obtener la fecha seleccionada en el formulario
    const fechaSeleccionada = this.formaplicationData.get(
      'dateRequestChangeNumerary'
    ).value;

    // Comparar la fecha seleccionada con la fecha actual
    if (fechaSeleccionada.toDateString() !== currentDate.toDateString()) {
      // Si la fecha seleccionada no es la de hoy, mostrar un mensaje de error o realizar la acción que desees.
      this.alert('warning', 'La Fecha Seleccionada debe ser la de Hoy.', '');
      console.log('La fecha seleccionada debe ser la de hoy.');
      this.loading = false;
      return;
    }

    // Si la fecha seleccionada es la de hoy, continuar con el proceso de guardado
    this.formaplicationData
      .get('dateRequestChangeNumerary')
      .setValue(currentDate);
    this.formaplicationData.get('applicationChangeCashNumber').setValue(null);
    console.log(
      'this.formaplicationData.getRawValue()',
      this.formaplicationData.getRawValue()
    );
    this.numeraryService
      .createChangeNumerary(this.formaplicationData.getRawValue())
      .subscribe({
        next: async (response: any) => {
          this.idSolicitud = response.applicationChangeNumeraryNumber;
          this.formaplicationData
            .get('applicationChangeCashNumber')
            .setValue(response.applicationChangeNumeraryNumber);
          this.successAlert();
          const readonlyFields = [
            'dateRequestChangeNumerary',
            'applicationChangeCashNumber',
            'userRequestChangeNumber',
            'postUserRequestCamnum',
            'delegationRequestcamnum',
            'procedureProposal',
            'authorizeUser',
            'authorizePostUser',
            'authorizeDelegation',
            'authorizeDate',
          ];
          readonlyFields.forEach(fieldName => {
            this.formaplicationData.get(fieldName).disable();
          });
          this.loading = false;
          this.disabledSave = false;
        },
        error: err => {
          this.disabledSave = true;
          this.loading = false;
        },
      });
  }

  search() {
    // this.loading = true;
    this.idSolicitud = this.formaplicationData.get(
      'applicationChangeCashNumber'
    ).value;

    this.numeraryService.getSolById(this.idSolicitud).subscribe({
      next: async (response: any) => {
        //'userRequestChangeNumber',
        const readonlyFields = [
          'dateRequestChangeNumerary',
          'applicationChangeCashNumber',
          'userRequestChangeNumber',
          'postUserRequestCamnum',
          'delegationRequestcamnum',
          'procedureProposal',
          'authorizeUser',
          'authorizePostUser',
          'authorizeDelegation',
          'authorizeDate',
        ];

        response.dateRequestChangeNumerary = new Date(
          response.dateRequestChangeNumerary + 'T00:00:00'
        );

        response.authorizeDate = new Date(response.authorizeDate + 'T00:00:00');

        // Formatear las fechas
        // Verificar y formatear los campos de fecha solo si son válido

        this.formaplicationData.patchValue(response);

        // Establecer los campos específicos como de solo lectura
        readonlyFields.forEach(fieldName => {
          this.formaplicationData.get(fieldName).disable();
        });

        //this.loading = false;
        this.getDataTableNumDos('si');
        this.loading = false;
      },
      error: err => {
        this.idSolicitud = null;
        this.alert('warning', 'No se Encontraron Datos de la Solicitud', '');
        this.loading = false;
      },
    });
  }

  clean() {
    this.formaplicationData.reset();
    this.formaplicationData
      .get('dateRequestChangeNumerary')
      .setValue(new Date());
    this.formaplicationData.get('applicationChangeCashNumber').setValue(null);
    this.formaplicationData.get('userRequestChangeNumber').setValue(null);
    this.formaplicationData.get('postUserRequestCamnum').setValue(null);
    this.formaplicationData.get('delegationRequestcamnum').setValue(null);
    this.formaplicationData.get('procedureProposal').setValue(null);
    this.formaplicationData.get('authorizeUser').setValue(null);
    this.formaplicationData.get('authorizePostUser').setValue(null);
    this.formaplicationData.get('authorizeDelegation').setValue(null);
    this.formaplicationData.get('authorizeDate').setValue(new Date());
    Object.keys(this.formaplicationData.controls).forEach(controlName => {
      this.formaplicationData.get(controlName).enable();
    }),
      (this.totalItems1 = 0);
    this.idSolicitud = null;
    this.data1.load([]);
    this.data1.refresh();
    this.disabledSave = true;
  }
  //data3
  cleanFilter() {
    this.form.get('legalStatus').setValue(null);
    this.form.get('type').setValue(null);
    this.form.get('delegation').setValue(null);
    this.form.get('warehouse').setValue(null);
    this.form.get('vault').setValue(null);
    Object.keys(this.form.controls).forEach(controlName => {
      this.form.get(controlName).enable();
    }),
      (this.totalItems1 = 0);
    this.totalItems = 0;
    this.data.load([]);
    this.data.refresh();
    this.data3.load([]);
    this.data3.refresh();
  }

  printScanFile() {
    if (!this.idSolicitud) {
      this.handleSuccess2('Debe Indicar el ID de la Solicitud');
      this.formaplicationData
        .get('applicationChangeCashNumber')
        .markAsTouched();
      // this.validate = true;
      return;
    }
    // if (this.form.get(this.formControlName).value != null) {
    const params = {
      PARAMFORM: 'NO',
      SOLICITUD: this.idSolicitud,
    };
    this.downloadReport('RRCAMBIONUMERARIO', params);
    //}
    // else {
    //   this.alert('warning', 'No tiene folio de escaneo para imprimir.', '');
    // }
  }

  downloadReport(reportName: string, params: any) {
    this.loadingText = 'Generando reporte ...';
    this.siabService.fetchReport(reportName, params).subscribe({
      next: response => {
        this.loading = false;
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        let config = {
          initialState: {
            documento: {
              urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
              type: 'pdf',
            },
            callback: (data: any) => {},
          }, //pasar datos por aca
          class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
          ignoreBackdropClick: true, //ignora el click fuera del modal
        };
        this.modalService.show(PreviewDocumentsComponent, config);
      },
    });
  }

  warningAlert(message: any) {
    this.alert('warning', message, '');
  }
  successAlert() {
    this.alert('success', 'Registro Creado Correctamente', '');
  }

  async deleteAlert() {
    this.alert('success', 'Registro Eliminado', '');
  }
  /////////////////////

  private buildForm() {
    this.form = this.fb.group({
      legalStatus: [null, Validators.required],
      delegation: [null],
      warehouse: [null],
      vault: [null],
      type: [null, Validators.required],
    });
    this.formTotal = this.fb.group({
      total: [null],
    });
  }
  getDate(date: any) {
    let newDate;
    if (typeof date == 'string') {
      newDate = String(date).split('/').reverse().join('-');
    } else {
      newDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    }
    return newDate;
  }

  async buildFormaplicationData() {
    this.formaplicationData = this.fb.group({
      dateRequestChangeNumerary: [new Date(), [Validators.required]],
      applicationChangeCashNumber: [
        null,
        [Validators.pattern(NUM_POSITIVE_LETTERS)],
      ],
      userRequestChangeNumber: [null, [Validators.required]],
      postUserRequestCamnum: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      delegationRequestcamnum: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(200),
        ],
      ],
      procedureProposal: [null, [Validators.required]],
      authorizeUser: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(30),
        ],
      ],
      authorizePostUser: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      authorizeDelegation: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(200),
        ],
      ],
      authorizeDate: [new Date(), [Validators.required]],
    });
    this.formaplicationData.controls['postUserRequestCamnum'].disable();
    this.formaplicationData.controls['delegationRequestcamnum'].disable();
    this.formaplicationData.controls['authorizeDelegation'].disable();
    this.formaplicationData.controls['authorizePostUser'].disable();
    this.formaplicationData.controls['authorizeDate'].disable();
    this.formaplicationData.controls['dateRequestChangeNumerary'].disable();

    // const paramsSender = new ListParams();
    // paramsSender.text = this.token.decodeToken().preferred_username;
    // await this.get___Senders(paramsSender);

    this.formaplicationData.controls;
  }
  opcionSeleccionada: any[] = [];

  dropdownSettings = {
    // Configuración del dropdown
    singleSelection: false, // Permitir selección múltiple
    idField: 'id', // Nombre del campo que contiene el ID de cada opción
    textField: 'name', // Nombre del campo que contiene el texto de cada opción
    selectAllText: 'Seleccionar todo', // Texto para seleccionar todas las opciones
    unSelectAllText: 'Deseleccionar todo', // Texto para deseleccionar todas las opciones
    itemsShowLimit: 3, // Número máximo de opciones que se mostrarán antes de contraer la lista
    allowSearchFilter: true, // Permitir búsqueda de opciones
    closeDropDownOnSelection: false, // Mantener el dropdown abierto después de seleccionar una opción
    showSelectedItemsAtTop: true, // Mostrar las opciones seleccionadas en la parte superior
    noDataAvailablePlaceholderText: 'No hay datos disponibles',
  };

  performScroll() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  performScroll2() {
    if (this.scrollContainer) {
      this.scrollContainer2.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }

  async get___Senders(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    // params.addFilter('assigned', 'S');
    if (lparams?.text) params.addFilter('user', lparams.text, SearchFilter.EQ);
    this.abandonmentsService.getUsers(params.getParams()).subscribe({
      next: async (data: any) => {
        console.log('DATA DDELE', data);
        this.delegationNumber = data.data[0].delegationNumber;
        this.subdelegation = data.data[0].subdelegationNumber;
        this.areaDict = data.data[0].departamentNumber;

        setTimeout(async () => {
          await this.getUsuario(new ListParams());
          await this.getUsuario1(new ListParams());
        }, 1000);
      },
      error: async () => {},
    });
  }
}
