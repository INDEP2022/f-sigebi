import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
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
  constructor() {
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
      add: {
        addButtonContent: '<i class="fa fa-solid fa-plus mx-2"></i>',
        createButtonContent:
          '<i class="bx bxs-save me-1 text-success mx-2"></i>',
        cancelButtonContent:
          '<i class="bx bxs-x-square me-1 text-danger mx-2"></i>',
        confirmCreate: true,
      },
      mode: 'inline',
      hideSubHeader: false,
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
      add: {
        addButtonContent: '<i class="fa fa-solid fa-plus mx-2"></i>',
        createButtonContent:
          '<i class="bx bxs-save me-1 text-success mx-2"></i>',
        cancelButtonContent:
          '<i class="bx bxs-x-square me-1 text-danger mx-2"></i>',
        confirmCreate: true,
      },
      mode: 'inline',
      hideSubHeader: false,
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
      add: {
        addButtonContent: '<i class="fa fa-solid fa-plus mx-2"></i>',
        createButtonContent:
          '<i class="bx bxs-save me-1 text-success mx-2"></i>',
        cancelButtonContent:
          '<i class="bx bxs-x-square me-1 text-danger mx-2"></i>',
        confirmCreate: true,
      },
      mode: 'inline',
      hideSubHeader: false,
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
      add: {
        addButtonContent: '<i class="fa fa-solid fa-plus mx-2"></i>',
        createButtonContent:
          '<i class="bx bxs-save me-1 text-success mx-2"></i>',
        cancelButtonContent:
          '<i class="bx bxs-x-square me-1 text-danger mx-2"></i>',
        confirmCreate: true,
      },
      mode: 'inline',
      hideSubHeader: false,
      columns: { ...SUBSUBSUBTYPE_COLUMNS },
    };
  }

  ngOnInit(): void {}

  onSaveConfirm(event: any) {
    event.confirm.resolve();
    this.onLoadToast('success', 'Elemento Actualizado', '');
  }

  onAddConfirm(event: any) {
    event.confirm.resolve();
    this.onLoadToast('success', 'Elemento Creado', '');
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
    this.loading = false;
    this.refresh.emit(true);
  }

  update() {
    this.loading = true;
    this.handleSuccess();
  }
}
