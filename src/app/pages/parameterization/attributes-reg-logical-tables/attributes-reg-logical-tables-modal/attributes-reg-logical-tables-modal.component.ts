import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
//models
import { ITdescAtrib } from 'src/app/core/models/ms-parametergood/tdescatrib-model';
//Services
import { DynamicTablesService } from 'src/app/core/services/dynamic-catalogs/dynamic-tables.service';
import { TdesAtribService } from 'src/app/core/services/ms-parametergood/tdescatrib.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-attributes-reg-logical-tables-modal',
  templateUrl: './attributes-reg-logical-tables-modal.component.html',
  styles: [],
})
export class AttributesRegLogicalTablesModalComponent
  extends BasePage
  implements OnInit
{
  tdescAtribForm: ModelForm<ITdescAtrib>;
  tdescAtrib: ITdescAtrib;
  title: string = 'Registro de atributos para tablas lógicas';
  edit: boolean = false;

  tables = new DefaultSelect();
  _id: any;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private tdesAtribService: TdesAtribService,
    private dynamicTablesService: DynamicTablesService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForom();
  }

  private prepareForom() {
    this.tdescAtribForm = this.fb.group({
      keyAtrib: [null, [Validators.required]],
      idNmTable: [null, []],
      descriptionAtrib: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      swFormat: [null, [Validators.pattern(STRING_PATTERN)]],
      longMax: [
        null,
        [
          Validators.pattern(NUMBERS_PATTERN),
          Validators.max(80),
          Validators.min(1),
        ],
      ],
      longMin: [
        null,
        [
          Validators.pattern(NUMBERS_PATTERN),
          Validators.max(80),
          Validators.min(1),
        ],
      ],
      registerNumber: [null, []],
    });
    if (this.tdescAtrib != null) {
      this.edit = true;
      console.log(this.tdescAtrib);
      this.tdescAtribForm.patchValue(this.tdescAtrib);
    } else {
      this.edit = false;
      this.tdescAtribForm.controls['idNmTable'].setValue(this._id);
    }
  }
  close() {
    this.modalRef.hide();
  }

  confirm() {
    if (
      this.tdescAtribForm.controls['longMax'].value >
      this.tdescAtribForm.controls['longMin'].value
    ) {
      this.edit ? this.update() : this.create();
    } else {
      this.alertQuestion(
        'warning',
        'La longitud máxima no puede ser menor a longitud mínima',
        'Favor de corregir'
      ).then(question => {
        if (question.isConfirmed) {
        }
      });
    }
  }

  create() {
    this.loading = true;
    this.tdesAtribService.create(this.tdescAtribForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.tdesAtribService.update(this.tdescAtribForm.value).subscribe({
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

  //Método para select dinámico y escoger id disponibles de tablas
  getTables(params: ListParams) {
    this.dynamicTablesService.getAll(params).subscribe({
      next: data => (this.tables = new DefaultSelect(data.data, data.count)),
    });
  }
}
