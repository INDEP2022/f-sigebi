import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
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
import {
  SUBSUBSUBTYPE_COLUMNS,
  SUBSUBTYPE_COLUMNS,
  SUBTYPE_COLUMNS,
  TYPE_COLUMNS,
} from './cat-types-of-goods-columns';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { CatTypesOfGoodsTypesFormComponent } from '../cat-types-of-goods-types-form/cat-types-of-goods-types-form.component';
import { CatTypesOfGoodsSubTypeComponent } from '../cat-types-of-goods-sub-type/cat-types-of-goods-sub-type.component';

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
  idTypeGood: string;
  constructor(
    private goodTypesService: GoodTypeService,
    private goodSubTypesService: GoodSubtypeService,
    private goodSsubtypeService: GoodSsubtypeService,
    private goodSssubtypeService: GoodSssubtypeService,
    private modalService: BsModalService,

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
    // this.subsubTypeSettings = {
    //   ...this.settings,
    //   actions: {
    //     columnTitle: 'Acciones',
    //     edit: true,
    //     delete: false,
    //     add: false,
    //     position: 'right',
    //     width: '10%',
    //   },
    //   edit: {
    //     ...this.settings.edit,
    //     saveButtonContent: '<i class="bx bxs-save me-1 text-success mx-2"></i>',
    //     cancelButtonContent:
    //       '<i class="bx bxs-x-square me-1 text-danger mx-2"></i>',
    //     confirmSave: true,
    //   },
    //   mode: 'inline',
    //   // hideSubHeader: false,
    //   columns: { ...SUBSUBTYPE_COLUMNS },
    // };
    // this.subsubsubTypeSettings = {
    //   ...this.settings,
    //   actions: {
    //     columnTitle: 'Acciones',
    //     edit: true,
    //     delete: false,
    //     add: false,
    //     position: 'right',
    //     width: '10%',
    //   },
    //   edit: {
    //     ...this.settings.edit,
    //     saveButtonContent: '<i class="bx bxs-save me-1 text-success mx-2"></i>',
    //     cancelButtonContent:
    //       '<i class="bx bxs-x-square me-1 text-danger mx-2"></i>',
    //     confirmSave: true,
    //   },
    //   mode: 'inline',
    //   // hideSubHeader: false,
    //   columns: { ...SUBSUBSUBTYPE_COLUMNS },
    // };
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
      error: error => (this.loading = false),
    });
  }
  getGoodSsubtypes() {
    this.loading = true;
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
      error: error => (this.loading = false),
    });
  }
  getGoodSssubtypes() {
    this.loading = true;
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
      error: error => (this.loading = false),
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
    // this.loading = true;
    // let value = {
    //   id: event['newData'].id,
    //   idTypeGood: event['newData'].idTypeGood.id,
    //   nameSubtypeGood: event['newData'].nameSubtypeGood,
    //   noPhotography: event['newData'].noPhotography,
    //   descriptionPhotography: event['newData'].descriptionPhotography,
    //   noRegister: event['newData'].noRegister,
    //   version: event['newData'].version,
    //   creationUser: event['newData'].creationUser,
    //   creationDate: event['newData'].creationDate,
    //   editionUser: event['newData'].editionUser,
    //   modificationDate: event['newData'].modificationDate,
    // };

    // event.confirm.resolve();

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
  onSaveConfirm2(event: any) {
    let value = {
      id: event['newData'].id,
      noSubType: event['newData'].noSubType.id,
      noType: event['newData'].noType.id,
      description: event['newData'].id,
      noRegister: event['newData'].id,
    };
    const ids = {
      id: event['newData'].id,
      noSubType: event['newData'].noSubType.id,
      noType: event['newData'].noType.id,
    };
    this.goodSsubtypeService.updateByIds(ids, value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
    event.confirm.resolve();
  }
  onSaveConfirm3(event: any) {
    let value = {
      numClasifGoods: event['newData'].numClasifGoods,
      id: event['newData'].id,
      description: event['newData'].description,
      numSsubType: event['newData'].numSsubType.id,
      numSubType: event['newData'].numSubType.id,
      numType: event['newData'].numType.id,
      numRegister: event['newData'].numRegister,
      numClasifAlterna: event['newData'].numClasifAlterna,
    };
    const ids = {
      numClasifGoods: event['newData'].numClasifGoods,
      id: event['newData'].id,
      numSsubType: (event['newData'].numSsubType as IGoodSsubType).id,
      numSubType: (event['newData'].numSubType as IGoodSubType).id,
      numType: (event['newData'].numType as IGoodType).id,
    };

    this.goodSssubtypeService.updateByIds(ids, value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
    event.confirm.resolve();
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
  create() {
    this.dataType.getElements().then((data: any) => {
      this.loading = true;
      this.handleSuccess();
    });
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', 'Tipos de bienes', `${message} Correctamente`);
    this.loading = false;
    this.refresh.emit(true);
  }

  update() {
    this.loading = true;
    this.handleSuccess();
  }
}
