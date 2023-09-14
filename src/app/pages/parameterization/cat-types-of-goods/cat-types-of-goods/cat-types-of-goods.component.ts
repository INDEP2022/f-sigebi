import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IGoodSssubtype } from 'src/app/core/models/catalogs/good-sssubtype.model';
import { IGoodSsubType } from 'src/app/core/models/catalogs/good-ssubtype.model';
import { IGoodSubType } from 'src/app/core/models/catalogs/good-subtype.model';
import { IGoodType } from 'src/app/core/models/catalogs/good-type.model';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { GoodSsubtypeService } from 'src/app/core/services/catalogs/good-ssubtype.service';
import { GoodSubtypeService } from 'src/app/core/services/catalogs/good-subtype.service';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { CatTypesOfGoodsSubSubSubTypeComponent } from '../cat-types-of-goods-sub-sub-sub-type/cat-types-of-goods-sub-sub-sub-type.component';
import { CatTypesOfGoodsSubSubTypeComponent } from '../cat-types-of-goods-sub-sub-type/cat-types-of-goods-sub-sub-type.component';
import { CatTypesOfGoodsSubTypeComponent } from '../cat-types-of-goods-sub-type/cat-types-of-goods-sub-type.component';
import { CatTypesOfGoodsTypesFormComponent } from '../cat-types-of-goods-types-form/cat-types-of-goods-types-form.component';
import {
  SUBSUBSUBTYPE_COLUMNS,
  SUBSUBTYPE_COLUMNS,
  SUBTYPE_COLUMNS,
  TYPE_COLUMNS,
} from './cat-types-of-goods-columns';

@Component({
  selector: 'app-cat-types-of-goods',
  templateUrl: './cat-types-of-goods.component.html',
  styles: [],
})
export class CatTypesOfGoodsComponent extends BasePage implements OnInit {
  edit: boolean = false;
  @Output() refresh = new EventEmitter<true>();
  dataType: LocalDataSource = new LocalDataSource();
  dataSubType: LocalDataSource = new LocalDataSource();
  dataSubsubType: LocalDataSource = new LocalDataSource();
  datasubsubsubType: LocalDataSource = new LocalDataSource();
  typeSettings = { ...this.settings };
  subTypeSettings = { ...this.settings };
  subsubTypeSettings = { ...this.settings };
  subsubsubTypeSettings = { ...this.settings };

  paragraphs: IGoodType[] = [];
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  paragraphs1: IGoodSubType[] = [];
  data1: LocalDataSource = new LocalDataSource();
  columnFilters1: any = [];
  totalItems1: number = 0;
  params1 = new BehaviorSubject<ListParams>(new ListParams());

  paragraphs2: IGoodSsubType[] = [];
  data2: LocalDataSource = new LocalDataSource();
  columnFilters2: any = [];
  totalItems2: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());

  paragraphs3: IGoodSssubtype[] = [];
  data3: LocalDataSource = new LocalDataSource();
  columnFilters3: any = [];
  totalItems3: number = 0;
  params3 = new BehaviorSubject<ListParams>(new ListParams());

  rowTypeGoods: boolean = false;
  rowsSsTypeGoods: boolean = false;
  rowsSssTypeGoods: boolean = false;
  idTypeGood: string;
  idSsTypeGood: string;
  idSssTypeGood: string;
  numGood: string;
  constructor(
    private goodTypesService: GoodTypeService,
    private goodSubTypesService: GoodSubtypeService,
    private goodSsubtypeService: GoodSsubtypeService,
    private goodSssubtypeService: GoodSssubtypeService,
    private modalService: BsModalService
  ) {
    super();
    this.typeSettings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        add: false,
        position: 'right',
      },
      columns: { ...TYPE_COLUMNS },
    };
    this.subTypeSettings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        add: false,
        position: 'right',
        // width: '10%',
      },
      // hideSubHeader: false,
      columns: { ...SUBTYPE_COLUMNS },
    };
    this.subsubTypeSettings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        add: false,
        position: 'right',
        width: '10%',
      },
      columns: { ...SUBSUBTYPE_COLUMNS },
    };
    this.subsubsubTypeSettings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        add: false,
        position: 'right',
        width: '10%',
      },
      columns: { ...SUBSUBSUBTYPE_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            /*SPECIFIC CASES*/
            filter.field == 'id'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getExample();
        }
      });

    this.data1
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            /*SPECIFIC CASES*/
            filter.field == 'id'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params1 = this.pageFilter(this.params1);
          this.getSubExample();
        }
      });
    this.data2
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            /*SPECIFIC CASES*/
            filter.field == 'id'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params2 = this.pageFilter(this.params2);
          this.getGoodSsubtypes();
        }
      });
    this.data3
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            /*SPECIFIC CASES*/
            filter.field == 'id'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params3 = this.pageFilter(this.params3);
          this.getGoodSssubtypes();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
    this.params1
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getSubExample());
    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoodSsubtypes());
    this.params3
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoodSssubtypes());
  }

  getExample() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.goodTypesService.getAll(params).subscribe({
      next: response => {
        console.log(response);
        this.paragraphs = response.data;
        this.data.load(this.paragraphs);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }
  selectTypeGoods(event: any) {
    this.rowTypeGoods = true;
    this.rowsSsTypeGoods = false;
    this.idTypeGood = event.data.id;
    this.getSubExample(event.data.id);
  }

  getSubExample(id?: string) {
    this.loading = true;
    if (id) {
      this.params1.getValue()['filter.idTypeGood'] = id;
    }
    let params = {
      ...this.params1.getValue(),
      ...this.columnFilters1,
    };
    this.goodSubTypesService.getAll(params).subscribe({
      next: response => {
        this.paragraphs1 = response.data;
        this.data1.load(this.paragraphs1);
        this.data1.refresh();
        this.totalItems1 = response.count;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.data1.load([]);
        this.data1.refresh();
        this.totalItems1 = 0;
      },
    });
  }
  selectSsubTypeGoods(event: any) {
    console.log(event.data);
    this.rowsSsTypeGoods = true;
    this.rowsSssTypeGoods = false;
    this.idSsTypeGood = event.data.id;
    this.getGoodSsubtypes(event.data.id);
  }
  getGoodSsubtypes(id?: string) {
    this.loading = true;
    if (id) {
      this.params2.getValue()['filter.noSubType'] = id;
      this.params2.getValue()['filter.noType'] = this.idTypeGood;
    }
    let params = {
      ...this.params2.getValue(),
      ...this.columnFilters2,
    };
    this.goodSsubtypeService.getAll(params).subscribe({
      next: response => {
        this.paragraphs2 = response.data;
        this.data2.load(this.paragraphs2);
        this.data2.refresh();
        this.totalItems2 = response.count;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.data2.load([]);
        this.data2.refresh();
      },
    });
  }
  selectSssubTypeGoods(event: any) {
    console.log(event.data);
    this.rowsSssTypeGoods = true;
    this.idSssTypeGood = event.data.id;
    this.getGoodSssubtypes(event.data.id);
  }
  getGoodSssubtypes(id?: string) {
    this.loading = true;
    if (id) {
      this.params3.getValue()['filter.numSubType'] = this.idSsTypeGood;
      this.params3.getValue()['filter.numType'] = this.idTypeGood;
      this.params3.getValue()['filter.numSsubType'] = id;
    }
    let params = {
      ...this.params3.getValue(),
      ...this.columnFilters3,
    };
    this.goodSssubtypeService.getAll(params).subscribe({
      next: response => {
        this.paragraphs3 = response.data;
        this.data3.load(this.paragraphs3);
        this.data3.refresh();
        this.totalItems3 = response.count;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.data3.load([]);
        this.data3.refresh();
        this.totalItems3 = 0;
      },
    });
  }
  onSaveConfirm(event?: any) {
    const data = event != null ? event.data : null;
    let config: ModalOptions = {
      initialState: {
        data,
        callback: (next: boolean) => {
          if (next) {
            this.params
              .pipe(takeUntil(this.$unSubscribe))
              .subscribe(() => this.getExample());
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(CatTypesOfGoodsTypesFormComponent, config);
  }
  onSaveConfirm1(event?: any) {
    const data = event != null ? event.data : null;
    const idTypeGood = this.idTypeGood;
    let config: ModalOptions = {
      initialState: {
        data,
        idTypeGood,
        callback: (next: boolean) => {
          if (next) {
            this.params
              .pipe(takeUntil(this.$unSubscribe))
              .subscribe(() => this.getSubExample());
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(CatTypesOfGoodsSubTypeComponent, config);
  }
  onSaveConfirm2(event?: any) {
    const data = event != null ? event.data : null;
    const idTypeGood = this.idTypeGood;
    const idSsTypeGood = this.idSsTypeGood;
    let config: ModalOptions = {
      initialState: {
        data,
        idTypeGood,
        idSsTypeGood,
        callback: (next: boolean) => {
          if (next) {
            this.params
              .pipe(takeUntil(this.$unSubscribe))
              .subscribe(() => this.getGoodSsubtypes());
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(CatTypesOfGoodsSubSubTypeComponent, config);
  }
  onSaveConfirm3(event?: any) {
    const data = event != null ? event.data : null;
    const idTypeGood = this.idTypeGood;
    const idSsTypeGood = this.idSsTypeGood;
    const idSssTypeGood = this.idSssTypeGood;
    //const numGood = 'hola';
    //console.log(event.data.numClasifGoods);
    let config: ModalOptions = {
      initialState: {
        data,
        idTypeGood,
        idSsTypeGood,
        idSssTypeGood,
        //numGood,
        callback: (next: boolean) => {
          if (next) {
            this.params
              .pipe(takeUntil(this.$unSubscribe))
              .subscribe(() => this.getGoodSssubtypes());
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(CatTypesOfGoodsSubSubSubTypeComponent, config);
  }

  selectedTypeGoods(data: any) {
    console.log(data);
  }

  onDeleteConfirm(event: any) {
    // console.log(event);
    // this.deleteTypeGood(event['data']);
    // event.confirm.resolve();
  }
  // deleteTypeGood(drawer: any) {
  //   console.log(drawer);
  //   this.alertQuestion(
  //     'warning',
  //     'Eliminar',
  //     '¿Desea eliminar este registro?'
  //   ).then(question => {
  //     if (question.isConfirmed) {
  //       this.goodTypesService.remove(drawer.id).subscribe({
  //         next: (resp: any) => {
  //           console.log(resp);
  //           if (resp) {
  //             this.onLoadToast('success', 'Eliminado correctamente', '');
  //             this.params
  //               .pipe(takeUntil(this.$unSubscribe))
  //               .subscribe(() => this.getExample());
  //           }
  //         },
  //       });
  //     }
  //   });
  // }
}
