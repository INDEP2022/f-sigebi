import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IComerLayoutsH } from 'src/app/core/models/ms-parametercomer/parameter';
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
  //layout: IComerLayouts;
  layout: any[];
  layoutHSelected: IComerLayoutsH[];
  isSelected: string;
  layoutH: any;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  totalItems2: number = 0;
  form: FormGroup = new FormGroup({});

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
  }

  duplicateLayouts() {
    let params = {
      id: this.form.controls['idLayout'].value,
      descLayout: this.form.controls['descLayout'].value,
      screenKey: this.form.controls['screenKey'].value,
      table: this.form.controls['table'].value,
      criterion: this.form.controls['criterion'].value,
      indActive: this.form.controls['indActive'].value,
      registryNumber: this.form.controls['indActive'].value,
    };
    this.loading = true;
    // this.layoutH.forEach((obj: any) => {
    //   if (obj.id != undefined) {
    //     this.isSelected += obj.id + ',';
    //   }
    // })
    // this.isSelected = this.isSelected.slice(0, -1);
    this.layoutsConfigService.create(this.form.value).subscribe({
      next: response => {
        this.totalItems = response.count;
        this.loading = false;
        this.onConfirm.emit(this.form.value);
        setTimeout(() => {
          this.onLoadToast('success', 'Layout duplicado!', '');
        }, 2000);
        this.getLayouts();
      },
      error: () => {
        this.loading = false;
        this.onLoadToast('error', 'Error al duplicar layout!', '');
        return;
      },
    });
  }

  getLayouts() {
    this.loading = true;
    this.layoutsConfigService.getAllLayouts(this.params.getValue()).subscribe({
      next: data => {
        this.layout = data.data;
        console.log(this.layout);
        // this.layout = data.data;
        this.totalItems = data.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }
  getLayoutH() {
    this.loading = true;
    this.layoutsConfigService.getAllLayouts(this.params.getValue()).subscribe({
      next: data => {
        this.layoutH = data.data;
        // console.log(this.layoutH)
        // this.layout = data.data;
        this.totalItems2 = data.count;
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
    actions: false,
    columns: { ...LAYOUTS_COLUMNS5 },
    noDataMessage: 'No se encontrarón registros',
  };

  data5 = this.layoutsConfigService.getLayoutsH();

  settings6 = {
    ...TABLE_SETTINGS,
    actions: false,
    columns: { ...LAYOUTS_COLUMNS6 },
    noDataMessage: 'No se encontrarón registros',
  };

  data6 = this.getLayouts();
}
