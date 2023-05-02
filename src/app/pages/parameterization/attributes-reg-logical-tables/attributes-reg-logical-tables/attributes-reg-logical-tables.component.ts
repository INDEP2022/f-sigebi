import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { AttributesRegLogicalTablesModalComponent } from '../attributes-reg-logical-tables-modal/attributes-reg-logical-tables-modal.component';
import {
  ATT_REG_LOG_TAB_COLUMNS,
  LOG_TAB_COLUMNS,
} from './attributes-reg-logical-tables-columns';
//models
import { ITdescAtrib } from 'src/app/core/models/ms-parametergood/tdescatrib-model';
//Services
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ITablesData } from 'src/app/core/models/catalogs/dinamic-tables.model';
import { DynamicCatalogService } from 'src/app/core/services/dynamic-catalogs/dynamic-catalogs.service';
import { DynamicTablesService } from 'src/app/core/services/dynamic-catalogs/dynamic-tables.service';
import { TdesAtribService } from 'src/app/core/services/ms-parametergood/tdescatrib.service';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-attributes-reg-logical-tables',
  templateUrl: './attributes-reg-logical-tables.component.html',
  styles: [],
})
export class AttributesRegLogicalTablesComponent
  extends BasePage
  implements OnInit
{
  tdescAtrib: ITdescAtrib[] = [];
  logicTables: any[] = [];

  totalItems: number = 0;
  totalItems2: number = 0;

  params = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());

  form: FormGroup = new FormGroup({});

  data: ITablesData;

  settings2;

  loading1 = this.loading;
  loading2 = this.loading;

  rowSelected: boolean = false;
  selectedRow: any = null;

  constructor(
    private modalService: BsModalService,
    private parameterGoodService: TdesAtribService,
    private fb: FormBuilder,
    private dynamicTablesService: DynamicTablesService,
    private dynamicCatalogService: DynamicCatalogService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: { ...LOG_TAB_COLUMNS },
    };
    this.settings2 = {
      ...this.settings,
      hideSubHeader: true,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        add: false,
        position: 'right',
      },
      columns: { ...ATT_REG_LOG_TAB_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getAllTables();
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAllTables());
  }

  private prepareForm() {
    this.form = this.fb.group({
      table: [null, [Validators.required, Validators.pattern(NUMBERS_PATTERN)]],
      description: [{ value: null, disabled: true }],
      tableType: [{ value: null, disabled: true }],
    });
  }

  getAllTables() {
    this.loading1 = true;
    this.dynamicTablesService.getAll(this.params.getValue()).subscribe(res => {
      console.log(res);
      this.totalItems = res.count;
      this.logicTables = res.data;
      this.loading1 = false;
    });
  }

  rowsSelected(event: any) {
    this.totalItems2 = 0;
    this.tdescAtrib = [];
    console.log(event.data);
    this.data = event.data;
    this.getRegisterAttribute(this.data);
    this.form.controls['table'].setValue(this.data.table);
    /* this.params2.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.getSubDelegations(this.delegations);
      const btn = document.getElementById('new-sd');
      this.r2.removeClass(btn, 'disabled');
      this.dataId = this.delegations;
    }); */
  }

  getRegisterAttribute(table: ITablesData) {
    this.loading2 = true;
    this.parameterGoodService.getById(table.table).subscribe({
      next: response => {
        this.tdescAtrib = response.data;
        this.totalItems2 = response.count;
        this.loading2 = false;
      },
      error: error => (this.showNullRegister(), (this.loading2 = false)),
    });
  }

  openForm(tdescAtrib?: ITdescAtrib) {
    let _id = this.form.controls['table'].value;
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      tdescAtrib,
      _id,
      callback: (next: boolean) => {
        if (next) this.getRegisterAttribute(this.data);
      },
    };
    this.modalService.show(
      AttributesRegLogicalTablesModalComponent,
      modalConfig
    );
  }

  showNullRegister() {
    this.alertQuestion(
      'warning',
      'Tabla sin atributos',
      '¿Desea agregarlos ahora?'
    ).then(question => {
      if (question.isConfirmed) {
        this.openForm();
      }
    });
  }

  showDeleteAlert2(tdescAtrib: ITdescAtrib) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eborrar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(tdescAtrib);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(tdescAtrib: ITdescAtrib) {
    this.parameterGoodService.remove(tdescAtrib).subscribe({
      next: () => this.getRegisterAttribute(this.data),
    });
  }

  //Muestra información de la fila seleccionada de tabla logica
  selectRow(row?: any) {
    this.selectedRow = row;
    this.rowSelected = true;
  }
}
