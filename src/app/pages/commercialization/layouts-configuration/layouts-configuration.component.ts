import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import {
  IComerLayouts,
  IComerLayoutsH,
  IL,
  ILay,
} from 'src/app/core/models/ms-parametercomer/parameter';
import { LayoutsConfigService } from 'src/app/core/services/ms-parametercomer/layouts-config.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { LayoutsConfigurationModalComponent } from './layouts-configuration-modal/layouts-configuration-modal.component';

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
  layoutDuplicated: IComerLayoutsH;
  structureLayout: IComerLayouts;
  layousthList: IComerLayoutsH[] = [];
  lay: any;
  allLayouts: any;
  valid: boolean = false;
  layout: IL;
  provider: any;
  idLayout: number = 0;
  idStructure: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  form: FormGroup = new FormGroup({});
  edit: boolean = false;
  rowSelected: boolean = false;
  rowAllotment: string = null;
  selectedRow: any = null;
  rowSelectedGood: boolean = false;
  columns: any[] = [];
  @Output() refresh = new EventEmitter<true>();
  @Output() onConfirm = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private layoutsConfigService: LayoutsConfigService,
    private modalService: BsModalService
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

  userRowSelect(event: any) {
    this.idLayout = event.data.idLayout.id;
    console.log(this.idLayout);
    let params: ILay = {
      idLayout: event.data.idLayout.id,
      idConsec: event.data.idConsec,
    };
    let paramsId: IL = {
      idLayout: event.data.idLayout.id,
    };
    let paramsUpdate: IComerLayouts = {
      idLayout: event.data.idLayout.id,
      idConsec: event.data.idConsec,
      position: event.data.position,
      column: event.data.column,
      indActive: event.data.column,
      type: event.data.type,
      length: event.data.length,
      constant: event.data.constant,
      carFilling: event.data.carFilling,
      justification: event.data.justification,
      decimal: event.data.decimal,
      dateFormat: event.data.dateFormat,
      registryNumber: event.data.registryNumber,
    };
    this.layoutsConfigService.findOne(params).subscribe({
      next: data => {
        this.layout = paramsId;
        this.structureLayout = paramsUpdate;
        console.log(this.structureLayout);
        this.valid = true;
        this.layoutsConfigService.getByIdH(this.idLayout).subscribe({
          next: data => {
            this.layoutDuplicated = data;
            console.log(this.layoutDuplicated);
            this.valid = true;
            this.rowSelected = true;
          },
          error: error => {
            this.loading = false;
            this.onLoadToast('error', 'Layout no existe!!', '');
            return;
          },
        });
      },
      error: error => {
        this.loading = false;
        this.onLoadToast('error', 'Layout no existe!!', '');
        return;
      },
    });
  }

  userRowLayoutSelect(event: any) {
    this.idLayout = event.data.id;
    console.log(this.idLayout);
    this.layoutsConfigService.getByIdH(this.idLayout).subscribe({
      next: data => {
        this.layoutDuplicated = data;
        console.log(this.layoutDuplicated);
        this.rowSelected = true;
        this.valid = true;
      },
      error: error => {
        this.loading = false;
        this.onLoadToast('error', 'error en la búsqueda!!', '');
        return;
      },
    });
  }

  selectRowGood() {
    this.rowSelectedGood = true;
  }

  duplicar() {
    this.loading = false;
    this.layoutsConfigService.create(this.structureLayout).subscribe({
      next: data => {
        console.log('creado' + data);
        this.valid = true;
        this.rowSelected = true;
        // this.duplicaLayout();
        this.handleSuccess();
      },
      error: error => {
        this.loading = false;
        this.onLoadToast('error', 'No se puede duplicar layout!!', '');
        return;
      },
    });
  }
  // duplicaLayout() {
  //   this.layoutsConfigService.createH(this.layoutDuplicated).subscribe({
  //     next: data1 => {
  //       console.log('creado' + data1);
  //     },
  //     error: error => {
  //       this.loading = false;
  //       this.onLoadToast('error', 'No se puede duplicar layout!!', '');
  //       return;
  //     },
  //   });
  // }

  handleSuccess() {
    const message: string = 'Duplicado';
    this.onLoadToast('success', `${message} Correctamente`, '');
    this.loading = false;
    this.onConfirm.emit(true);
    this.getLayouts();
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

  openForm(provider?: IComerLayouts) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      provider,
      callback: (next: boolean) => {
        if (next) this.getLayouts();
      },
    };
    this.modalService.show(LayoutsConfigurationModalComponent, modalConfig);
  }

  openModal(context?: Partial<LayoutsConfigurationModalComponent>) {
    const modalRef = this.modalService.show(
      LayoutsConfigurationModalComponent,
      {
        initialState: { ...context },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
  }

  showDeleteAlert(event: any) {
    let del: ILay = {
      idLayout: event.data.idLayout.id,
      idConsec: event.data.idConsec,
    };
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.layoutsConfigService.remove(del).subscribe({
          next: data => {
            this.loading = false;
            this.onLoadToast('success', 'Layout eliminado', '');
            this.getLayouts();
          },
          error: error => {
            this.onLoadToast('error', 'No se puede eliminar registro', '');
            this.loading = false;
          },
        });
      }
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

  data5 = this.layoutsList;

  settings6 = {
    ...TABLE_SETTINGS,
    actions: {
      columnTitle: 'Acciones',
      edit: true,
      delete: true,
      add: false,
      position: 'right',
    },
    columns: { ...LAYOUTS_COLUMNS6 },

    noDataMessage: 'No se encontrarón registros',
  };

  data6 = this.layoutsList;
}
