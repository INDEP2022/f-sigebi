import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/good/good.model';
import { GoodService } from 'src/app/core/services/good/good.service';
import { DonationService } from 'src/app/core/services/ms-donationgood/donation.service';
import { StatusGoodService } from 'src/app/core/services/ms-good/status-good.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { BasePage } from 'src/app/core/shared/base-page';
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
  origin: string = '';
  goods: IGood[] = [];
  totalItemsModal: number = 0;
  // selectedGooods: any[] = [];
  selectedRow: any | null = null;
  dataTableGood_: any[] = [];
  idsNotExist: NotData[] = [];
  dataTableGood: LocalDataSource = new LocalDataSource();
  activeGood: boolean = false;
  totalItems: number = 0;
  ngGlobal: any;
  paramsScreen: IParamsDonac = {
    origin: '',
    recordId: '',
    area: '',
  };
  params = new BehaviorSubject<ListParams>(new ListParams());
  dataGoodTable: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  loading2: boolean = false;
  provider: any;
  data: LocalDataSource = new LocalDataSource();
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  @Output() onSave = new EventEmitter<any>();
  totalItems2: number = 0;
  constructor(
    private goodService: GoodService,
    private modalRef: BsModalRef,
    private donationService: DonationService,
    private changeDetectorRef: ChangeDetectorRef,
    private GoodprocessService_: GoodprocessService,
    private statusGoodService: StatusGoodService,
    private activatedRoute: ActivatedRoute,
    private globalVarService: GlobalVarsService
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
        inventoryNumber: {
          title: 'No. Inventario',
          sort: false,
        },
        goodId: {
          title: 'No. Gestión',
          sort: false,
        },
        description: {
          title: 'Descripción',
          sort: false,
        },
        quantity: {
          title: 'Cantidad',
          sort: false,
        },
        status: {
          title: 'Estatus',
          sort: false,
        },
      },
      // rowClassFunction: (row: any) => {
      //   if (row.data.di_disponible == 'S') {
      //     return 'bg-success text-white';
      //   } else {
      //     return 'bg-dark text-white';
      //   }
      // },
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
            console.log('RASTREADOR ', this.data);
            this.selectedGooodsValid.push(this.ngGlobal.REL_BIENES);
            this.dataGoodTable.load(this.selectedGooodsValid);
            this.dataGoodTable.refresh();
          }
        },
      });
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(paramsQuery => {
        this.origin = paramsQuery['origin'] ?? null;
        this.paramsScreen.recordId = paramsQuery['recordId'] ?? null;
        // this.paramsScreen.cveEvent = paramsQuery['cveEvent'] ?? null;
        this.paramsScreen.area = paramsQuery['area'] ?? null;
        if (this.origin == 'FMCOMDONAC_1') {
          for (const key in this.paramsScreen) {
            if (Object.prototype.hasOwnProperty.call(paramsQuery, key)) {
              this.paramsScreen[key as keyof typeof this.paramsScreen] =
                paramsQuery[key] ?? null;
            }
          }
        }
        if (
          this.origin != null &&
          this.paramsScreen.recordId != null &&
          this.paramsScreen.area != null
        ) {
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
              inventoryNumber: () => (searchFilter = SearchFilter.ILIKE),
              goodId: () => (searchFilter = SearchFilter.EQ),
              description: () => (searchFilter = SearchFilter.EQ),
              quantity: () => (searchFilter = SearchFilter.EQ),
              status: () => (searchFilter = SearchFilter.ILIKE),
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
    params['filter.status'] = 'DON';
    // params['sortBy'] = `goodId:DESC`;
    this.goodService.getAll(params).subscribe({
      next: data => {
        console.log(data.data);
        this.totalItems2 = data.count;
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
  // onUserRowSelect(row: any): void {
  //   if (row.isSelected) {
  //     this.selectedRow = row.data;
  //   } else {
  //     this.selectedRow = null;
  //   }

  //   console.log(this.selectedRow);
  // }

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
  selectedGooodsValid: any[] = [];
  selectedGooods: any[] = [];
  goodsValid: any;

  async createDET(good: any) {
    // if (this.dataRecepcion.length > 0) {
    // let result = this.dataRecepcion.map(async good => {
    let obj: any = {
      numberProceedings: this.paramsScreen.recordId,
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
        console.log('datapruebaJess', resp);
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
    console.log('1412212', params);
    params['sortBy'] = `goodId:DESC`;
    params['filter.status'] != 'ADM';
    this.goodService.getByGood2(params).subscribe({
      next: data => {
        this.goods = data.data;
        console.log('Bienes', this.goods);
        let result = data.data.map(async (item: any) => {
          let obj = {
            vcScreen: 'FMCOMDONAC_1',
            pNumberGood: item.goodId,
          };

          const di_dispo = await this.getStatusScreen(obj);
          item['di_disponible'] = di_dispo;
          if (item.minutesKey) {
            item.di_disponible = 'N';
          }
          item['quantity'] = item.amount;
          item['di_acta'] = item.minutesKey;
          // item['id'] = item.goodId;
          // item['id'] = item.goodId;
          // item['id'] = item.goodId;
          // item['id'] = item.goodId;
          // item['id'] = item.goodId;
          // item['id'] = item.goodId;
          // item['id'] = item.goodId;
          // item['id'] = item.goodId;
          // item['id'] = item.goodId;
          // item['id'] = item.goodId;
          // item['id'] = item.goodId;

          // const acta: any = await this.getActaGoodExp(item.id, item.fileNumber);
          // // console.log('acta', acta);
          // item['acta_'] = acta;
        });

        Promise.all(result).then(item => {
          this.dataTableGood_ = this.goods;
          this.dataTableGood.load(this.goods);
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
}
