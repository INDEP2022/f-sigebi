import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/ModelForm';
import { ISatClassification } from 'src/app/core/models/catalogs/sat-classification.model';
import { SatClasificationService } from 'src/app/core/services/catalogs/sat-classification.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-sat-clasification-form',
  templateUrl: './sat-clasification-form.component.html',
  styles: [],
})
export class SatClasificationFormComponent extends BasePage implements OnInit {
  satClasificationForm: ModelForm<ISatClassification>;
  title: string = 'SAT Clasificacion';
  edit: boolean = false;
  satclasification: ISatClassification;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private satClasificationService: SatClasificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    console.log(this.satclasification);
    
    this.satClasificationForm = this.fb.group({
      id: [null],
      nombre_clasificacion: [
        null,
        Validators.compose([Validators.pattern('')]),
      ],
      version: [null, Validators.compose([Validators.pattern('')])],
    });
    if (this.satclasification != null) {
      this.edit = true;
      this.satClasificationForm.patchValue(this.satclasification);
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
    this.satClasificationService
      .create(this.satClasificationForm.getRawValue())
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    this.loading = true;
    this.satClasificationService
      .update(this.satclasification.id, this.satClasificationForm.getRawValue())
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
