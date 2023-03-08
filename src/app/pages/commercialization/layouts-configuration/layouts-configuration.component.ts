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
  idLayout: number = 0;
  layoutDuplicated: IComerLayoutsH;
  structureLayout: IComerLayouts;
  layousthList: IComerLayoutsH[] = [];
  totalItems2: number = 0;
  lay: any;
  valid: boolean = false;
  layout: IComerLayouts;
  provider: any;
  id: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  form: FormGroup = new FormGroup({});
  edit: boolean = false;
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
    this.layoutsConfigService.getByIdH(event.data.id).subscribe({
      next: data => {
        this.idLayout = data.id;
        this.layoutDuplicated = event.data;
        console.log(this.idLayout);
        this.getLayouts();
        console.log(this.layoutDuplicated);
        this.valid = true;
      },
      error: error => {
        this.loading = false;
        this.onLoadToast('error', 'Layout no existe!!', '');
        return;
      },
    });
  }
  // userRowStructure(event: any) {
  //   this.layoutsConfigService.getById(this.params.getValue()).subscribe({
  //     next: data => {
  //       // this.idLayout = data.id;
  //       this.structureLayout = event.data;
  //       console.log(this.structureLayout);
  //       // this.valid = true;
  //     },
  //     error: error => {
  //       this.loading = false;
  //       this.onLoadToast('error', 'no hay detalles para éste layout!!', '');
  //       return;
  //     },
  //   });
  // }

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
    try {
      this.loading = false;
      this.layoutsConfigService.createH(this.layoutDuplicated).subscribe({
        next: data => this.handleSuccess(),
        error: error => {
          this.loading = false;
          this.onLoadToast('error', 'No se puede duplicar layout!!', '');
          return;
        },
      });
    } catch {
      console.error('Layout no existe');
    }
  }

  handleSuccess() {
    const message: string = 'Duplicado';
    this.onLoadToast('success', `${message} Correctamente`, '');
    this.loading = false;
    this.onConfirm.emit(true);
    this.getLayoutH();
  }

  getLayouts() {
    this.loading = true;
    this.layoutsConfigService.getAllLayouts(this.params.getValue()).subscribe({
      next: data => {
        this.layoutsList = data.data;
        this.totalItems2 = data.count;
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
  // showDeleteAlert(layout: IComerLayouts) {
  //   this.alertQuestion(
  //     'warning',
  //     'Eliminar',
  //     'Desea eliminar este registro?'
  //   ).then(question => {
  //     if (question.isConfirmed) {
  //       this.layoutsConfigService.remove(layout.idLayout).subscribe({
  //         next: data => {
  //           this.loading = false;
  //           this.onLoadToast('success', 'Detalle de layout eliminado', '');
  //           this.getLayouts();
  //         },
  //         error: error => {
  //           this.onLoadToast('error', 'No se puede eliminar registro', '');
  //           this.loading = false;
  //         },
  //       });
  //     }
  //   });
  // }
  // rowClassFunction({ row }: { row: any; }): any {
  //   console.log("\nRow is ::: ", row.data);
  //   if (row.data == '') {
  //     return 'hide_edit';
  //   } else {
  //     console.error('error al leer filas')
  //   }
  // }
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
    actions: {
      position: 'left',
      edit: {
        confirmSave: true,
      },
      // delete: {
      //   confirmDelete: true,
      //   deleteButtonContent: 'Delete data',
      //   saveButtonContent: 'save',
      //   cancelButtonContent: 'cancel',
      // },
      add: {
        confirmCreate: true,
      },
    },
    columns: { ...LAYOUTS_COLUMNS6 },

    noDataMessage: 'No se encontrarón registros',
  };

  data6 = this.layoutsList;
}
