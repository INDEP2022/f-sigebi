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
  title: string = 'Valor de Atributo';
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
      otKey: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(40),
        ],
      ],
      value: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          ,
          Validators.maxLength(40),
        ],
      ],
      table: [null],
      numRegister: [null],
      abbreviation: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(40),
        ],
      ],
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
  create(): void {
    if (
      this.valuesForm.controls['otKey'].value.trim() === '' ||
      this.valuesForm.controls['value'].value.trim() === '' ||
      this.valuesForm.controls['abbreviation'].value.trim() === ''
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', '');
      return;
    }
    this.valuesForm.controls['table'].setValue(this.value.nmtabla);

    this.tvalTableService
      .create2(this.value.ottipotb, this.valuesForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => {
          this.loading = false;
          this.alert('error', 'La Clave ya fue registrada', '');
        },
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
      error: error => (this.loading = true),
    });
  }
  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = true;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
