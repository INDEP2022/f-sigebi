import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { AttributesRegLogicalTablesModalComponent } from '../attributes-reg-logical-tables-modal/attributes-reg-logical-tables-modal.component';
import { ATT_REG_LOG_TAB_COLUMNS } from './attributes-reg-logical-tables-columns';
//models
import { ITdescAtrib } from 'src/app/core/models/ms-parametergood/tdescatrib-model';
//Services
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicTablesService } from 'src/app/core/services/dynamic-catalogs/dynamic-tables.service';
import { TdesAtribService } from 'src/app/core/services/ms-parametergood/tdescatrib.service';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';

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
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  form: FormGroup = new FormGroup({});

  constructor(
    private modalService: BsModalService,
    private parameterGoodService: TdesAtribService,
    private fb: FormBuilder,
    private dynamicTablesService: DynamicTablesService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        position: 'right',
      },
      columns: { ...ATT_REG_LOG_TAB_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getRegisterAttribute());
  }

  private prepareForm() {
    this.form = this.fb.group({
      table: [null, [Validators.required, Validators.pattern(NUMBERS_PATTERN)]],
      description: [{ value: null, disabled: true }],
      tableType: [{ value: null, disabled: true }],
    });
  }

  //Método para buscar y llenar inputs (Encabezado)
  getLogicalTablesByID(): void {
    let _id = this.form.controls['table'].value;
    this.loading = true;
    this.dynamicTablesService.getById(_id).subscribe(
      response => {
        if (response !== null) {
          this.form.patchValue(response);
          this.form.updateValueAndValidity();
          // this.getKeysByLogicalTables(response.table);
        } else {
          this.alert('info', 'No se encontraron los registros', '');
        }
        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  getRegisterAttribute() {
    this.loading = true;
    this.parameterGoodService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.tdescAtrib = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(tdescAtrib?: ITdescAtrib) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      tdescAtrib,
      callback: (next: boolean) => {
        if (next) this.getRegisterAttribute();
      },
    };
    this.modalService.show(
      AttributesRegLogicalTablesModalComponent,
      modalConfig
    );
  }

  // showDeleteAlert(tdescAtrib: ITdescAtrib) {
  //   this.alertQuestion(
  //     'warning',
  //     'Eliminar',
  //     '¿Desea eliminar este registro?'
  //   ).then(question => {
  //     if (question.isConfirmed) {
  //       this.delete(tdescAtrib.idNmTable);
  //       Swal.fire('Borrado', '', 'success');
  //     }
  //   });
  // }

  // delete(id: number) {
  //   this.parameterGoodService.remove(id).subscribe({
  //     next: () => this.getRegisterAttribute(),
  //   });
  // }
}
