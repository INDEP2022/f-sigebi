import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  EMAIL_PATTERN,
  PHONE_PATTERN,
  STRING_PATTERN,
} from '../../../../core/shared/patterns';
import { INotary } from './../../../../core/models/catalogs/notary.model';
import { NotaryService } from './../../../../core/services/catalogs/notary.service';

@Component({
  selector: 'app-notary-form',
  templateUrl: './notary-form.component.html',
  styles: [],
})
export class NotaryFormComponent extends BasePage implements OnInit {
  notaryForm: FormGroup = new FormGroup({});
  title: string = 'Notario';
  edit: boolean = false;
  notary: INotary;
  items = new DefaultSelect<INotary>();
  @Output() refresh = new EventEmitter<true>();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private notaryService: NotaryService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.notaryForm = this.fb.group({
      id: [null, [Validators.required]],
      name: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      valid: [null, [Validators.required]],
      notaryNumber: [null, [Validators.required]],
      ubication: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      domicile: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      phone: [
        null,
        [
          Validators.required,
          Validators.maxLength(3),
          Validators.pattern(PHONE_PATTERN),
        ],
      ],
      email: [null, [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
      registryNumber: [null, [Validators.required]],
    });
    if (this.notary != null) {
      this.edit = true;
      console.log(this.notary);
      this.notaryForm.patchValue(this.notary);
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
    this.notaryService.create(this.notaryForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.notaryService.update(this.notary.id, this.notaryForm.value).subscribe({
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
