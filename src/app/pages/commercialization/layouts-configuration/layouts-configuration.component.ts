import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import {
  IComerLayouts,
  IComerLayoutsH,
  IL,
} from 'src/app/core/models/ms-parametercomer/parameter';
import { LayoutsConfigService } from 'src/app/core/services/ms-parametercomer/layouts-config.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { LayoutsConfigurationModalComponent } from './layouts-configuration-modal/layouts-configuration-modal.component';

import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { LAYOUTS_COLUMNS6 } from './layouts-config-columns';
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
  // Cantidades de sumatorias
  lengthTotal: number = 0;
  origin: string;
  settings5 = {
    ...this.settings,
  };
  settings6 = {
    ...this.settings,
  };
  constructor(
    private fb: FormBuilder,
    private layoutsConfigService: LayoutsConfigService,
    private modalService: BsModalService,
    private readonly router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super();
    this.settings5 = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        position: 'right',
        add: false,
        edit: true,
        delete: true,
      },
      columns: {
        id: {
          title: 'Id',
          type: 'string',
          width: '10%',
          sort: false,
        },
        descLayout: {
          title: 'Descripción',
          type: 'string',
          width: '20%',
          sort: false,
        },
        screenKey: {
          title: 'Pantalla',
          type: 'string',
          width: '20%',
          sort: false,
        },
        table_: {
          title: 'Tabla o Vista',
          type: 'string',
          width: '30%',
          sort: false,
        },
        status_active: {
          title: 'Activo',
          sort: false,
          width: '10%',
          type: 'html',
          filter: {
            type: 'list',
            config: {
              selectText: 'Todos',
              list: [
                { value: '1', title: 'Activo' },
                { value: '0', title: 'Inactivo' },
              ],
            },
          },
          valuePrepareFunction: (value: any) => {
            if (value !== null) {
              switch (value) {
                case true:
                  value = `<div class="badge badge-pill bg-success text-wrap ml-3 mr-2">Activo</div>`;
                  return value;
                default:
                  value = `<div class="badge badge-pill bg-danger text-wrap ml-2 mr-2">Inactivo</div>`;
                  return value;
              }
            }
          },
          filterFunction: () => {
            return true;
          },
        },
        criterion: {
          title: 'Filtro de Selección',
          type: 'string',
          width: '20%',
          sort: false,
        },
      },
      edit: {
        editButtonContent:
          '<i class="fa fa-pencil-alt text-warning mx-2 ml-3"></i>',
      },
    };

    this.settings6 = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        add: false,
        position: 'right',
      },
      edit: {
        editButtonContent:
          '<i class="fa fa-pencil-alt text-warning mx-2 ml-3"></i>',
      },
      columns: { ...LAYOUTS_COLUMNS6 },
    };
  }

  ngOnInit(): void {
    this.selectedRow = null;
    this.getLayoutH();
    this.prepareForm();

    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe((params: any) => {
        this.origin = params.origin ?? '';
      });

    this.loadingDataTableLayouts();
    this.loadingDataTableLayoutsStructure();
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
      this.getLayoutsStructureData();
    } else {
      this.idLayout = null;
      this.selectedRow = null;
      this.valid = false;
    }
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
        this.onLoadToast('error', 'Error en la búsqueda', '');
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
        'Selecciona un registro de la tabla "Diseños" para continuar',
        ''
      );
      return;
    }
    console.log('DUPLICAR ', this.selectedRow);
    this.alertQuestion(
      'question',
      'Se duplicará el diseño' +
        this.selectedRow.id +
        '.' +
        this.selectedRow.descLayout,
      '¿Desea continuar?'
    ).then(question => {
      if (question.isConfirmed) {
        this.loading = true;
        this.layoutsConfigService.createH(this.selectedRow).subscribe({
          next: data => {
            console.log('creado' + data);
            this.handleSuccess();
          },
          error: error => {
            this.loading = false;
            this.alert('warning', 'No se puede duplicar el diseño', '');
          },
        });
      }
    });
  }

  handleSuccess() {
    const message: string = 'Duplicado';
    this.alert('success', `Diseño ${message} Correctamente`, '');
    this.loading = false;
    this.getLayoutsData();
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
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            const search: any = {
              length: () => (searchFilter = SearchFilter.EQ),
              justification: () => (searchFilter = SearchFilter.ILIKE),
              id: () => (searchFilter = SearchFilter.EQ),
              descLayout: () => (searchFilter = SearchFilter.ILIKE),
              screenKey: () => (searchFilter = SearchFilter.ILIKE),
              table_: () => (searchFilter = SearchFilter.ILIKE),
              criterion: () => (searchFilter = SearchFilter.ILIKE),
              status_active: () => (searchFilter = SearchFilter.EQ),
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
          this.getLayoutsData();
        }
      });
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
    if (params['filter.status_active']) {
      params['filter.indActive'] = params['filter.status_active'] + '';
      delete params['filter.status_active'];
    }
    if (params['filter.table_']) {
      params['filter.table'] = params['filter.table_'] + '';
      delete params['filter.table_'];
    }
    this.layoutsConfigService.getAllLayoutsH(params).subscribe({
      next: res => {
        console.log('DATA Layouts', res);
        let result = res.data.map((i: any) => {
          i['status_active'] = i.indActive == '1' ? true : false;
          i['table_'] = i.table;
          return i;
        });
        Promise.all(result).then(resp => {
          this.dataTableLayouts.load(res.data);
          this.dataTableLayouts.refresh();
          this.totalLayouts = res.count;
          this.loadingLayouts = false;
        });
      },
      error: error => {
        this.dataTableLayouts.load([]);
        this.dataTableLayouts.refresh();
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
    this.alertQuestion(
      'question',
      'Se eliminará el Diseño',
      '¿Desea continuar?'
    ).then(question => {
      if (question.isConfirmed) {
        this.layoutsConfigService
          .deletelayoutSH(event.data.id, event.data)
          .subscribe({
            next: data => {
              this.alert('success', 'Diseño eliminado correctamente', ``);
              this.getLayoutsData();
            },
            error: async error => {
              let res = await this.getValDelete(event.data.id);
              if (res)
                this.alert(
                  'warning',
                  'No se puede eliminar el registro maestro',
                  'Ya que existen registros de detalle coincidentes.'
                );
              else
                this.alert(
                  'error',
                  'Error al Eliminar',
                  'Ocurrió un error al eliminar el diseño'
                );
            },
          });
      }
    });
  }
  getValDelete(id: string | number) {
    let params = new ListParams();
    params['filter.idLayout'] = `$eq:${id}`;
    return new Promise((resolve, reject) => {
      this.layoutsConfigService.getAllLayouts_TotalT(params).subscribe({
        next: res => {
          resolve(true);
        },
        error: error => {
          resolve(false);
        },
      });
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
      this.getLayoutsData();
    });
  }

  /**
   * FILTROS DE TABLAS Y FUNCIONES PARA CARGAR DATA
   */

  loadingDataTableLayoutsStructure() {
    this.dataTableLayoutsStructure
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            const search: any = {
              position: () => (searchFilter = SearchFilter.EQ),
              length: () => (searchFilter = SearchFilter.EQ),
              constant: () => (searchFilter = SearchFilter.ILIKE),
              carFilling: () => (searchFilter = SearchFilter.ILIKE),
              justification: () => (searchFilter = SearchFilter.EQ),
              decimal: () => (searchFilter = SearchFilter.EQ),
              dateFormat: () => (searchFilter = SearchFilter.ILIKE),
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
          this.getLayoutsStructureData();
        }
      });
    this.dataTableParamsLayoutsStructure
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => {
        if (this.totalLayoutsStructure > 0) this.getLayoutsStructureData();
      });
  }

  getLayoutsStructureData() {
    if (!this.idLayout) return;
    this.loadingLayoutsStructure = true;
    let params = {
      ...this.dataTableParamsLayoutsStructure.getValue(),
      ...this.columnFiltersLayoutsStructure,
    };
    params['filter.idLayout'] = `$eq:${this.idLayout}`;
    this.layoutsConfigService.getAllLayouts_TotalT(params).subscribe({
      next: res => {
        console.log('DATA LayoutsStructure', res);
        this.dataTableLayoutsStructure.load(res.data);
        this.dataTableLayoutsStructure.refresh();
        this.totalLayoutsStructure = res.count;
        this.loadingLayoutsStructure = false;
        this.lengthTotal = !res.totalLength ? 0 : res.totalLength;
      },
      error: error => {
        console.log(error);
        this.testDataLayoutsStructure = [];
        this.dataTableLayoutsStructure.load([]);
        this.dataTableLayoutsStructure.refresh();
        this.totalLayoutsStructure = 0;
        this.lengthTotal = 0;
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
        'Selecciona un registro de la tabla "Diseños" para continuar',
        ''
      );
      return;
    }
    this.openModalLayoutsStructure({
      id: this.selectedRow.id,
      dataLayout: this.selectedRow,
    });
  }

  editLayoutsStructure(event: any) {
    if (event) {
      this.openModalLayoutsStructure({
        provider: event.data,
        edit: true,
        id: this.selectedRow.id,
        dataLayout: this.selectedRow,
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
      this.getLayoutsStructureData();
    });
  }

  back() {
    if (this.origin == 'FCOMERCTLDPAG') {
      this.router.navigate(['pages/commercialization/payment-refund']);
    }
  }

  deleteLayoutsStructure(event: any) {
    console.log(event.data);
    this.alertQuestion(
      'question',
      'Se eliminará la Estructura de Diseño',
      '¿Desea continuar?'
    ).then(question => {
      if (question.isConfirmed) {
        this.layoutsConfigService
          .remove({
            idLayout: event.data.idLayout.id,
            idConsec: event.data.idConsec,
          })
          .subscribe({
            next: data => {
              this.alert(
                'success',
                'Estructura de Diseño eliminada correctamente',
                ``
              );
              this.getLayoutsStructureData();
            },
            error: async error => {
              this.alert(
                'error',
                'Error al Eliminar',
                'Ocurrió un error al eliminar el diseño'
              );
            },
          });
      }
    });
  }
}
