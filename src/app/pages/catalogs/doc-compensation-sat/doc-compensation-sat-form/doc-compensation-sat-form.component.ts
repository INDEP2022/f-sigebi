import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IDocCompesationSat } from 'src/app/core/models/catalogs/doc-compesation-sat.model';
import { DocCompensationSATService } from 'src/app/core/services/catalogs/doc-compesation-sat.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-doc-compensation-sat-form',
  templateUrl: './doc-compensation-sat-form.component.html',
  styles: [],
})
export class DocCompensationSatFormComponent
  extends BasePage
  implements OnInit
{
  docCompesationSatForm: ModelForm<IDocCompesationSat>;
  title: string = 'DOCUMENTOS RESARCIMIENTO SAT';
  edit: boolean = false;
  docCompesationSat: IDocCompesationSat;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private docCompesationSatService: DocCompensationSATService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.docCompesationSatForm = this.fb.group({
      id: [null],
      officeSatId: [
        null,
        [
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
          Validators.maxLength(3),
          Validators.max(999),
        ],
      ],
      typeDocSat: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(250)],
      ],
      addressee: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(150)],
      ],
      subjectCode: [
        null,
        [Validators.required, Validators.required, Validators.maxLength(10)],
      ],
    });
    if (this.docCompesationSat != null) {
      this.edit = true;
      this.docCompesationSatForm.patchValue(this.docCompesationSat);
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
    this.docCompesationSatService
      .create(this.docCompesationSatForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    this.loading = true;
    this.docCompesationSatService
      .update(this.docCompesationSat.id, this.docCompesationSatForm.value)
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
