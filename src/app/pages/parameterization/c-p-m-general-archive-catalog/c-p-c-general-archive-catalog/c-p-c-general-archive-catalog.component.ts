import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BasePage } from 'src/app/core/shared/base-page';
import { BATTERY_COLUMNS } from './battery-colums';
import { LOCKERS_COLUMNS } from './lockers-columns';
import { SHELF_COLUMNS } from './shelf-columns';

@Component({
  selector: 'app-c-p-c-general-archive-catalog',
  templateUrl: './c-p-c-general-archive-catalog.component.html',
  styles: [],
})
export class CPCGeneralArchiveCatalogComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  show = false;
  edit: boolean = false;
  @Output() refresh = new EventEmitter<true>();

  data1: LocalDataSource = new LocalDataSource();
  data2: LocalDataSource = new LocalDataSource();
  data3: LocalDataSource = new LocalDataSource();

  settingsBattery = {
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

  settingsLockers = {
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

  settingsShelf = {
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

  constructor(private fb: FormBuilder) {
    super();
    this.settingsBattery.columns = { ...BATTERY_COLUMNS };
    this.settingsLockers.columns = { ...LOCKERS_COLUMNS };
    this.settingsShelf.columns = { ...SHELF_COLUMNS };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      delegation: [null, [Validators.required]],
      ubication: [null, [Validators.required]],
      responsible: [null, [Validators.required]],
      battery: [null, [Validators.required]],
      generate: [null, [Validators.required]],
      backstage: [null, [Validators.required]],
    });
  }

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
    this.data1.getElements().then((data: any) => {
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
