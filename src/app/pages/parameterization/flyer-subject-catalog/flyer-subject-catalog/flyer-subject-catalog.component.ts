import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { FLYER_SUBJECT_CAT_COLUMNS } from './flyer-subject-catalog-column';
import { FLYER_SUBJECT_CAT_COLUMNS2 } from './flyer-subject-catalog-column2';
//models
import { IAffairType } from 'src/app/core/models/catalogs/affair-type-model';
//service
import { AffairTypeService } from 'src/app/core/services/catalogs/affair-type-service';

@Component({
  selector: 'app-flyer-subject-catalog',
  templateUrl: './flyer-subject-catalog.component.html',
  styles: [],
})
export class FlyerSubjectCatalogComponent extends BasePage implements OnInit {
  affairType: IAffairType[] = [];
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

  constructor(private affairTypeService: AffairTypeService) {
    super();
    this.settings1.columns = { ...FLYER_SUBJECT_CAT_COLUMNS };
    this.settings2.columns = { ...FLYER_SUBJECT_CAT_COLUMNS2 };
  }

  ngOnInit(): void {
    this.getPagination();
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getIaffairType());
  }

  getIaffairType() {
    this.loading = true;
    this.affairTypeService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.affairType = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
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

  // data2 = [
  //   {
  //     typeFyer: 'Procesal',
  //     relationGoods: true,
  //     userPermission: true,
  //   },
  //   {
  //     typeFyer: 'AdminTransferente',
  //     relationGoods: false,
  //     userPermission: true,
  //   },
  //   {
  //     typeFyer: 'Administrativo',
  //     relationGoods: true,
  //     userPermission: false,
  //   },
  //   {
  //     typeFyer: 'Procesal',
  //     relationGoods: false,
  //     userPermission: false,
  //   },
  // ];

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

  handleSuccess() {
    this.loading = false;
    this.refresh.emit(true);
  }

  update() {
    this.loading = true;
    this.handleSuccess();
  }
}
