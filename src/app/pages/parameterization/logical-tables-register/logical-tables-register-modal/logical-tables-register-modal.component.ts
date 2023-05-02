import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
//models
import { ITables } from 'src/app/core/models/catalogs/dinamic-tables.model';
//service
import { DinamicTablesService } from 'src/app/core/services/catalogs/dinamic-tables.service';

@Component({
  selector: 'app-logical-tables-register-modal',
  templateUrl: './logical-tables-register-modal.component.html',
  styles: [],
})
export class LogicalTablesRegisterModalComponent
  extends BasePage
  implements OnInit
{
  tablesForm: ModelForm<ITables>;
  dinamicTables: ITables;
  title: string = 'Catálogo de tablas lógicas';
  edit: boolean = false;
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private dinamicTablesService: DinamicTablesService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.tablesForm = this.fb.group({
      table: [null, []],
      name: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      actionType: [null, [Validators.required]],
      tableType: [null, [Validators.required]],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
    if (this.dinamicTables != null) {
      this.edit = true;
      console.log(this.dinamicTables);
      this.tablesForm.patchValue(this.dinamicTables);
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.dinamicTablesService.create2(this.tablesForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.dinamicTablesService
      .update2(this.dinamicTables.table, this.tablesForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
