import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { INorm } from './../../../../core/models/catalogs/norm.model';
import { NormService } from './../../../../core/services/catalogs/norm.service';

@Component({
  selector: 'app-norms-form',
  templateUrl: './norms-form.component.html',
  styles: [
  ]
})
export class NormsFormComponent extends BasePage implements OnInit {

  normForm: FormGroup = new FormGroup({});
  title: string = 'Norma';
  edit: boolean = false;
  norm: INorm;
  items = new DefaultSelect();
  @Output() refresh = new EventEmitter<true>();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private normService: NormService
  ) { 
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.normForm = this.fb.group({
      norm: [null, [Validators.required]],
      article: [null, [Validators.required]],
      type: [null, [Validators.required]],
      destination: [null, [Validators.required]],
      characteristics: [null, [Validators.required]],
      merchandise: [null, [Validators.required]],
      fundament: [null, [Validators.required]],
      objective: [null, [Validators.required]],
      condition: [null, [Validators.required]],
      version: [null, [Validators.required]],
      status: [null, [Validators.required]],
    });
    if (this.norm != null) {
      this.edit = true;
      console.log(this.norm);
      this.normForm.patchValue(this.norm);
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
    this.normService.create(this.normForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.normService
      .update(this.norm.id, this.normForm.value)
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
