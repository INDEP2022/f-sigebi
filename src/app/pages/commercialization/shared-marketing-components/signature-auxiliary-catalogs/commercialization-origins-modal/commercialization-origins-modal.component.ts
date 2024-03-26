import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared';
import { NUM_POSITIVE, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { SignatureAuxiliaryCatalogsService } from '../services/signature-auxiliary-catalogs.service';

@Component({
  selector: 'app-commercialization-origins-modal',
  templateUrl: './commercialization-origins-modal.component.html',
  styles: [],
})
export class CommercializationOriginsModalComponent
  extends BasePage
  implements OnInit
{
  data: any;
  edit: boolean = false;
  formGroup: FormGroup = new FormGroup({});
  @Output() onConfirm = new EventEmitter<boolean>();
  screens = new DefaultSelect();
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
      screenKey: [
        { value: null, disabled: false },
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      signatoriesNumber: [
        { value: null, disabled: false },
        [
          Validators.required,
          Validators.maxLength(2),
          Validators.pattern(NUM_POSITIVE),
        ],
      ],
      description: [
        { value: null, disabled: false },
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      reportKey: [
        { value: null, disabled: false },
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
    });
    console.log(this.data);
    if (this.data !== undefined) {
      this.edit = true;
      this.formGroup.patchValue(this.data);
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    console.log(this.formGroup.value);
    if (this.formGroup.invalid) {
      this.alert('warning', 'Complete los campos requeridos correctamente', '');
      this.formGroup.markAllAsTouched();
      return;
    }
    this.loading = true;
    if (this.edit == false) {
      const { signatoriesNumber } = this.formGroup.value;
      if (signatoriesNumber <= 0)
        return (
          (this.loading = false),
          this.alert(
            'warning',
            'Debe ingresar un número de Firmantes válido.',
            ''
          )
        );
      this.svSignatureAuxiliaryCatalogsService
        .createComerOrigins(this.formGroup.value)
        .subscribe({
          next: res => {
            this.loading = false;
            console.log('RESPONSE', res);
            this.onConfirm.emit(this.formGroup.value);
            this.alert('success', 'Registro Creado Correctamente', '');
            this.formGroup.reset();
            this.close();
          },
          error: error => {
            this.loading = false;
            console.log(error);
            this.alert(
              'warning',
              'Ocurrió un error al intentar crear el registro',
              ''
            );
          },
        });
    } else {
      this.svSignatureAuxiliaryCatalogsService
        .updateComerOrigins(this.formGroup.value.originId, this.formGroup.value)
        .subscribe({
          next: res => {
            this.loading = false;
            console.log('RESPONSE', res);
            this.onConfirm.emit(this.formGroup.value);
            this.alert('success', 'Registro actualizado correctamente', '');
            this.formGroup.reset();
            this.close();
          },
          error: error => {
            this.loading = false;
            console.log(error);
            this.alert(
              'warning',
              'Ocurrió un error al intentar actualizar el registro',
              ''
            );
          },
        });
    }
  }

  getScreens(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;
    if (lparams.text)
      params.addFilter('screenKey', lparams.text, SearchFilter.ILIKE);

    this.svSignatureAuxiliaryCatalogsService
      .getScreensAplicationTracking(params.getParams())
      .subscribe({
        next: data => {
          let result = data.data.map((item: any) => {});
          Promise.all(result).then(resp => {
            console.log('EVENT', data);
            this.screens = new DefaultSelect(data.data, data.count);
          });
        },
        error: err => {
          this.screens = new DefaultSelect();
        },
      });
  }
  setValuesForm(event: any) {}
}
