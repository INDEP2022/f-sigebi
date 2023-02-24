import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ProeficientService } from 'src/app/core/services/catalogs/proficient.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-modal-cat-appraisers',
  templateUrl: './modal-cat-appraisers.component.html',
  styles: [],
})
export class ModalCatAppraisersComponent extends BasePage implements OnInit {
  title: string = 'Catálogo de Peritos';
  edit: boolean = false;
  form: FormGroup = new FormGroup({});
  allotment: any;
  @Output() refresh = new EventEmitter<true>();

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private proficientSer: ProeficientService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      name: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(200),
        ],
      ],
      position: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(60),
        ],
      ],
      id: [null],
      registryNumber: [null],
    });
    if (this.allotment != null) {
      this.edit = true;
      this.form.patchValue(this.allotment);
    }
  }

  confirm() {
    if (this.form.valid) {
      if (this.edit) {
        this.proficientSer.updateProficient(this.form.value).subscribe({
          next: () => this.handleSuccess(),
          error: err => this.onLoadToast('error', err.error.message, ''),
        });
      } else {
        this.proficientSer.create(this.form.value).subscribe({
          next: () => this.handleSuccess(),
          error: err => this.onLoadToast('error', err.error.message, ''),
        });
      }
    }
  }

  handleSuccess() {
    this.onLoadToast(
      'success',
      `Se ha ${this.edit ? 'actualizado' : 'guardado'} correctament`,
      ''
    );
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  close() {
    this.modalRef.hide();
  }
}
