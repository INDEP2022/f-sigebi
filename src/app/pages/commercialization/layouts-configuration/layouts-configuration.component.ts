import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import {
  IComerLayouts,
  IComerLayoutsH,
} from 'src/app/core/models/ms-parametercomer/parameter';
import { LayoutsConfigService } from 'src/app/core/services/ms-parametercomer/layouts-config.service';
import { BasePage } from 'src/app/core/shared/base-page';

import {
  EXAMPLE_DAT2,
  EXAMPLE_DAT3,
  EXAMPLE_DAT4,
  EXAMPLE_DATA,
  LAYOUTS_COLUMNS1,
  LAYOUTS_COLUMNS2,
  LAYOUTS_COLUMNS3,
  LAYOUTS_COLUMNS4,
  LAYOUTS_COLUMNS5,
  LAYOUTS_COLUMNS6,
} from './layouts-config-columns';

@Component({
  selector: 'app-layouts-configuration',
  templateUrl: './layouts-configuration.component.html',
  styleUrls: ['layouts-configuration.component.scss'],
})
export class LayoutsConfigurationComponent extends BasePage implements OnInit {
  title = 'Layous';
  layoutsList: IComerLayouts[] = [];
  idLayout: number = 0;
  layoutDuplicated: IComerLayouts;
  layousthList: IComerLayoutsH[] = [];
  valid: boolean = false;
  layout: IComerLayouts;
  provider: any;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  totalItems2: number = 0;
  form: FormGroup = new FormGroup({});
  edit: boolean = false;
  @Output() onConfirm = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private layoutsConfigService: LayoutsConfigService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getLayoutH();
    this.prepareForm();
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getLayouts());
  }

  prepareForm() {
    this.form = this.fb.group({
      evento: [null, [Validators.required]],
      lote: [null, [Validators.required]],
      oficio: [null, [Validators.required]],
      diridoA: [null, [Validators.required]],
      puesto: [null, [Validators.required]],
      parrafo1: [null, [Validators.required]],
      adjudicatorio: [null, [Validators.required]],
      factura: [null, [Validators.required]],
      fechaFactura: [null, [Validators.required]],
      parrafo2: [null, [Validators.required]],
      firmante: [null, [Validators.required]],
      ccp1: [null, [Validators.required]],
      ccp2: [null, [Validators.required]],
    });
    if (this.provider !== undefined) {
      this.edit = true;
      this.form.patchValue(this.provider);
    } else {
      this.edit = false;
    }
  }

  duplicateLayouts() {
    let params = {
      id: this.settings5.columns.id,
      descLayout: this.settings5.columns.descLayout,
      screenKey: this.settings5.columns.screenKey,
      table: this.settings5.columns.table,
      criterion: this.settings5.columns.criterion,
      indActive: this.settings5.columns.indActive,
      registryNumber: this.settings5.columns.registryNumber,
    };
  }

  userRowSelect(event: any) {
    this.layoutsConfigService.getByIdH(event.data.id).subscribe({
      next: data => {
        this.layoutsList.forEach(o => {
          if (o.idLayout.id === data.id) {
            this.idLayout = data.id;
            console.log(this.idLayout);
            this.valid = true;
          }
        });
      },
      error: error => {
        this.loading = false;
        this.onLoadToast('error', 'Layout no existe!!', '');
        return;
      },
    });
  }

  // findOne(id: number) {
  //   this.layoutsConfigService.findOne(id).subscribe({
  //     next: data => {
  //       this.layoutDuplicated = data.id;
  //     },
  //     error: error => {
  //       this.loading = false;
  //       this.onLoadToast('error', 'Layout no existe!!', '');
  //       return;
  //     },
  //   });
  // }

  duplicar() {
    this.loading = false;
    this.layoutsConfigService.create(Number(this.idLayout)).subscribe({
      next: data => this.handleSuccess(),
      error: error => {
        this.loading = false;
        this.onLoadToast('error', 'No se puede duplicar layout!!', '');
        return;
      },
    });
  }

  handleSuccess() {
    const message: string = 'Dup´licado';
    this.onLoadToast('success', `${message} Correctamente`, '');
    this.loading = false;
    this.onConfirm.emit(true);
  }

  getLayouts() {
    this.loading = true;
    this.layoutsConfigService.getAllLayouts(this.params.getValue()).subscribe({
      next: data => {
        this.layoutsList = data.data;
        this.totalItems = data.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  getLayoutH() {
    this.loading = true;
    this.layoutsConfigService.getAllLayoutsH(this.params.getValue()).subscribe({
      next: data => {
        this.layousthList = data.data;
        //console.log(this.layousthList);
        this.totalItems = data.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  settings1 = {
    ...TABLE_SETTINGS,
    actions: false,
    columns: {
      ...LAYOUTS_COLUMNS1,
    },
    noDataMessage: 'No se encontrarón registros',
  };

  data = EXAMPLE_DATA;

  settings2 = {
    ...TABLE_SETTINGS,
    actions: false,
    columns: { ...LAYOUTS_COLUMNS2 },
    noDataMessage: 'No se encontrarón registros',
  };

  data2 = EXAMPLE_DAT2;

  settings3 = {
    ...TABLE_SETTINGS,
    actions: false,
    columns: { ...LAYOUTS_COLUMNS3 },
    noDataMessage: 'No se encontrarón registros',
  };

  data3 = EXAMPLE_DAT3;

  settings4 = {
    ...TABLE_SETTINGS,
    actions: false,
    columns: { ...LAYOUTS_COLUMNS4 },
    noDataMessage: 'No se encontrarón registros',
  };

  data4 = EXAMPLE_DAT4;

  settings5 = {
    ...TABLE_SETTINGS,
    editable: true,
    actions: false,
    columns: { ...LAYOUTS_COLUMNS5 },
    noDataMessage: 'No se encontrarón registros',
  };

  data5 = this.layousthList;

  settings6 = {
    ...TABLE_SETTINGS,
    actions: false,
    columns: { ...LAYOUTS_COLUMNS6 },
    noDataMessage: 'No se encontrarón registros',
  };

  data6 = this.layoutsList;
}
