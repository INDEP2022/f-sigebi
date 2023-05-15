import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ComerNotariesTercsService } from 'src/app/core/services/ms-notary/notary.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  EMAIL_PATTERN,
  PHONE_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-form-capture-lawyers',
  templateUrl: './form-capture-lawyers.component.html',
  styles: [],
})
export class FormCaptureLawyersComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  status: string = 'Nuevo';
  edit: boolean = false;
  form: FormGroup = new FormGroup({});
  lawyer: any;
  string_PTRN: `[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ@\\s\\.,_\\-¿?\\\\/()%$#¡!|]*'; [a-zA-Z0-9áéíóúÁÉÍÓÚñÑ@\\s\\.,_\\-¿?\\\\/()%$#¡!|]`;
  @Output() refresh = new EventEmitter<true>();
  // loading: boolean;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private comerNotariesTercsService: ComerNotariesTercsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm(): void {
    this.form = this.fb.group({
      name: [
        '',
        [
          Validators.pattern(STRING_PATTERN),
          Validators.required,
          Validators.maxLength(50),
        ],
      ],
      businessName: [
        '',
        [
          Validators.pattern(this.string_PTRN),
          Validators.required,
          Validators.maxLength(50),
        ],
      ],
      lastName: [
        '',
        [
          Validators.pattern(STRING_PATTERN),
          Validators.required,
          Validators.maxLength(50),
        ],
      ],
      motherLastName: [
        '',
        [
          Validators.pattern(STRING_PATTERN),
          Validators.required,
          Validators.maxLength(50),
        ],
      ],
      physicalRfc: [
        '',
        [
          Validators.pattern(STRING_PATTERN),
          Validators.required,
          Validators.maxLength(13),
        ],
      ],
      moralRdc: [
        '',
        [
          Validators.pattern(STRING_PATTERN),
          Validators.required,
          Validators.maxLength(13),
        ],
      ],
      phone: [
        null,
        [
          Validators.pattern(PHONE_PATTERN),
          Validators.required,
          Validators.maxLength(20),
        ],
      ],
      email: ['', [Validators.pattern(EMAIL_PATTERN), Validators.required]],
    });
    if (this.edit) {
      this.status = 'Actualizar';
      const {
        id,
        businessName,
        name,
        lastName,
        motherLastName,
        physicalRfc,
        moralRdc,
        phone,
        email,
      } = this.lawyer;
      this.form.patchValue(this.lawyer);
      this.form.get('businessName').setValue(businessName);
      this.form.get('name').setValue(name);
      this.form.get('lastName').setValue(lastName);
      this.form.get('motherLastName').setValue(motherLastName);
      this.form.get('physicalRfc').setValue(physicalRfc);
      this.form.get('moralRdc').setValue(moralRdc);
      this.form.get('phone').setValue(phone);
      this.form.get('email').setValue(email);
    }
  }

  close() {
    this.modalRef.hide();
  }

  create() {
    this.loading = true;
    this.comerNotariesTercsService.create(this.form.value).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false)
    );
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast(
      'success',
      'ABOGADO FORMALIZADO',
      `${message} Correctamente`
    );
    this.loading = false;
    this.refresh.emit(true);
    this.modalRef.hide();
  }

  update() {
    this.loading = true;
    let params = new ListParams();
    params['filter.physicalRfc'] = `$eq:${this.form.get('physicalRfc').value}`;

    if (this.edit) {
      params['filter.id'] = `$not:${this.lawyer.id}`;
    }

    this.comerNotariesTercsService.getAll(params).subscribe(
      data => {
        this.handleRfcPhisycal();
      },
      error => {
        this.comerNotariesTercsService
          .update(this.lawyer.id, this.form.value)
          .subscribe(
            data => this.handleSuccess(),
            error => (this.loading = false)
          );

        this.loading = false;
      }
    );
    this.loading = false;
  }

  handleRfcPhisycal() {
    this.onLoadToast('warning', 'RFC Físico ya existente', ``);
  }
}
