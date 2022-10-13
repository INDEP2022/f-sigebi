import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/ModelForm';
import { IDocCompesationSat } from 'src/app/core/models/catalogs/doc-compesation-sat.model';
import { DocCompensationSATService } from 'src/app/core/services/catalogs/doc-compesation-sat.service';
import { BasePage } from 'src/app/core/shared/base-page';

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
  title: string = 'Tipo de Almacenes';
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
      idcat: [null, Validators.compose([Validators.required])],
      typeDocSat: [null, Validators.compose([Validators.required])],
      addressee: [null, Validators.compose([Validators.required])],
      subjectCode: [null, Validators.compose([Validators.required])],
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
      .create(this.docCompesationSatForm.getRawValue())
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    this.loading = true;
    this.docCompesationSatService
      .update(
        this.docCompesationSat.id,
        this.docCompesationSatForm.getRawValue()
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
