import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { takeUntil } from 'rxjs/operators';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared';
import { ServiceGetAll } from 'src/app/core/shared/base-page-dinamic-filters';
import { data } from './data';
import { GOODS_AVAILABLE_SALE_COLUMNS } from './goods-available-sale-columns';
//import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'goods-available-sale-list',
  templateUrl: './goods-available-sale-list.component.html',
  styles: [],
})
export class GoodsAvailableSaleListComponent2
  extends BasePage
  implements OnInit
{
  [x: string]: any;
  comercializationGoods: any[] = [];
  goodsAFSD = data;
  rowSelected: boolean = false;
  selectedRow: any = null;
  status: any;
  columns = GOODS_AVAILABLE_SALE_COLUMNS;
  data: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  columnFilters: any = [];
  ilikeFilters: string[] = ['description'];
  params = new BehaviorSubject<ListParams>(new ListParams());
  service: ServiceGetAll;

  constructor(private goodService: GoodService) {
    super();
    this.service = this.goodService;
    this.ilikeFilters = ['description'];
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      columns: GOODS_AVAILABLE_SALE_COLUMNS,
      actions: {
        ...this.settings.actions,
        add: true,
        edit: true,
        delete: true,
      },
    };
  }

  onSaveConfirm(event: any) {
    event.confirm.resolve();
    this.goodService.update(event.newData).subscribe();
    this['onLoadToast']('success', 'Elemento Actualizado', '');
  }

  onAddConfirm(event: any) {
    event.confirm.resolve();
    this.goodService.create(event.newData).subscribe();
    this['onLoadToast']('success', 'Elemento Creado', '');
  }

  onDeleteConfirm(event: any) {
    this['alertQuestion'](
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then((question: { isConfirmed: any }) => {
      if (question.isConfirmed) {
        event.confirm.resolve();
        this.goodService.remove(event.data.id).subscribe();
        this['onLoadToast']('success', 'Elemento Eliminado', '');
      }
    });
  }

  selectRow(row: any) {
    this.selectedRow = row;
    this.rowSelected = true;
  }

  ngOnInit(): void {
    this.dinamicFilterUpdate();
    this.searchParams();
  }

  protected dinamicFilterUpdate() {
    this.data
      .onChanged()
      .pipe(takeUntil(this['$unSubscribe']))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            if (this.ilikeFilters.includes(filter.field)) {
              searchFilter = SearchFilter.ILIKE;
            } else {
              searchFilter = SearchFilter.EQ;
            }
            field = `filter.${filter.field}`;
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
            console.log(this.columnFilters);
          });
          this.getData();
        }
      });
  }

  searchParams() {
    this.params.pipe(takeUntil(this['$unSubscribe'])).subscribe({
      next: resp => {
        this.getData();
      },
    });
  }

  getData() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    if (this.service) {
      this.service.getAll(params).subscribe({
        next: (response: any) => {
          if (response) {
            this.totalItems = response.count || 0;
            this.data.load(response.data);
            this.data.refresh();
            this.loading = false;
          }
        },
        error: err => {
          this.totalItems = 0;
          this.data.load([]);
          this.data.refresh();
          this.loading = false;
        },
      });
    } else {
      this.totalItems = 0;
      this.data.load([]);
      this.data.refresh();
      this.loading = false;
    }
  }
}

// import { Component, OnInit } from '@angular/core';
// import { BsModalService } from 'ngx-bootstrap/modal';
// import { BehaviorSubject, takeUntil } from 'rxjs';
// import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';

// import { LocalDataSource } from 'ng2-smart-table';
// import {
//   ListParams,
//   SearchFilter,
// } from 'src/app/common/repository/interfaces/list-params';
// import { IGoodsAvailableSale } from 'src/app/core/models/commercialization/goodsAvailableSale';
// import { GoodsAvailableSaleService } from 'src/app/core/services/ms-goods-available-sale/ms-goods-available-sale.service';
// import { BasePage } from 'src/app/core/shared/base-page';
// import Swal from 'sweetalert2';
// import { GoodsAvailableSaleFormComponent } from '../goods-available-sale-form/goods-available-sale-form.component';
// import { GOODS_AVAILABLE_SALE_COLUMNS } from './goods-available-sale-columns';

// @Component({
//   selector: 'goods-available-sale-list',
//   templateUrl: './goods-available-sale-list.component.html',
//   styles: [],
// })
// export class GoodsAvailableSaleListComponent extends BasePage implements OnInit {
//   goodsAvailableSale: IGoodsAvailableSale[] = [];
//   totalItems: number = 0;
//   params = new BehaviorSubject<ListParams>(new ListParams());
//   data: LocalDataSource = new LocalDataSource();
//   columnFilters: any = [];

//   constructor(
//     private goodsAvailableSaleService: GoodsAvailableSaleService,
//     private modalService: BsModalService
//   ) {
//     super();
//     this.settings.columns = GOODS_AVAILABLE_SALE_COLUMNS;
//     this.settings.actions.delete = true;
//     this.settings.actions.add = false;
//     this.settings.hideSubHeader = false;
//   }

//   ngOnInit(): void {
//     this.data
//       .onChanged()
//       .pipe(takeUntil(this.$unSubscribe))
//       .subscribe(change => {
//         if (change.action === 'filter') {
//           let filters = change.filter.filters;
//           filters.map((filter: any) => {
//             let field = ``;
//             let searchFilter = SearchFilter.ILIKE;
//             field = `filter.${filter.field}`;
//             filter.field == 'id' ||
//             filter.field == 'description' ||
//             filter.field == 'processStatus' ||
//             filter.field == 'quantity' ||
//             filter.field == 'transferentDestiny'
//               ? (searchFilter = SearchFilter.EQ)
//               : (searchFilter = SearchFilter.ILIKE);
//             if (filter.search !== '') {
//               this.columnFilters[field] = `${searchFilter}:${filter.search}`;
//             } else {
//               delete this.columnFilters[field];
//             }
//           });
//           this.getDeductives();
//         }
//       });
//     this.params
//       .pipe(takeUntil(this.$unSubscribe))
//       .subscribe(() => this.getDeductives());
//   }

//   getDeductives() {
//     this.loading = true;
//     let params = {
//       ...this.params.getValue(),
//       ...this.columnFilters,
//     };
//     this.goodsAvailableSaleService.getAll(params).subscribe({
//       next: response => {
//         this.goodsAvailableSale = response.data;
//         this.data.load(this.goodsAvailableSale);
//         this.data.refresh();
//         this.totalItems = response.count;
//         this.loading = false;
//       },
//       error: error => (this.loading = false),
//     });
//   }

//   openForm(goodsAvailable?: IGoodsAvailableSale) {
//     console.log('goodsAvailable ', goodsAvailable)
//     const modalConfig = MODAL_CONFIG;
//     modalConfig.initialState = {
//       goodsAvailable,
//       callback: (next: boolean) => {
//         if (next) this.getDeductives();
//       },
//     };
//     this.modalService.show(GoodsAvailableSaleFormComponent, modalConfig);
//   }

//   showDeleteAlert(goodsAvailable: IGoodsAvailableSale) {
//     console.log('goodsAvailable ', goodsAvailable)
//     this.alertQuestion(
//       'warning',
//       'Eliminar',
//       'Desea eliminar este registro?'
//     ).then(question => {
//       if (question.isConfirmed) {
//         this.delete(goodsAvailable.id);
//         Swal.fire('Borrado', '', 'success');
//       }
//     });
//   }

//   delete(id: number) {
//     this.goodsAvailableSaleService.remove(id).subscribe({
//       next: () => this.getDeductives(),
//     });
//   }
// }

// import { Component, OnInit } from '@angular/core';
// import { BsModalService } from 'ngx-bootstrap/modal';
// import { BehaviorSubject, takeUntil } from 'rxjs';
// import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';

// import { LocalDataSource } from 'ng2-smart-table';
// import {
//   ListParams,
//   SearchFilter,
// } from 'src/app/common/repository/interfaces/list-params';
// import { IGoodsAvailableSale } from 'src/app/core/models/commercialization/goodsAvailableSale';
// import { GoodsAvailableSaleService } from 'src/app/core/services/ms-goods-available-sale/ms-goods-available-sale.service';
// import { BasePage } from 'src/app/core/shared/base-page';
// import Swal from 'sweetalert2';
// import { GoodsAvailableSaleFormComponent } from '../goods-available-sale-form/goods-available-sale-form.component';
// import { GOODS_AVAILABLE_SALE_COLUMNS } from './goods-available-sale-columns';

// @Component({
//   selector: 'goods-available-sale-list',
//   templateUrl: './goods-available-sale-list.component.html',
//   styles: [],
// })
// export class GoodsAvailableSaleListComponent extends BasePage implements OnInit {
//   goodsAvailableSale: IGoodsAvailableSale[] = [];
//   totalItems: number = 0;
//   params = new BehaviorSubject<ListParams>(new ListParams());
//   data: LocalDataSource = new LocalDataSource();
//   columnFilters: any = [];

//   ilikeFilters: string[] = ['description'];

//   constructor(
//     private goodsAvailableSaleService: GoodsAvailableSaleService,
//     private modalService: BsModalService
//   ) {
//     super();
//     this.settings.columns = GOODS_AVAILABLE_SALE_COLUMNS;
//     this.settings.actions.delete = true;
//     this.settings.actions.add = false;
//     this.settings.hideSubHeader = false;
//   }

//   ngOnInit(): void {
//     this.dinamicFilterUpdate();
//     this.searchParams();
//   }

//   protected dinamicFilterUpdate() {
//     this.data
//       .onChanged()
//       .pipe(takeUntil(this.$unSubscribe))
//       .subscribe(change => {
//         if (change.action === 'filter') {
//           let filters = change.filter.filters;
//           filters.map((filter: any) => {
//             let field = ``;
//             let searchFilter = SearchFilter.ILIKE;
//             if (this.ilikeFilters.includes(filter.field)) {
//               searchFilter = SearchFilter.ILIKE;
//             } else {
//               searchFilter = SearchFilter.EQ;
//             }
//             field = `filter.${filter.field}`;
//             if (filter.search !== '') {
//               this.columnFilters[field] = `${searchFilter}:${filter.search}`;
//             } else {
//               delete this.columnFilters[field];
//             }
//             console.log(this.columnFilters);
//           });
//           this.getDeductives();
//         }
//       });
//   }

//   searchParams() {
//     this.params.pipe(takeUntil(this.$unSubscribe)).subscribe({
//       next: resp => {
//         this.getDeductives();
//       },
//     });
//   }

//   getDeductives() {
//     this.loading = true;
//     let params = {
//       ...this.params.getValue(),
//       ...this.columnFilters,
//     };
//     this.goodsAvailableSaleService.getAll(params).subscribe({
//       next: response => {
//         this.goodsAvailableSale = response.data;
//         console.log('goodsAvailableSale ', this.goodsAvailableSale);
//         this.data.load(this.goodsAvailableSale);
//         this.data.refresh();
//         this.totalItems = response.count;
//         this.loading = false;
//       },
//       error: error => (this.loading = false),
//     });
//   }

//   openForm(goodsAvailable?: IGoodsAvailableSale) {
//     const modalConfig = MODAL_CONFIG;
//     modalConfig.initialState = {
//       goodsAvailable,
//       callback: (next: boolean) => {
//         if (next) this.getDeductives();
//       },
//     };
//     this.modalService.show(GoodsAvailableSaleFormComponent, modalConfig);
//   }

//   showDeleteAlert(goodsAvailable: IGoodsAvailableSale) {
//     this.alertQuestion(
//       'warning',
//       'Eliminar',
//       'Desea eliminar este registro?'
//     ).then(question => {
//       if (question.isConfirmed) {
//         this.delete(goodsAvailable.id);
//         Swal.fire('Borrado', '', 'success');
//       }
//     });
//   }

//   delete(id: number) {
//     this.goodsAvailableSaleService.remove(id).subscribe({
//       next: () => this.getDeductives(),
//     });
//   }
// }

// import { Component, OnInit } from '@angular/core';
// import { BsModalService } from 'ngx-bootstrap/modal';
// import { BehaviorSubject, takeUntil } from 'rxjs';
// import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';

// import { LocalDataSource } from 'ng2-smart-table';
// import {
//   ListParams,
//   SearchFilter,
// } from 'src/app/common/repository/interfaces/list-params';
// import { IGoodsAvailableSale } from 'src/app/core/models/commercialization/goodsAvailableSale';
// import { GoodsAvailableSaleService } from 'src/app/core/services/ms-goods-available-sale/ms-goods-available-sale.service';
// import { BasePage } from 'src/app/core/shared/base-page';
// import Swal from 'sweetalert2';
// import { GoodsAvailableSaleFormComponent } from '../goods-available-sale-form/goods-available-sale-form.component';
// import { GOODS_AVAILABLE_SALE_COLUMNS } from './goods-available-sale-columns';

// @Component({
//   selector: 'goods-available-sale-list',
//   templateUrl: './goods-available-sale-list.component.html',
//   styles: [],
// })
// export class GoodsAvailableSaleListComponent extends BasePage implements OnInit {
//   goodsAvailableSale: IGoodsAvailableSale[] = [];
//   totalItems: number = 0;
//   params = new BehaviorSubject<ListParams>(new ListParams());
//   data: LocalDataSource = new LocalDataSource();
//   columnFilters: any = [];

//   constructor(
//     private goodsAvailableSaleService: GoodsAvailableSaleService,
//     private modalService: BsModalService
//   ) {
//     super();
//     this.settings.columns = GOODS_AVAILABLE_SALE_COLUMNS;
//     this.settings.actions.delete = true;
//     this.settings.actions.add = false;
//     this.settings.hideSubHeader = false;
//   }

//   ngOnInit(): void {
//     this.data
//       .onChanged()
//       .pipe(takeUntil(this.$unSubscribe))
//       .subscribe(change => {
//         if (change.action === 'filter') {
//           let filters = change.filter.filters;
//           filters.map((filter: any) => {
//             let field = ``;
//             let searchFilter = SearchFilter.ILIKE;
//             field = `filter.${filter.field}`;
//             filter.field == 'id' ||
//             filter.field == 'description' ||
//             filter.field == 'processStatus' ||
//             filter.field == 'quantity' ||
//             filter.field == 'transferentDestiny'
//               ? (searchFilter = SearchFilter.EQ)
//               : (searchFilter = SearchFilter.ILIKE);
//             if (filter.search !== '') {
//               this.columnFilters[field] = `${searchFilter}:${filter.search}`;
//             } else {
//               delete this.columnFilters[field];
//             }
//           });
//           this.getDeductives();
//         }
//       });
//     this.params
//       .pipe(takeUntil(this.$unSubscribe))
//       .subscribe(() => this.getDeductives());
//   }

//   getDeductives() {
//     this.loading = true;
//     let params = {
//       ...this.params.getValue(),
//       ...this.columnFilters,
//     };
//     this.goodsAvailableSaleService.getAll(params).subscribe({
//       next: response => {
//         this.goodsAvailableSale = response.data;
//         this.data.load(this.goodsAvailableSale);
//         this.data.refresh();
//         this.totalItems = response.count;
//         this.loading = false;
//       },
//       error: error => (this.loading = false),
//     });
//   }

//   openForm(goodsAvailable?: IGoodsAvailableSale) {
//     console.log('goodsAvailable ', goodsAvailable)
//     const modalConfig = MODAL_CONFIG;
//     modalConfig.initialState = {
//       goodsAvailable,
//       callback: (next: boolean) => {
//         if (next) this.getDeductives();
//       },
//     };
//     this.modalService.show(GoodsAvailableSaleFormComponent, modalConfig);
//   }

//   showDeleteAlert(goodsAvailable: IGoodsAvailableSale) {
//     console.log('goodsAvailable ', goodsAvailable)
//     this.alertQuestion(
//       'warning',
//       'Eliminar',
//       'Desea eliminar este registro?'
//     ).then(question => {
//       if (question.isConfirmed) {
//         this.delete(goodsAvailable.id);
//         Swal.fire('Borrado', '', 'success');
//       }
//     });
//   }

//   delete(id: number) {
//     this.goodsAvailableSaleService.remove(id).subscribe({
//       next: () => this.getDeductives(),
//     });
//   }
// }
