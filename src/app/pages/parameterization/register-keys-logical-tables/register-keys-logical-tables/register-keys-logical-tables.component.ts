import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, map, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { RegisterKeysLogicalTablesModalComponent } from '../register-keys-logical-tables-modal/register-keys-logical-tables-modal.component';
import {
  LOGICAL_TABLE,
  REGISTER_KEYS_LOGICAL_COLUMNS1,
  REGISTER_KEYS_LOGICAL_COLUMNS2,
  REGISTER_KEYS_LOGICAL_COLUMNS3,
  REGISTER_KEYS_LOGICAL_COLUMNS4,
  REGISTER_KEYS_LOGICAL_COLUMNS5,
} from './register-keys-logical-columns';
//Services
import { DynamicTablesService } from 'src/app/core/services/dynamic-catalogs/dynamic-tables.service';
import { TdescCveService } from 'src/app/core/services/ms-parametergood/tdesccve.service';
//Models
import { LocalDataSource } from 'ng2-smart-table';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ITable } from 'src/app/core/models/catalogs/dinamic-tables.model';
import { ITdescCve } from 'src/app/core/models/ms-parametergood/tdesccve-model';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import Swal from 'sweetalert2';
import { RegisterKeyOneModalComponent } from '../register-key-one-modal/register-key-one-modal.component';

@Component({
  selector: 'app-register-keys-logical-tables',
  templateUrl: './register-keys-logical-tables.component.html',
  styles: [],
})
export class RegisterKeysLogicalTablesComponent
  extends BasePage
  implements OnInit
{
  columns: ITable[] = [];
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  totalItems2: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());

  tdescCve: ITdescCve[] = [];
  descriptionCve: ITable;

  loading1 = this.loading;
  loading2 = this.loading;

  rowSelected: boolean = false;
  selectedRow: any = null;

  settings0;
  settings1;
  settings2;
  settings3;
  settings4;
  settings5;
  settingsOne;

  form: ModelForm<ITable>;

  tableSelect = new DefaultSelect<ITable>();
  tableValue: ITable;

  showTables: boolean = true;

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private dynamicTablesService: DynamicTablesService,
    private tdescCveService: TdescCveService
  ) {
    super();
    this.settings0 = {
      ...this.settings,
      actions: false,
      columns: { ...LOGICAL_TABLE },
    };

    this.settingsOne = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        position: 'right',
      },

      columns: { ...REGISTER_KEYS_LOGICAL_COLUMNS1 },
    };

    this.settings1 = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        position: 'right',
      },

      columns: { ...REGISTER_KEYS_LOGICAL_COLUMNS1 },
    };

    this.settings2 = {
      ...this.settings,
      actions: {
        columnTitle: '',
        edit: false,
        delete: false,
        position: 'right',
      },

      columns: { ...REGISTER_KEYS_LOGICAL_COLUMNS2 },
    };

    this.settings3 = {
      ...this.settings,
      actions: {
        columnTitle: '',
        edit: false,
        delete: false,
        position: 'right',
      },

      columns: { ...REGISTER_KEYS_LOGICAL_COLUMNS3 },
    };

    this.settings4 = {
      ...this.settings,
      actions: {
        columnTitle: '',
        edit: false,
        delete: false,
        position: 'right',
      },

      columns: { ...REGISTER_KEYS_LOGICAL_COLUMNS4 },
    };

    this.settings5 = {
      ...this.settings,
      actions: {
        columnTitle: '',
        edit: false,
        delete: false,
        position: 'right',
      },

      columns: { ...REGISTER_KEYS_LOGICAL_COLUMNS5 },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            /*SPECIFIC CASES*/
            filter.field == 'city'
              ? (field = `filter.${filter.field}.nameCity`)
              : (field = `filter.${filter.field}`);
            filter.field == 'id'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getLogicalTables();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getLogicalTables());
  }

  private prepareForm() {
    this.form = this.fb.group({
      table: [null, []],
      name: [null, [Validators.required]],
      description: [null, []],
      tableType: [null, []],
    });
  }

  //Seleccionar tablas
  getTables(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    if (lparams?.text.length > 0)
      params.addFilter('name', lparams.text, SearchFilter.LIKE);
    this.dynamicTablesService.getTablesList(params.getParams()).subscribe({
      next: data => {
        this.tableSelect = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.tableSelect = new DefaultSelect();
      },
    });
  }

  //Evento cuando se selecciona un item del select
  onValuesChange(tablesChange: ITable) {
    this.form.controls['description'].setValue(tablesChange.description);
    this.form.controls['tableType'].setValue(tablesChange.tableType);
    this.form.controls['table'].setValue(tablesChange.table);
    this.tableSelect = new DefaultSelect();

    this.getKeys();
  }

  //Trae todas las tablas lógicas
  getLogicalTables(): void {
    this.loading1 = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.dynamicTablesService.getAll(params).subscribe({
      next: response => {
        this.columns = response.data;
        this.totalItems = response.count || 0;
        this.data.load(this.columns);
        this.data.refresh();
        this.loading1 = false;
      },
      error: error => (this.loading1 = false),
    });
  }

  //Selecciona fila de tabla  para ver sus claves
  rowsSelected(event: any) {
    const idCve = { ...this.descriptionCve };
    this.totalItems2 = 0;
    this.tdescCve = [];
    this.descriptionCve = event.data;
    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getKeys(idCve.table));
  }

  //Trae descripción de claves por tabla seleccionada
  getKeys(id?: string | number): void {
    let _id = this.form.controls['table'].value;
    this.loading2 = true;
    this.tdescCveService
      .getById(_id)
      .pipe(
        map((data2: any) => {
          let list: IListResponse<ITdescCve> = {} as IListResponse<ITdescCve>;
          const array2: ITdescCve[] = [{ ...data2 }];
          list.data = array2;
          return list;
        })
      )
      .subscribe({
        next: response => {
          this.tdescCve = response.data;
          this.totalItems2 = response.count;
          this.loading2 = false;
        },
        error: error => (this.showNullRegister(), (this.loading2 = false)),
      });
  }

  //Para editar la descripción de atributos con 5 clave
  openForm(tdescCve?: ITdescCve) {
    const idCve = { ...this.descriptionCve };
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      tdescCve,
      idCve,
      callback: (next: boolean) => {
        if (next) this.getKeys(idCve.table);
      },
    };
    this.modalService.show(
      RegisterKeysLogicalTablesModalComponent,
      modalConfig
    );
  }

  //Para editar la descripción de atributos con 1 clave
  openForm2(tdescCve?: ITdescCve) {
    const idCve = { ...this.descriptionCve };
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      tdescCve,
      idCve,
      callback: (next: boolean) => {
        if (next) this.getKeys(idCve.table);
      },
    };
    this.modalService.show(RegisterKeyOneModalComponent, modalConfig);
  }

  //msj que se muestra si no hay clave para tabla logica
  showNullRegister() {
    this.alertQuestion(
      'warning',
      'Tabla sin claves',
      '¿Desea agregarlos ahora?'
    ).then(question => {
      if (question.isConfirmed) {
        this.openForm2();
      }
    });
  }

  //Msj de alerta para borrar clave 1
  showDeleteAlert1(tdescCve?: ITdescCve) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea borrar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(tdescCve.id);
      }
    });
  }

  //método para borrar transferente
  delete(id: number) {
    const idCve = { ...this.descriptionCve };
    this.tdescCveService.remove(id).subscribe({
      next: () => (
        Swal.fire('Borrado', '', 'success'), this.getKeys(idCve.table)
      ),
    });
  }

  //Muestra información de la fila seleccionada de tablas
  selectRow(row?: any) {
    this.selectedRow = row;
    this.rowSelected = true;
  }

  resetScreen() {
    window.location.reload();
  }
}
