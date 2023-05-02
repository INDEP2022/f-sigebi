import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IDocCompensationSatXml } from 'src/app/core/models/catalogs/doc-compensation-sat-xml.model';
import { DocCompensationSatXmlService } from 'src/app/core/services/catalogs/doc-compensation-sat-xml.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-doc-resarcimiento-sat-xml-form',
  templateUrl: './doc-compensation-sat-xml-form.component.html',
  styles: [],
})
export class DocCompensationSatXmlFormComponent
  extends BasePage
  implements OnInit
{
  compensationForm: ModelForm<IDocCompensationSatXml>;
  title: string = 'Documento resarcimiento sat xml';
  edit: boolean = false;
  compensationSatXml: IDocCompensationSatXml;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private compensationService: DocCompensationSatXmlService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.compensationForm = this.fb.group({
      id: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      idOficioSat: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      typeDocSatXml: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });

    if (this.compensationSatXml != null) {
      this.edit = true;
      this.compensationForm.patchValue(this.compensationSatXml);
      this.compensationForm.get('id').disable();
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
    this.compensationService
      .create(this.compensationForm.getRawValue())
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    this.loading = true;
    this.compensationService
      .update(this.compensationSatXml.id, this.compensationForm.getRawValue())
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
