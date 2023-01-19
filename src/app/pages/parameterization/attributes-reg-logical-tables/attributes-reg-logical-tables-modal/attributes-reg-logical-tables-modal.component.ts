import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
//models
import { ITdescAtrib } from 'src/app/core/models/ms-parametergood/tdescatrib-model';
//Services
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ParameterGoodService } from 'src/app/core/services/ms-parametergood/parametergood.service';
import { BasePage } from 'src/app/core/shared/base-page';

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

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private parameterGoodService: ParameterGoodService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForom();
  }

  private prepareForom() {
    this.tdescAtribForm = this.fb.group({
      keyAtrib: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      idNmTable: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      descriptionAtrib: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      swFormat: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      longMax: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      longMin: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
    });
    if (this.tdescAtrib != null) {
      this.edit = true;
      console.log(this.tdescAtrib);
      this.tdescAtribForm.patchValue(this.tdescAtrib);
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
    this.parameterGoodService.create(this.tdescAtribForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.parameterGoodService
      .update(this.tdescAtrib.idNmTable, this.tdescAtribForm.value)
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
