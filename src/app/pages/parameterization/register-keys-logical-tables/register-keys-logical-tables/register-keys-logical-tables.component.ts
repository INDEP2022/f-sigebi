import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { RegisterKeysLogicalTablesModalComponent } from '../register-keys-logical-tables-modal/register-keys-logical-tables-modal.component';
import { REGISTER_KEYS_LOGICAL_COLUMNS } from './register-keys-logical-columns';
//Services
import { DynamicTablesService } from 'src/app/core/services/dynamic-catalogs/dynamic-tables.service';
import { TdescCveService } from 'src/app/core/services/ms-parametergood/tdesccve.service';
//Models
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ITdescCve } from 'src/app/core/models/ms-parametergood/tdesccve-model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-keys-logical-tables',
  templateUrl: './register-keys-logical-tables.component.html',
  styles: [],
})
export class RegisterKeysLogicalTablesComponent
  extends BasePage
  implements OnInit
{
  tdescCve: ITdescCve[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  form: FormGroup = new FormGroup({});

  data: LocalDataSource = new LocalDataSource();

  rowSelected: boolean = false;
  selectedRow: any = null;

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private dynamicTablesService: DynamicTablesService,
    private tdescCveService: TdescCveService
  ) {
    super();
    this.settings = {
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
    this.prepareForm();
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getKeysLogicalTables());
  }

  //Método para llenar tabla
  getKeysLogicalTables() {
    this.loading = true;
    this.tdescCveService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.tdescCve = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  private prepareForm() {
    this.form = this.fb.group({
      table: [null, [Validators.required]],
      description: [null, []],
    });
  }

  //Método para buscar tabla por ID
  getLogicalTablesByID(): void {
    let _id = this.form.controls['table'].value;
    this.loading = true;
    this.dynamicTablesService.getById(_id).subscribe(
      response => {
        if (response !== null) {
          this.form.patchValue(response);
          this.form.updateValueAndValidity();
          // this.getDescCveByTable(response.id);
        } else {
          this.alert('info', 'No se encontraron los registros', '');
        }
        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  //Método para generar tabla de claves mediante el id de la tabla lógica
  getDescCveByTable() {}

  openForm(tdescCve?: ITdescCve) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      tdescCve,
      callback: (next: boolean) => {
        if (next) this.getKeysLogicalTables();
      },
    };
    this.modalService.show(
      RegisterKeysLogicalTablesModalComponent,
      modalConfig
    );
  }

  howDeleteAlert(tdescCve: ITdescCve) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(tdescCve.id);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: number) {
    this.tdescCveService.remove(id).subscribe({
      next: () => this.getKeysLogicalTables(),
    });
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }
}
