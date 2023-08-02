import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared';
import { EMAIL_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { SignatureAuxiliaryCatalogsService } from '../services/signature-auxiliary-catalogs.service';

@Component({
  selector: 'app-commercialization-destination-modal',
  templateUrl: './commercialization-destination-modal.component.html',
  styles: [],
})
export class CommercializationDestinationModalComponent
  extends BasePage
  implements OnInit
{
  data: any;
  edit: boolean = false;
  formGroup: FormGroup = new FormGroup({});
  @Output() onConfirm = new EventEmitter<boolean>();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private svSignatureAuxiliaryCatalogsService: SignatureAuxiliaryCatalogsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.formGroup = this.fb.group({
      originId: [null],
      email: [
        { value: null, disabled: false },
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(EMAIL_PATTERN),
        ],
      ],
      name: [
        { value: null, disabled: false },
        [
          Validators.required,
          Validators.maxLength(200),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
    });
    console.log(this.data);
    if (this.data !== undefined) {
      // this.edit = true;
      this.formGroup.patchValue(this.data);
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    console.log(this.formGroup.value);
    if (this.formGroup.invalid) {
      this.alert('warning', 'Complete los Campos Requeridos Correctamente', '');
      this.formGroup.markAllAsTouched();
      return;
    }
    if (this.edit == false) {
      this.svSignatureAuxiliaryCatalogsService
        .createComerDestXML(this.formGroup.value)
        .subscribe({
          next: res => {
            console.log('RESPONSE', res);
            this.onConfirm.emit(this.formGroup.value);
            this.alert('success', 'Registro Creado Correctamente', '');
            this.formGroup.reset();
            this.close();
          },
          error: error => {
            console.log(error);
            this.alert(
              'warning',
              'Ocurrió un Error al Intentar Crear el Registro',
              ''
            );
          },
        });
    } else {
      this.svSignatureAuxiliaryCatalogsService
        .updateComerDestXML(this.formGroup.value)
        .subscribe({
          next: res => {
            console.log('RESPONSE', res);
            this.onConfirm.emit(this.formGroup.value);
            this.alert('success', 'Registro Actualizado Correctamente', '');
            this.formGroup.reset();
            this.close();
          },
          error: error => {
            console.log(error);
            this.alert(
              'warning',
              'Ocurrió un Error al Intentar Actualizar el Registro',
              ''
            );
          },
        });
    }
  }
}
