import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
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
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  paragraphs1: IGoodSubType[] = [];
  totalItems1: number = 0;
  params1 = new BehaviorSubject<ListParams>(new ListParams());

  paragraphs2: IGoodSsubType[] = [];
  totalItems2: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());

  paragraphs3: IGoodSssubtype[] = [];
  totalItems3: number = 0;
  params3 = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private goodTypesService: GoodTypeService,
    private goodSubTypesService: GoodSubtypeService,
    private goodSsubtypeService: GoodSsubtypeService,
    private goodSssubtypeService: GoodSssubtypeService
  ) {
    super();
    this.typeSettings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        position: 'right',
        width: '10%',
      },
      edit: {
        ...this.settings.edit,
        saveButtonContent: '<i class="bx bxs-save me-1 text-success mx-2"></i>',
        cancelButtonContent:
          '<i class="bx bxs-x-square me-1 text-danger mx-2"></i>',
        confirmSave: true,
      },
      // add: {
      //   addButtonContent: '<i class="fa fa-solid fa-plus mx-2"></i>',
      //   createButtonContent:
      //     '<i class="bx bxs-save me-1 text-success mx-2"></i>',
      //   cancelButtonContent:
      //     '<i class="bx bxs-x-square me-1 text-danger mx-2"></i>',
      //   confirmCreate: true,
      // },
      mode: 'inline',
      // hideSubHeader: false,
      columns: { ...TYPE_COLUMNS },
    };
    this.subTypeSettings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        position: 'right',
        width: '10%',
      },
      edit: {
        ...this.settings.edit,
        saveButtonContent: '<i class="bx bxs-save me-1 text-success mx-2"></i>',
        cancelButtonContent:
          '<i class="bx bxs-x-square me-1 text-danger mx-2"></i>',
        confirmSave: true,
      },
      // add: {
      //   addButtonContent: '<i class="fa fa-solid fa-plus mx-2"></i>',
      //   createButtonContent:
      //     '<i class="bx bxs-save me-1 text-success mx-2"></i>',
      //   cancelButtonContent:
      //     '<i class="bx bxs-x-square me-1 text-danger mx-2"></i>',
      //   confirmCreate: true,
      // },
      mode: 'inline',
      // hideSubHeader: false,
      columns: { ...SUBTYPE_COLUMNS },
    };
    this.subsubTypeSettings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        position: 'right',
        width: '10%',
      },
      edit: {
        ...this.settings.edit,
        saveButtonContent: '<i class="bx bxs-save me-1 text-success mx-2"></i>',
        cancelButtonContent:
          '<i class="bx bxs-x-square me-1 text-danger mx-2"></i>',
        confirmSave: true,
      },
      // add: {
      //   addButtonContent: '<i class="fa fa-solid fa-plus mx-2"></i>',
      //   createButtonContent:
      //     '<i class="bx bxs-save me-1 text-success mx-2"></i>',
      //   cancelButtonContent:
      //     '<i class="bx bxs-x-square me-1 text-danger mx-2"></i>',
      //   confirmCreate: true,
      // },
      mode: 'inline',
      // hideSubHeader: false,
      columns: { ...SUBSUBTYPE_COLUMNS },
    };
    this.subsubsubTypeSettings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        position: 'right',
        width: '10%',
      },
      edit: {
        ...this.settings.edit,
        saveButtonContent: '<i class="bx bxs-save me-1 text-success mx-2"></i>',
        cancelButtonContent:
          '<i class="bx bxs-x-square me-1 text-danger mx-2"></i>',
        confirmSave: true,
      },
      // add: {
      //   addButtonContent: '<i class="fa fa-solid fa-plus mx-2"></i>',
      //   createButtonContent:
      //     '<i class="bx bxs-save me-1 text-success mx-2"></i>',
      //   cancelButtonContent:
      //     '<i class="bx bxs-x-square me-1 text-danger mx-2"></i>',
      //   confirmCreate: true,
      // },
      mode: 'inline',
      // hideSubHeader: false,
      columns: { ...SUBSUBSUBTYPE_COLUMNS },
    };
  }

  ngOnInit(): void {
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
    this.goodTypesService.getAll(this.params.getValue()).subscribe({
      next: response => {
        console.log(response);
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }
  getSubExample() {
    this.loading = true;
    this.goodSubTypesService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs1 = response.data;
        this.totalItems1 = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }
  getGoodSsubtypes() {
    this.loading = true;
    this.goodSsubtypeService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs2 = response.data;
        this.totalItems2 = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }
  getGoodSssubtypes() {
    this.loading = true;
    this.goodSssubtypeService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs3 = response.data;
        this.totalItems3 = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }
  onSaveConfirm(event: any) {
    this.loading = true;
    this.goodTypesService
      .update(event['newData'].id, event['newData'])
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
    event.confirm.resolve();
  }
  onSaveConfirm1(event: any) {
    this.loading = true;
    let value = {
      id: event['newData'].id,
      idTypeGood: event['newData'].idTypeGood.id,
      nameSubtypeGood: event['newData'].nameSubtypeGood,
      noPhotography: event['newData'].noPhotography,
      descriptionPhotography: event['newData'].descriptionPhotography,
      noRegister: event['newData'].noRegister,
      version: event['newData'].version,
      creationUser: event['newData'].creationUser,
      creationDate: event['newData'].creationDate,
      editionUser: event['newData'].editionUser,
      modificationDate: event['newData'].modificationDate,
    };
    const ids = {
      id: event['newData'].id,
      idTypeGood: event['newData'].idTypeGood.id,
    };
    this.goodSubTypesService.updateByIds(ids, value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
    event.confirm.resolve();
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
    event.confirm.resolve();
    this.onLoadToast('success', 'Elemento Eliminado', '');
  }

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
