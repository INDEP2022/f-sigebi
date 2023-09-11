import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
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
import { IParamsDonac } from '../capture-approval-donation/capture-approval-donation.component';
@Component({
  selector: 'app-modal-approval-donation',
  templateUrl: './modal-approval-donation.component.html',
  styles: [],
})
export class ModalApprovalDonationComponent extends BasePage implements OnInit {
  title: string;
  subTitle: string;
  op: string;
  statusGood_: any;

  goods: IGood[] = [];
  totalItemsModal: number = 0;
  // selectedGooods: any[] = [];
  selectedRow: any | null = null;
  dataTableGood_: any[] = [];
  dataTableGood: LocalDataSource = new LocalDataSource();
  activeGood: boolean = false;
  totalItems: number = 0;

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
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  @Output() onSave = new EventEmitter<any>();
  totalItems2: number = 0;
  constructor(
    private goodService: GoodService,
    private modalRef: BsModalRef,
    private donationService: DonationService,
    private changeDetectorRef: ChangeDetectorRef,
    private GoodprocessService_: GoodprocessService,
    private statusGoodService: StatusGoodService
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
        proposalKey: {
          title: 'Ref.',
          type: 'number',
          sort: false,
        },
        goodNumber: {
          title: 'No. Bien',
          type: 'number',
          sort: false,
        },
        description: {
          title: 'Descripción del Bien',
          type: 'string',
          sort: false,
          valuePrepareFunction: (cell: any, row: any) => {
            return row.goodEntity?.description;
          },
        },
        quantity: {
          title: 'Cantidad',
          type: 'number',
          sort: false,
          valuePrepareFunction: (cell: any, row: any) => {
            return row.goodEntity?.quantity;
          },
        },
        unit: {
          title: 'Unidad',
          type: 'string',
          sort: false,
          valuePrepareFunction: (cell: any, row: any) => {
            return row.goodEntity?.unit;
          },
        },
        status: {
          title: 'Estatus',
          type: 'string',
          sort: false,
          valuePrepareFunction: (cell: any, row: any) => {
            return row.goodEntity?.status;
          },
        },
        noExpediente: {
          title: 'No. Expediente',
          type: 'number',
          sort: false,
          valuePrepareFunction: (cell: any, row: any) => {
            return row.goodEntity?.noExpediente;
          },
        },
        noEtiqueta: {
          title: 'Etiqueta Destino',
          type: 'string',
          sort: false,
          valuePrepareFunction: (cell: any, row: any) => {
            return row.goodEntity?.noEtiqueta;
          },
        },
        idNoWorker1: {
          title: 'No. Tranf.',
          type: 'string',
          sort: false,
          // valuePrepareFunction: (cell: any, row: any) => {
          //   return row.goodEntity?.idNoWorker1;
          // },
        },
        idExpWorker1: {
          title: 'Des. Tranf.',
          type: 'string',
          sort: false,
          // valuePrepareFunction: (cell: any, row: any) => {
          //   return row.goodEntity?.idExpWorker1;
          // },
        },
        noClasifBien: {
          title: 'No. Clasif.',
          type: 'number',
          sort: false,
          valuePrepareFunction: (cell: any, row: any) => {
            return row.good?.goodClassification;
          },
        },
        procesoExtDom: {
          title: 'Proceso',
          type: 'string',
          sort: false,
          valuePrepareFunction: (cell: any, row: any) => {
            return row.good?.procesoExtDom;
          },
        },
        // warehouseNumb: {
        //   title: 'No. Alma.',
        //   type: 'number',
        //   sort: false,
        // },
        // warehouse: {
        //   title: 'Almacén',
        //   type: 'string',
        //   sort: false,
        // },
        // warehouseLocat: {
        //   title: 'Ubica. Almacén ',
        //   type: 'string',
        //   sort: false,
        // },
        // coordAdmin: {
        //   title: 'Coord. Admin.',
        //   type: 'string',
        //   sort: false,
        // },
        // select: {
        //   title: 'Selec.',
        //   type: 'custom',
        //   renderComponent: CheckboxElementComponent,
        //   onComponentInitFunction(instance: any) {
        //     instance.toggle.subscribe((data: any) => {
        //       data.row.to = data.toggle;
        //     });
        //   },
        //   sort: false,
        // },
        // noDataMessage: 'No se encontrarón registros',
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
              proposalKey: () => (searchFilter = SearchFilter.ILIKE),
              goodNumber: () => (searchFilter = SearchFilter.EQ),
              id: () => (searchFilter = SearchFilter.EQ),
              description: () => (searchFilter = SearchFilter.ILIKE),
              quantity: () => (searchFilter = SearchFilter.EQ),
              unit: () => (searchFilter = SearchFilter.EQ),
              status: () => (searchFilter = SearchFilter.EQ),
              noExpediente: () => (searchFilter = SearchFilter.EQ),
              noEtiqueta: () => (searchFilter = SearchFilter.EQ),
              idNoWorker1: () => (searchFilter = SearchFilter.EQ),
              idExpWorker1: () => (searchFilter = SearchFilter.EQ),
              noClasifBien: () => (searchFilter = SearchFilter.EQ),
              procesoExtDom: () => (searchFilter = SearchFilter.EQ),
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

  getTempDona() {
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    // params['sortBy'] = `goodNumber:DESC`;
    this.donationService.getTempGood(params).subscribe({
      next: data => {
        console.log(data.data);
        this.totalItems2 = data.count;
        this.dataGoodTable.load(data.data);
        this.dataGoodTable.refresh();
      },
      error: () => console.log('no hay bienes'),
    });
  }

  return() {
    this.modalRef.hide();
  }
  handleSuccess(): void {
    this.loading = false;
    this.onSave.emit(this.selectedGooods);
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

  // // addSelect() { }
  // // addAll() {
  // //   if (this.eventdetailDefault == null) {
  // //     this.alert(
  // //       'warning',
  // //       'No existe un Acta en la cual Asignar el Bien.',
  // //       'Debe capturar un acta.'
  // //     );
  // //     return;
  // //   } else {
  // //     if (this.status == 'CERRADA') {
  // //       this.alert(
  // //         'warning',
  // //         'El Acta ya esta Cerrada, no puede Realizar Modificaciones a esta',
  // //         ''
  // //       );
  // //       return;
  // //     } else {
  // //       if (this.dataTableGood_.length > 0) {
  // //         this.loading2 = true;
  // //         let result = this.dataTableGood_.map(async _g => {
  // //           // console.log(_g);

  // //           if (_g.di_disponible == 'N') {
  // //             return;
  // //           }

  // //           if (_g.di_disponible == 'S') {
  // //             _g.di_disponible = 'N';
  // //             let valid = this.dataDetailDonation.some(
  // //               (goodV: any) => goodV.goodId == _g.id
  // //             );

  // //             // await this.updateBienDetalle(_g.id, 'ADM');
  // //             await this.createDET(_g);
  // //           }
  // //         });
  // //         Promise.all(result).then(async item => {
  // //           this.getGoodsByStatus(Number(this.eventDonacion.fileId));
  // //           await this.getDetailProceedingsDevollution(
  // //             this.eventdetailDefault.id
  // //           );
  // //           //this.actasDefault = null;
  // //         });
  // //       }
  // //     }
  // //   }
  // // }

  async createDET(good: any) {
    // if (this.dataRecepcion.length > 0) {
    // let result = this.dataRecepcion.map(async good => {
    let obj: any = {
      numberProceedings: this.paramsScreen.recordId,
      numberGood: good.goodNumber,
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

    // let obj_: any = {
    //   id: good.id,
    //   goodId: good.id,
    //   status: await this.getScreenStatus(good),
    // };
    // // UPDATE BIENES
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
    // console.log('select RRR', this.selectedRow);

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
    // console.log('1412212', params);
    params['sortBy'] = `goodId:DESC`;
    params['filter.recordId'] = this.paramsScreen.recordId;
    this.donationService.getTempGood(params).subscribe({
      next: data => {
        this.goods = data.data;

        // console.log('Bienes', this.bienes);

        let result = data.data.map(async (item: any) => {
          let obj = {
            vcScreen: 'FMCOMDONAC_1',
            pNumberGood: item.goodId,
          };
          const di_dispo = await this.getStatusScreen(obj);
          item['di_disponible'] = di_dispo;
          if (item.recordId) {
            item.di_disponible = 'N';
          }
          item['quantity'] = item.amount;
          item['di_acta'] = item.recordId;
          item['id'] = item.goodId;
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
