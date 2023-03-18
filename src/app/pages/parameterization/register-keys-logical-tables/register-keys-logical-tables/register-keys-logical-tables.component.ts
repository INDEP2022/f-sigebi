import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, map, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { RegisterKeysLogicalTablesModalComponent } from '../register-keys-logical-tables-modal/register-keys-logical-tables-modal.component';
import {
  LOGICAL_TABLE,
  REGISTER_KEYS_LOGICAL_COLUMNS,
} from './register-keys-logical-columns';
//Services
import { DynamicTablesService } from 'src/app/core/services/dynamic-catalogs/dynamic-tables.service';
import { TdescCveService } from 'src/app/core/services/ms-parametergood/tdesccve.service';
//Models
import { LocalDataSource } from 'ng2-smart-table';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { ITable } from 'src/app/core/models/catalogs/dinamic-tables.model';
import { ITdescCve } from 'src/app/core/models/ms-parametergood/tdesccve-model';

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

  settings2;

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private dynamicTablesService: DynamicTablesService,
    private tdescCveService: TdescCveService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...LOGICAL_TABLE },
    };

    this.settings2 = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },

      columns: { ...REGISTER_KEYS_LOGICAL_COLUMNS },
    };
  }

  ngOnInit(): void {
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
    this.loading2 = true;
    const idCve = { ...this.descriptionCve };
    this.tdescCveService
      .getById(idCve.table)
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

  //Para editar la descripción de atributos
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

  //msj que se muestra si no hay clave para tabla logica
  showNullRegister() {
    this.alertQuestion(
      'warning',
      'Tabla sin claves',
      '¿Desea agregarlos ahora?'
    ).then(question => {
      if (question.isConfirmed) {
        this.openForm();
      }
    });
  }

  //Muestra información de la fila seleccionada de tablas
  selectRow(row?: any) {
    this.selectedRow = row;
    this.rowSelected = true;
  }
}
