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
  title: string = 'Registro de Atributo para Tabla Lógica';
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
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(100),
        ],
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
      this.tdescAtribForm.controls['keyAtrib'].disable();
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
      this.alert('warning', 'Campo Invalido', ``);
      /*this.alertQuestion(
        'warning',
        'Campo Invalido',
        'Favor de corregir'
      ).then(question => {
        if (question.isConfirmed) {
        }
      });*/
    }
  }

  create() {
    if (this.tdescAtribForm.controls['descriptionAtrib'].value.trim() == '') {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      this.tdesAtribService
        .create(this.tdescAtribForm.getRawValue())
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => {
            this.loading = false;
            this.alert(
              'warning',
              'El campo No. Atributo ya está resgistrado',
              ``
            );
          },
        });
    }
  }

  update() {
    if (this.tdescAtribForm.controls['descriptionAtrib'].value.trim() == '') {
      this.alert('warning', 'No se puede actualizar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      this.tdesAtribService
        .update(this.tdescAtribForm.getRawValue())
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => (this.loading = false),
        });
    }
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
