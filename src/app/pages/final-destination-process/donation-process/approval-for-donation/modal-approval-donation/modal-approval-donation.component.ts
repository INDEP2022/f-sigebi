import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/good/good.model';
import { ITempDonDetail } from 'src/app/core/models/ms-donation/donation.model';
import { ITrackedGood } from 'src/app/core/models/ms-good-tracker/tracked-good.model';
import { GoodService } from 'src/app/core/services/good/good.service';
import { DonationService } from 'src/app/core/services/ms-donationgood/donation.service';
import { StatusGoodService } from 'src/app/core/services/ms-good/status-good.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { getTrackedGoods } from 'src/app/pages/general-processes/goods-tracker/store/goods-tracker.selector';
import { GOOD_TRACKER_ORIGINS } from 'src/app/pages/general-processes/goods-tracker/utils/constants/origins';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { GlobalVarsService } from 'src/app/shared/global-vars/services/global-vars.service';
import { IParamsDonac } from '../capture-approval-donation/capture-approval-donation.component';

interface NotData {
  id: number;
  reason: string;
}
@Component({
  selector: 'app-modal-approval-donation',
  templateUrl: './modal-approval-donation.component.html',
  styles: [
    `
      :host ::ng-deep form-radio .form-group {
        margin: 0;
        padding-bottom: 0;
        padding-top: 0;
      }
      .disabled[disabled] {
        color: red;
      }
      .disabled-input {
        color: #939393;
        pointer-events: none;
      }
      #bienes table:not(.normal-hover) tbody tr:hover {
        color: black !important;
        font-weight: bold;
      }
      .row-verde {
        background-color: green;
        font-weight: bold;
      }

      .row-negro {
        background-color: black;
        font-weight: bold;
      }
      .registros-movidos {
        background-color: yellow;
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
export class ModalApprovalDonationComponent extends BasePage implements OnInit {
  title: string;
  subTitle: string;
  op: string;
  statusGood_: any;
  origin = GOOD_TRACKER_ORIGINS.DonationGood;
  goods: ITempDonDetail[] = [];
  goodT: IGood;
  totalItemsModal: number = 0;
  modelCreate: ITempDonDetail;
  $trackedGoods = this.store.select(getTrackedGoods);
  selectedRow: any | null = null;
  dataTableGood_: any[] = [];
  idsNotExist: NotData[] = [];
  dataTableGood: LocalDataSource = new LocalDataSource();
  activeGood: boolean = false;
  totalItems: number = 0;
  ngGlobal: any;
  paramsScreen: IParamsDonac = {
    origin: '',
  };
  params = new BehaviorSubject<ListParams>(new ListParams());
  dataGoodTable: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  loading2: boolean = false;
  provider: any;
  data: LocalDataSource = new LocalDataSource();
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  @Output() onSave = new EventEmitter<any>();
  @ViewChild('file') file: any;
  @Input() set files(files: any[]) {
    // debugger;
    if (files.length === 0) return;
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(files[0]);
    fileReader.onload = () => console.log(fileReader.result);
  }
  goodsList: ITrackedGood[] = [];
  get good(): ITrackedGood[] {
    return this.goodsList;
  }
  @Input() set good(good: ITrackedGood[]) {
    if (good.length > 0) {
      this.goodsList = good;
    } else {
      this.goodsList = [];
    }
  }

  totalItems2: number = 0;
  radioButton: any;
  constructor(
    private goodService: GoodService,
    private modalRef: BsModalRef,
    private donationService: DonationService,
    private changeDetectorRef: ChangeDetectorRef,
    private GoodprocessService_: GoodprocessService,
    private statusGoodService: StatusGoodService,
    private activatedRoute: ActivatedRoute,
    private globalVarService: GlobalVarsService,
    private store: Store
  ) {
    super();
    // this.settings = {
    //   ...this.settings,
    //   hideSubHeader: false,
    //   actions: false,
    //   selectMode: 'multi',
    //   columns: {
    //     ...GOODS,
    //   },
    // };
    console.log("localStorage.getItem('nameT')", localStorage.getItem('nameT'));
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      // selectMode: 'multi',
      selectedRowIndex: -1,
      mode: 'external',
      // columns: { ...GOODSEXPEDIENT_COLUMNS_GOODS },
      columns: {
        name: {
          filter: false,
          sort: false,
          title: 'Selección',
          type: 'custom',
          showAlways: true,
          valuePrepareFunction: (isSelected: boolean, row: IGood) =>
            this.isGoodSelectedValid(row),
          renderComponent: CheckboxElementComponent,
          onComponentInitFunction: (instance: CheckboxElementComponent) =>
            this.onGoodSelectValid(instance),
        },
        goodNumber: {
          title: 'No. Bien',
          sort: false,
          valuePrepareFunction(cell: any, row: any) {
            return row.bienindicadores.noBien;
          },
        },
        description: {
          title: 'Descripción',
          sort: false,
          valuePrepareFunction(cell: any, row: any) {
            return row.good.description;
          },
        },
        amount: {
          title: 'Cantidad',
          sort: false,
          valuePrepareFunction(cell: any, row: any) {
            return row.bienindicadores.amount;
          },
        },
        status: {
          title: 'Estatus',
          sort: false,
          valuePrepareFunction(cell: any, row: any) {
            return row.good.status;
          },
        },
        user: {
          title: 'Usuario',
          sort: false,
        },
        delegation: {
          title: 'Delegación',
          sort: false,
          valuePrepareFunction(cell: any, row: any) {
            return row.delegation.description;
          },
        },
        warehouse: {
          title: 'Almacén',
          sort: false,
          valuePrepareFunction(cell: any, row: any) {
            return row.warehouse.description;
          },
        },
        bienindicadores: {
          title: 'Indicador',
          sort: false,
          valuePrepareFunction(cell: any, row: any) {
            return row.bienindicadores.description;
          },
        },
        transference: {
          title: 'Transferente',
          sort: false,
          valuePrepareFunction(cell: any, row: any) {
            return row.transference.nameTransferent;
          },
        },
        processExt: {
          title: 'Process. Ext Dom',
          sort: false,
          valuePrepareFunction(cell: any, row: any) {
            return row.bienindicadores.procesoExtDom;
          },
        },
      },
      rowClassFunction: (row: any) => {
        const typeBg = localStorage.getItem('nameT');
        if (typeBg == 'CONSULTA DE BIENES') return 'bg-donacion-1 text-black';
        else if (typeBg == 'COMERCIO EXTERIOR')
          return 'bg-donacion-2 text-white';
        else if (typeBg == 'DELITOS FEDERALES')
          return 'bg-donacion-3 text-black';
        else if (typeBg == 'OTROS TRANSFERENTES')
          return 'bg-donacion-4 text-black';
        else if (row.data.error === 0) {
          return 'bg-success text-white';
        } else {
          return 'bg-dark text-white';
        }
      },
    };
  }

  ngOnInit(): void {
    this.globalVarService
      .getGlobalVars$()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: global => {
          this.ngGlobal = global;
          if (this.ngGlobal.REL_BIENES) {
            console.log('RASTREADOR ', this.ngGlobal.REL_BIENES);
            this.goodById();
            // this.createMultipleRecords(this.ngGlobal.REL_BIENES);
            // this.selectedGooodsValid.push(this.ngGlobal.REL_BIENES);
            // console.log(this.selectedGooodsValid);
            // this.dataGoodTable.load(this.selectedGooodsValid);
            // this.dataGoodTable.refresh();
          }
        },
      });
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(paramsQuery => {
        this.origin = paramsQuery['origin'] ?? null;
        if (this.origin == 'FMCOMDONAC_1') {
          for (const key in this.paramsScreen) {
            if (Object.prototype.hasOwnProperty.call(paramsQuery, key)) {
              this.paramsScreen[key as keyof typeof this.paramsScreen] =
                paramsQuery[key] ?? null;
            }
          }
        }
        if (this.origin != null) {
          // this.isValidOrigin();
          console.log(this.paramsScreen);
        }
      });

    this.dataGoodTable
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        console.log('SI');
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              goodNumber: () => (searchFilter = SearchFilter.ILIKE),
              id: () => (searchFilter = SearchFilter.EQ),
              description: () => (searchFilter = SearchFilter.EQ),
              quantity: () => (searchFilter = SearchFilter.EQ),
              status: () => (searchFilter = SearchFilter.ILIKE),
              user: () => (searchFilter = SearchFilter.ILIKE),
              delegationNumber: () => (searchFilter = SearchFilter.EQ),
              waehouse: () => (searchFilter = SearchFilter.EQ),
              bienindicadores: () => (searchFilter = SearchFilter.EQ),
              transference: () => (searchFilter = SearchFilter.EQ),
            };

            search[filter.field]();

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getGoodsByStatus();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoodsByStatus());
  }
  loadGood(data: any[]) {
    this.loading = true;
    let count = 0;
    data.forEach(good => {
      count = count + 1;
      this.goodService.getById(good.goodNumber).subscribe({
        next: response => {
          this.goods.push({
            ...JSON.parse(JSON.stringify(response)).data[0],
            avalaible: null,
          });
          console.log(this.goods);
          this.addStatus();
        },
        error: err => {
          if (err.error.message === 'No se encontrarón registros')
            this.idsNotExist.push({
              id: good.goodId,
              reason: err.error.message,
            });
        },
      });
      if (count === data.length) {
        this.loading = false;
      }
    });
  }

  getListGoods() {
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    params['filter.status'] = `$eq:DON`;
    // params[
    //   'filter.transference.nameTransferent'
    // ] = `$ilike:${localStorage.getItem('nameT')}`;
    // params['sortBy'] = `goodId:DESC`;

    this.donationService.getTempDon(params).subscribe({
      next: data => {
        this.goods = data.data;
        console.log(data.data);
        this.totalItems2 = data.count ?? 0;
        this.dataGoodTable.load(data.data);
        this.dataGoodTable.refresh();
      },
      error: () => console.log('no hay bienes'),
    });
  }
  addStatus() {
    this.data.load([]);
    this.paginator();
    this.data.refresh();
  }

  paginator(noPage: number = 1, elementPerPage: number = 10) {
    const indiceInicial = (noPage - 1) * elementPerPage;
    const indiceFinal = indiceInicial + elementPerPage;

    let paginateData = this.goods.slice(indiceInicial, indiceFinal);
    this.data.load(paginateData);
  }

  return() {
    this.modalRef.hide();
  }
  handleSuccess(): void {
    this.loading = false;
    this.onSave.emit(this.selectedGooodsValid);
    this.modalRef.hide();
  }

  onUserRowSelect(event: { data: any; selected: any }) {
    this.selectedRow = event.data;
    this.activeGood = true;
    // this.fileNumber = event.data.fileNumber;
    this.selectedGooods = event.selected;
    console.log(this.selectedRow);
    console.log(this.selectedGooods);
    this.changeDetectorRef.detectChanges();
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
      console.log(this.selectedGooods);
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
  isGoodSelectedValid(_good: IGood) {
    const exists = this.selectedGooodsValid.find(good => good.id == _good.id);
    return !exists ? false : true;
  }
  goodSelectedChangeValid(good: IGood, selected?: boolean) {
    if (selected) {
      this.selectedGooodsValid.push(good);
      console.log(this.selectedGooodsValid);
    } else {
      this.selectedGooodsValid = this.selectedGooodsValid.filter(
        _good => _good.id != good.id
      );
    }
  }
  isGoodSelectedT(_good: ITrackedGood) {
    const exists = this.selectedGooods.find(
      good => good.goodNumber == _good.goodNumber
    );
    return exists ? true : false;
  }

  private isValidOrigin() {
    return (
      this.origin !== null &&
      Object.values(GOOD_TRACKER_ORIGINS).includes(
        this.origin as unknown as GOOD_TRACKER_ORIGINS
      )
    );
  }
  selectedGooodsValid: any[] = [];
  selectedGooods: any[] = [];
  goodsValid: any;

  async createDET(good: any) {
    // if (this.dataRecepcion.length > 0) {
    // let result = this.dataRecepcion.map(async good => {
    let obj: any = {
      numberProceedings: localStorage.getItem('actaId'),
      numberGood: good.goodId,
      amount: good.quantity,
      received: null,
      approvedXAdmon: null,
      approvedDateXAdmon: null,
      approvedUserXAdmon: null,
      dateIndicatesUserApproval: null,
      numberRegister: null,
      reviewIndft: null,
      correctIndft: null,
      idftUser: null,
      idftDate: null,
      numDelegationIndft: null,
      yearIndft: null,
      monthIndft: null,
      idftDateHc: null,
      packageNumber: null,
      exchangeValue: null,
    };

    await this.saveGoodDetail(obj);
  }
  async saveGoodDetail(body: any) {
    return new Promise((resolve, reject) => {
      this.donationService.createAdmonDonation(body).subscribe({
        next: data => {
          // this.alert('success', 'Bien agregado correctamente', '');
          resolve(true);
        },
        error: error => {
          // this.authorityName = '';
          resolve(false);
        },
      });
    });
  }
  removeAll() {}
  removeSelect() {}

  async selectData(event: { data: IGood; selected: any }) {
    this.selectedRow = event.data;
    console.log('select RRR', this.selectedRow);

    await this.getStatusGoodService(this.selectedRow.status);
    this.selectedGooods = event.selected;
    this.changeDetectorRef.detectChanges();
  }
  async getStatusGoodService(status: any) {
    this.statusGoodService.getById(status).subscribe({
      next: async (resp: any) => {
        this.statusGood_ = resp.description;
        // this.statusGoodForm.get('statusGood').setValue(resp.description)
      },
      error: err => {
        this.statusGood_ = '';
        // this.statusGoodForm.get('statusGood').setValue('')
      },
    });
  }

  getGoodsByStatus() {
    this.loading = true;
    this.dataTableGood_ = [];
    this.dataTableGood.load(this.dataTableGood_);
    this.dataTableGood.refresh();
    let params: any = {
      ...this.paramsList.getValue(),
      ...this.columnFilters,
    };
    params['sortBy'] = `goodNumber:DESC`;
    params['filter.status'] != 'DON';
    if (localStorage.getItem('nameT'))
      params[
        'filter.transference.nameTransferent'
      ] = `$ilike:${localStorage.getItem('nameT')}`;
    this.donationService.getTempDon(params).subscribe({
      next: data => {
        this.goods = data.data;
        let result = data.data.map(async (item: any) => {
          let obj = {
            vcScreen: 'FMCOMDONAC_1',
            pNumberGood: item.goodNumber,
          };
          const nameT = localStorage.getItem('nameT');
          const di_dispo = await this.getStatusScreen(obj);
          item['di_disponible'] = di_dispo;
          item['nameTransferent'] = nameT;
          if (item.minutesKey) {
            item.di_disponible = 'N';
          }
          item['quantity'] = item.amount;
          item['id'] = item.minutesKey;
          item['goodNumber'] = item.goodNumber;
          item['processExt'] = item.processExt;
        });

        Promise.all(result).then(item => {
          this.dataTableGood_ = this.goods;
          this.dataTableGood.load(this.goods);
          this.dataTableGood.refresh();

          this.totalItems = data.count;
          this.loading = false;
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

  async getGlobalVars() {
    return new Promise<void>((resolve, reject) => {
      this.globalVarService
        .getGlobalVars$()
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: global => {
            this.ngGlobal = global;
            if (this.ngGlobal.REL_BIENES) {
              console.log('RASTREADOR ', this.data);
            }
            resolve();
          },
          error: reject,
        });
    });
  }

  async goodById() {
    this.goodService.getGoodByIds(this.ngGlobal.REL_BIENES).subscribe({
      next: data => {
        this.goodT = data.data;
        this.isGoodSelected(this.goodT);
      },
      error: () => console.log('no hay bienes'),
    });
  }
}
