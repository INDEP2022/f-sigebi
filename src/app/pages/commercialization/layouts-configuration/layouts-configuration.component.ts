import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import {
  IComerLayouts,
  IComerLayoutsH,
  IL,
  ILay,
} from 'src/app/core/models/ms-parametercomer/parameter';
import { LayoutsConfigService } from 'src/app/core/services/ms-parametercomer/layouts-config.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { LayoutsConfigurationModalComponent } from './layouts-configuration-modal/layouts-configuration-modal.component';

import { LocalDataSource } from 'ng2-smart-table';
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
import { LayoutsStructureConfigurationModalComponent } from './layouts-structure-configuration-modal/layouts-structure-configuration-modal.component';

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
  // Layouts Table
  dataTableLayouts: LocalDataSource = new LocalDataSource();
  dataTableParamsLayouts = new BehaviorSubject<ListParams>(new ListParams());
  loadingLayouts: boolean = false;
  totalLayouts: number = 0;
  testDataLayouts: any[] = [];
  columnFiltersLayouts: any = [];
  // Layouts Estructura Table
  dataTableLayoutsStructure: LocalDataSource = new LocalDataSource();
  dataTableParamsLayoutsStructure = new BehaviorSubject<ListParams>(
    new ListParams()
  );
  loadingLayoutsStructure: boolean = false;
  totalLayoutsStructure: number = 0;
  testDataLayoutsStructure: any[] = [];
  columnFiltersLayoutsStructure: any = [];

  constructor(
    private fb: FormBuilder,
    private layoutsConfigService: LayoutsConfigService,
    private modalService: BsModalService
  ) {
    super();
  }

  ngOnInit(): void {
    this.selectedRow = null;
    this.getLayoutH();
    this.prepareForm();
    // this.params
    //   .pipe(takeUntil(this.$unSubscribe))
    //   .subscribe(() => this.getLayouts());
    this.loadingDataTableLayouts();
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
    console.log(event);
    if (event.isSelected) {
      this.idLayout = event.data.id;
      this.selectedRow = event.data;
      this.valid = true;
      this.loadingDataTableLayoutsStructure();
    } else {
      this.idLayout = null;
      this.selectedRow = null;
      this.valid = false;
    }
    // let params: ILay = {
    //   idLayout: event.data.idLayout.id,
    //   idConsec: event.data.idConsec,
    // };
    // let paramsId: IL = {
    //   idLayout: event.data.idLayout.id,
    // };
    // let paramsUpdate: IComerLayouts = {
    //   idLayout: event.data.idLayout.id,
    //   idConsec: event.data.idConsec,
    //   position: event.data.position,
    //   column: event.data.column,
    //   indActive: event.data.column,
    //   type: event.data.type,
    //   length: event.data.length,
    //   constant: event.data.constant,
    //   carFilling: event.data.carFilling,
    //   justification: event.data.justification,
    //   decimal: event.data.decimal,
    //   dateFormat: event.data.dateFormat,
    //   registryNumber: event.data.registryNumber,
    // };
    // this.layoutsConfigService.findOne(params).subscribe({
    //   next: data => {
    //     this.layout = paramsId;
    //     this.structureLayout = paramsUpdate;
    //     console.log(this.structureLayout);
    //     this.valid = true;
    //     this.layoutsConfigService.getByIdH(this.idLayout).subscribe({
    //       next: data => {
    //         this.layoutDuplicated = data;
    //         console.log(this.layoutDuplicated);
    //         this.valid = true;
    //         this.rowSelected = true;
    //       },
    //       error: error => {
    //         this.loading = false;
    //         this.onLoadToast('error', 'Layout no existe!!', '');
    //         return;
    //       },
    //     });
    //   },
    //   error: error => {
    //     this.loading = false;
    //     this.onLoadToast('error', 'Layout no existe!!', '');
    //     return;
    //   },
    // });
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
        this.onLoadToast('error', 'Error en la Búsqueda', '');
        return;
      },
    });
  }

  selectRowGood() {
    this.rowSelectedGood = true;
  }

  async duplicar() {
    if (this.selectedRow == null) {
      this.alert(
        'warning',
        'Selecciona un Registro de la Tabla "Diseños" para Continuar',
        ''
      );
      return;
    }
    console.log('DUPLICAR ', this.selectedRow);
    this.alertQuestion(
      'warning',
      'Duplicar Diseño',
      '¿Está Seguro(a) en Duplicar el Diseño ' +
        this.selectedRow.id +
        '.' +
        this.selectedRow.descLayout +
        '?'
    ).then(question => {
      if (question.isConfirmed) {
        this.loading = true;
        this.layoutsConfigService.createH(this.selectedRow).subscribe({
          next: data => {
            console.log('creado' + data);
            // this.valid = true;
            // this.rowSelected = true;
            // this.duplicaLayout();
            this.handleSuccess();
          },
          error: error => {
            this.loading = false;
            this.onLoadToast('error', 'No se Puede Duplicar el Diseño', '');
            // return;
          },
        });
      }
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
    this.loadingDataTableLayoutsStructure();
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
            this.onLoadToast('success', 'Diseño Eliminado', '');
            this.getLayouts();
          },
          error: error => {
            this.onLoadToast('error', 'No se Puede Eliminar el Registro', '');
            this.loading = false;
          },
        });
      }
    });
  }

  /**
   * FILTROS DE TABLAS Y FUNCIONES PARA CARGAR DATA
   */

  loadingDataTableLayouts() {
    //Filtrado por columnas
    this.dataTableLayouts
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              email: () => (searchFilter = SearchFilter.ILIKE),
              name: () => (searchFilter = SearchFilter.ILIKE),
            };
            search[filter.field]();

            if (filter.search !== '') {
              this.columnFiltersLayouts[
                field
              ] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFiltersLayouts[field];
            }
          });
          this.dataTableParamsLayouts = this.pageFilter(
            this.dataTableParamsLayouts
          );
          //Su respectivo metodo de busqueda de datos
          this.getLayoutsData();
        }
      });

    // this.columnFiltersLayouts['filter.originId'] = `$eq:${this.originId}`;
    //observador para el paginado
    this.dataTableParamsLayouts
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getLayoutsData());
  }

  getLayoutsData() {
    this.loadingLayouts = true;
    let params = {
      ...this.dataTableParamsLayouts.getValue(),
      ...this.columnFiltersLayouts,
    };
    console.log('PARAMS ', params);
    this.layoutsConfigService.getAllLayoutsH(params).subscribe({
      next: res => {
        console.log('DATA Layouts', res);
        this.testDataLayouts = res.data;
        this.dataTableLayouts.load(this.testDataLayouts);
        this.totalLayouts = res.count;
        this.loadingLayouts = false;
      },
      error: error => {
        console.log(error);
        this.testDataLayouts = [];
        this.dataTableLayouts.load([]);
        this.totalLayouts = 0;
        this.loadingLayouts = false;
      },
    });
  }

  /**
   * FIN FILTROS DE TABLAS Y FUNCIONES PARA CARGAR DATA
   */

  addLayouts() {
    console.log('CREAR ');
    this.openModalLayouts({});
  }

  editLayouts(event: any) {
    console.log('EDITAR ', event);
    if (event) {
      this.openModalLayouts({
        provider: event.data,
        edit: true,
      });
    }
  }

  deleteLayouts(event: any) {
    console.log('ELIMINAR ', event);
    this.alertQuestion(
      'warning',
      'Eliminar Diseño',
      '¿Desea Eliminar este Diseño?'
    ).then(question => {
      if (question.isConfirmed) {
        this.loadingLayouts = true;
        this.layoutsConfigService
          .deletelayoutSH(event.data.id, event.data)
          .subscribe({
            next: data => {
              this.loadingLayouts = false;
              this.alert('success', 'Eliminado Correctamente', ``);
              this.loadingDataTableLayouts();
            },
            error: error => {
              this.loadingLayouts = false;
              this.alert(
                'error',
                'Error al Actualizar',
                'Ocurrió un Error al Actualizar el Diseño'
              );
            },
          });
      }
    });
  }

  openModalLayouts(context?: Partial<LayoutsConfigurationModalComponent>) {
    const modalRef = this.modalService.show(
      LayoutsConfigurationModalComponent,
      {
        initialState: { ...context },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
    modalRef.content.onConfirm.subscribe(data => {
      console.log(data);
      this.loadingDataTableLayouts();
    });
  }

  /**
   * FILTROS DE TABLAS Y FUNCIONES PARA CARGAR DATA
   */

  loadingDataTableLayoutsStructure() {
    //Filtrado por columnas
    this.dataTableLayoutsStructure
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              column: () => (searchFilter = SearchFilter.ILIKE),
              type: () => (searchFilter = SearchFilter.ILIKE),
            };
            search[filter.field]();

            if (filter.search !== '') {
              this.columnFiltersLayoutsStructure[
                field
              ] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFiltersLayoutsStructure[field];
            }
          });
          this.dataTableParamsLayoutsStructure = this.pageFilter(
            this.dataTableParamsLayoutsStructure
          );
          //Su respectivo metodo de busqueda de datos
          this.getLayoutsStructureData();
        }
      });
    //observador para el paginado
    this.dataTableParamsLayoutsStructure
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getLayoutsStructureData());
  }

  getLayoutsStructureData() {
    this.loadingLayoutsStructure = true;
    this.columnFiltersLayoutsStructure[
      'filter.idLayout'
    ] = `$eq:${this.idLayout}`;
    let params = {
      ...this.dataTableParamsLayoutsStructure.getValue(),
      ...this.columnFiltersLayoutsStructure,
    };
    console.log('PARAMS ', params);
    this.layoutsConfigService.getAllLayouts(params).subscribe({
      next: res => {
        console.log('DATA LayoutsStructure', res);
        this.testDataLayoutsStructure = res.data;
        this.dataTableLayoutsStructure.load(this.testDataLayoutsStructure);
        this.totalLayoutsStructure = res.count;
        this.loadingLayoutsStructure = false;
      },
      error: error => {
        console.log(error);
        this.testDataLayoutsStructure = [];
        this.dataTableLayoutsStructure.load([]);
        this.totalLayoutsStructure = 0;
        this.loadingLayoutsStructure = false;
      },
    });
  }

  /**
   * FIN FILTROS DE TABLAS Y FUNCIONES PARA CARGAR DATA
   */

  addLayoutsStructure() {
    if (this.selectedRow == null) {
      this.alert(
        'warning',
        'Selecciona un Registro de la Tabla "Diseños" para continuar',
        ''
      );
      return;
    }
    console.log('CREAR ', this.selectedRow);
    this.openModalLayoutsStructure({ id: this.selectedRow.id });
  }

  editLayoutsStructure(event: any) {
    console.log('EDITAR ', event);
    if (event) {
      this.openModalLayoutsStructure({
        provider: event.data,
        edit: true,
      });
    }
  }

  openModalLayoutsStructure(
    context?: Partial<LayoutsStructureConfigurationModalComponent>
  ) {
    const modalRef = this.modalService.show(
      LayoutsStructureConfigurationModalComponent,
      {
        initialState: { ...context },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
    modalRef.content.onConfirm.subscribe(data => {
      console.log(data);
      this.loadingDataTableLayoutsStructure();
    });
  }

  settings1 = {
    ...TABLE_SETTINGS,
    actions: false,
    columns: {
      ...LAYOUTS_COLUMNS1,
    },
    noDataMessage: 'No se encontraron registros',
  };

  data = EXAMPLE_DATA;

  settings2 = {
    ...TABLE_SETTINGS,
    actions: false,
    columns: { ...LAYOUTS_COLUMNS2 },
    noDataMessage: 'No se encontraron registros',
  };

  data2 = EXAMPLE_DAT2;

  settings3 = {
    ...TABLE_SETTINGS,
    actions: false,
    columns: { ...LAYOUTS_COLUMNS3 },
    noDataMessage: 'No se encontraron registros',
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
    actions: {
      columnTitle: 'Acciones',
      position: 'right',
      add: false,
      edit: true,
      delete: true,
    },
    columns: { ...LAYOUTS_COLUMNS5 },
    noDataMessage: 'No se encontrarón registros',
  };

  data5 = this.layoutsList;

  settings6 = {
    ...TABLE_SETTINGS,
    actions: {
      columnTitle: 'Acciones',
      edit: true,
      delete: false,
      add: false,
      position: 'right',
    },
    columns: { ...LAYOUTS_COLUMNS6 },

    noDataMessage: 'No se encontrarón registros',
  };

  data6 = this.layoutsList;
}
