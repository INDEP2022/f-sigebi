import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  NUMBERS_PATTERN,
  PHONE_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
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
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      manager: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      numRegister: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      numPhone: [
        null,
        [Validators.required, Validators.pattern(PHONE_PATTERN)],
      ],
      cologne: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      street: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      numInterior: [
        null,
        [
          Validators.required,
          Validators.maxLength(3),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      numExterior: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      delegationMun: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      zipCode: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      circuitCVE: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
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
