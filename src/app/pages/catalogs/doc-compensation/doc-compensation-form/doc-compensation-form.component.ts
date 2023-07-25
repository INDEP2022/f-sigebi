import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IDocCompensationSatXml } from 'src/app/core/models/catalogs/doc-compensation-sat-xml.model';
import { IDocCompensation } from 'src/app/core/models/catalogs/doc-compensation.model';
import { IDocCompesationSat } from 'src/app/core/models/catalogs/doc-compesation-sat.model';
import { DocCompensationService } from 'src/app/core/services/catalogs/doc-compensation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-doc-compensation-form',
  templateUrl: './doc-compensation-form.component.html',
  styles: [],
})
export class DocCompensationFormComponent extends BasePage implements OnInit {
  docCompensationForm: ModelForm<IDocCompensation>;
  title: string = 'Documento de Resarcimiento';
  edit: boolean = false;
  docCompensation: IDocCompensation;
  docCompensationSAT = new DefaultSelect<IDocCompesationSat>();
  docCompensationSATXML = new DefaultSelect<IDocCompensationSatXml>();
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private docCompensationService: DocCompensationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.docCompensationForm = this.fb.group({
      id: [null, [Validators.pattern(NUMBERS_PATTERN), Validators.required]],
      satTypeJob: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.maxLength(4),
        ],
      ],
      idTypeDocSat: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.maxLength(4),
        ],
      ],
      idTypeDocSatXml: [
        null,
        [
          Validators.required,
          Validators.maxLength(4),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      typeDocSae: [
        null,
        [
          Validators.required,
          Validators.maxLength(250),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      type: [
        null,
        [
          Validators.maxLength(2),
          Validators.pattern(NUMBERS_PATTERN),
          Validators.required,
        ],
      ],
    });
    if (this.docCompensation != null) {
      this.edit = true;
      this.docCompensationForm.patchValue(this.docCompensation);
    }
  }

  fillForm() {
    this.edit = true;
    this.docCompensationForm.patchValue(this.docCompensation);
    const docSatXml = this.docCompensation
      .idTypeDocSatXml as IDocCompensationSatXml;
    const docSat = this.docCompensation.idTypeDocSat as IDocCompesationSat;
    if (docSatXml) {
      this.docCompensationForm.controls.idTypeDocSatXml.setValue(docSatXml.id);
      this.docCompensationSATXML = new DefaultSelect([docSatXml], 1);
    }
    if (docSat) {
      this.docCompensationForm.controls.idTypeDocSat.setValue(docSat.id);
      this.docCompensationSAT = new DefaultSelect([docSat], 1);
    }
  }

  getDocCompensationSAT(params: ListParams) {
    this.docCompensationService.getDocCompensationSat(params).subscribe({
      next: data =>
        (this.docCompensationSAT = new DefaultSelect(data.data, data.count)),
    });
  }

  getDocCompensationSATXML(params: ListParams) {
    this.docCompensationService.getDocCompensationSatXml(params).subscribe({
      next: data =>
        (this.docCompensationSATXML = new DefaultSelect(data.data, data.count)),
    });
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    if (this.docCompensationForm.controls['typeDocSae'].value.trim() === '') {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      return; // Retorna temprano si el campo está vacío.
    }
    this.loading = true;
    this.docCompensationService
      .create(this.docCompensationForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    this.loading = true;
    this.docCompensationService
      .updateCatalogDocCompensation(
        this.docCompensation.id,
        this.docCompensationForm.value
      )
      .subscribe({
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
