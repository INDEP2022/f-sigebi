import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { FLYER_SUBJECT_CAT_COLUMNS } from './flyer-subject-catalog-column';
import { FLYER_SUBJECT_CAT_COLUMNS2 } from './flyer-subject-catalog-column2';

@Component({
  selector: 'app-flyer-subject-catalog',
  templateUrl: './flyer-subject-catalog.component.html',
  styles: [],
})
export class FlyerSubjectCatalogComponent extends BasePage implements OnInit {
  columns: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  @Output() refresh = new EventEmitter<true>();
  // data2: LocalDataSource = new LocalDataSource();

  settings1 = {
    ...this.settings,
    actions: {
      columnTitle: 'Acciones',
      edit: true,
      delete: true,
      position: 'right',
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
      createButtonContent: '<i class="bx bxs-save me-1 text-success mx-2"></i>',
      cancelButtonContent:
        '<i class="bx bxs-x-square me-1 text-danger mx-2"></i>',
      confirmCreate: true,
    },
    mode: 'inline',
    hideSubHeader: false,
  };

  settings2 = {
    ...this.settings,
    actions: {
      columnTitle: 'Acciones',
      edit: true,
      delete: true,
      position: 'right',
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
      createButtonContent: '<i class="bx bxs-save me-1 text-success mx-2"></i>',
      cancelButtonContent:
        '<i class="bx bxs-x-square me-1 text-danger mx-2"></i>',
      confirmCreate: true,
    },
    mode: 'inline',
    hideSubHeader: false,
  };

  constructor() {
    super();
    this.settings1.columns = { ...FLYER_SUBJECT_CAT_COLUMNS };
    this.settings2.columns = { ...FLYER_SUBJECT_CAT_COLUMNS2 };
  }

  ngOnInit(): void {
    this.getPagination();
  }

  getPagination() {
    this.columns = this.data;
    this.totalItems = this.columns.length;
  }

  data = [
    {
      code: 4,
      description: 'DEVOLUCIÓN DE BIENES ASEGURADOS',
    },
    {
      code: 5,
      description: 'DOCUMENTACIÓN COMPLEMENTARIA ',
    },
    {
      code: 7,
      description: 'INFORME DE DECOMISO',
    },
    {
      code: 12,
      description: 'AMPARO CONTRA EL SAE',
    },
  ];

  data2 = [
    {
      typeFyer: 'Procesal',
      relationGoods: true,
      userPermission: true,
    },
    {
      typeFyer: 'AdminTransferente',
      relationGoods: false,
      userPermission: true,
    },
    {
      typeFyer: 'Administrativo',
      relationGoods: true,
      userPermission: false,
    },
    {
      typeFyer: 'Procesal',
      relationGoods: false,
      userPermission: false,
    },
  ];

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

  // create() {
  //   this.data1.getElements().then((data: any) => {
  //     this.loading = true;
  //     this.handleSuccess();
  //   });
  // }

  // confirm() {
  //   this.edit ? this.update() : this.create();
  // }

  handleSuccess() {
    this.loading = false;
    this.refresh.emit(true);
  }

  update() {
    this.loading = true;
    this.handleSuccess();
  }
}
