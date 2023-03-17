import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ITablesType } from 'src/app/core/models/catalogs/dinamic-tables.model';
import { ITvaltable1 } from 'src/app/core/models/catalogs/tvaltable-model';
import { TvalTable1Service } from 'src/app/core/services/catalogs/tval-table1.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-values-modal',
  templateUrl: './values-modal.component.html',
  styles: [],
})
export class ValuesModalComponent extends BasePage implements OnInit {
  valuesForm: ModelForm<ITvaltable1>;
  tvalTable: ITvaltable1;
  value: ITablesType;
  title: string = 'Valores';
  edit: boolean = false;
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private tvalTableService: TvalTable1Service
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.valuesForm = this.fb.group({
      otKey: [null],
      value: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      table: [null],
      numRegister: [null],
      abbreviation: [null],
    });
    console.log(this.tvalTable);
    if (this.tvalTable != null) {
      console.log('editar');

      this.edit = true;
      this.valuesForm.patchValue(this.tvalTable);
      this.valuesForm.controls['otKey'].disable();
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
    this.valuesForm.controls['table'].setValue(this.value.nmtabla);
    this.tvalTableService
      .create2(this.value.ottipotb, this.valuesForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }
  update() {
    this.loading = true;
    let form = {
      otKey: this.tvalTable.otKey,
      value: this.valuesForm.controls['value'].value,
      table: this.valuesForm.controls['table'].value,
      numRegister: this.valuesForm.controls['numRegister'].value,
      abbreviation: this.valuesForm.controls['abbreviation'].value,
    };
    this.tvalTableService.update(this.value.ottipotb, form).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }
  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
