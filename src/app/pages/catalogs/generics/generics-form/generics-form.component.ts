import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { IGeneric } from '../../../../core/models/catalogs/generic.model';
import { GenericService } from './../../../../core/services/catalogs/generic.service';

@Component({
  selector: 'app-generics-form',
  templateUrl: './generics-form.component.html',
  styles: [],
})
export class GenericsFormComponent extends BasePage implements OnInit {
  genericsForm: FormGroup = new FormGroup({});
  title: string = 'Genérico';
  edit: boolean = false;
  generics: IGeneric;
  @Output() refresh = new EventEmitter<true>();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private genericsService: GenericService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.genericsForm = this.fb.group({
      name: [null, [Validators.required]],
      keyId: [null, [Validators.required, Validators.pattern(NUMBERS_PATTERN)]],
      description: [null, [Validators.required]],
      version: [null, [Validators.required]],
      active: [null, [Validators.required]],
      editable: [null, [Validators.required]],
    });
    if (this.generics != null) {
      this.edit = true;
      this.genericsForm.patchValue(this.generics);
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
    console.log(this.genericsForm.value);
    this.genericsService.create(this.genericsForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    // Corregir el repositorio del service cuando haya aclaracion del endpoint
    // porque ocupa dos valores para la url
    this.loading = true;
    this.genericsService
      .update(this.generics.name, this.genericsForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.refresh.emit(true);
    this.modalRef.hide();
  }
}
