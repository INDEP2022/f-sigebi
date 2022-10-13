import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ICourt } from '../../../../core/models/catalogs/court.model';
import { CourtService } from './../../../../core/services/catalogs/court.service';

@Component({
  selector: 'app-court-form',
  templateUrl: './court-form.component.html',
  styles: [],
})
export class CourtFormComponent extends BasePage implements OnInit {
  courtForm: FormGroup = new FormGroup({});
  title: string = 'Juzgado';
  edit: boolean = false;
  court: ICourt;
  items = new DefaultSelect<ICourt>();
  @Output() refresh = new EventEmitter<true>();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private courtService: CourtService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.courtForm = this.fb.group({
      description: [null, [Validators.required]],
      manager: [null, [Validators.required]],
      numRegister: [null, [Validators.required]],
      numPhone: [null, [Validators.required]],
      cologne: [null, [Validators.required]],
      street: [null, [Validators.required]],
      numInterior: [null, [Validators.required, Validators.maxLength(3)]],
      numExterior: [null, [Validators.required]],
      delegationMun: [null, [Validators.required]],
      zipCode: [null, [Validators.required]],
      circuitCVE: [null, [Validators.required]],
    });
    if (this.court != null) {
      this.edit = true;
      console.log(this.court);
      this.courtForm.patchValue(this.court);
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
    this.courtService.create(this.courtForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.courtService.update(this.court.id, this.courtForm.value).subscribe({
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
