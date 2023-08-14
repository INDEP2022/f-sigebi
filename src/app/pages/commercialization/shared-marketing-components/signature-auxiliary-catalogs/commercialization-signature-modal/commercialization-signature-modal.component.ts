import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { BasePage } from 'src/app/core/shared';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { SignatureAuxiliaryCatalogsService } from '../services/signature-auxiliary-catalogs.service';

@Component({
  selector: 'app-commercialization-signature-modal',
  templateUrl: './commercialization-signature-modal.component.html',
  styles: [],
})
export class CommercializationSignatureModalComponent
  extends BasePage
  implements OnInit
{
  data: any;
  edit: boolean = false;
  dataUser = new DefaultSelect();
  dataFirmType = new DefaultSelect();
  formGroup: FormGroup = new FormGroup({});
  @Output() onConfirm = new EventEmitter<boolean>();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private svSignatureAuxiliaryCatalogsService: SignatureAuxiliaryCatalogsService,
    private msDocumentsService: DocumentsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.formGroup = this.fb.group({
      // recordNumber: [{ value: null, disabled: false }],
      numberconsec: [{ value: null, disabled: false }],
      idDocumentsxml: [{ value: null, disabled: false }],
      user: [
        { value: null, disabled: false },
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      name: [{ value: null, disabled: false }],
      post: [{ value: null, disabled: false }],
      idGuySignatory: [
        { value: null, disabled: false },
        [
          Validators.required,
          Validators.maxLength(2),
          Validators.pattern(NUMBERS_PATTERN),
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
      this.getConsecutiveNumber(this.formGroup.value.idDocumentsxml);
    } else {
      this.svSignatureAuxiliaryCatalogsService
        .updateComerceDocumentsXmlT(this.formGroup.value)
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

  changeUsers(event: any) {
    console.log(event);
    this.formGroup.get('name').setValue(event ? event.nombre : null);
  }

  getUsers(paramsData: ListParams, getByValue: boolean = false) {
    const params: any = new FilterParams();
    if (paramsData['search'] == undefined || paramsData['search'] == null) {
      paramsData['search'] = '';
    }
    params.removeAllFilters();
    if (getByValue) {
      params.addFilter('id', this.formGroup.get('user').value);
    } else {
      params.search = paramsData['search'];
    }
    params['sortBy'] = 'name:ASC';
    let subscription = this.svSignatureAuxiliaryCatalogsService
      .getAllNameOtval(params.getParams())
      .subscribe({
        next: data => {
          this.dataUser = new DefaultSelect(
            data.data.map((i: any) => {
              i['description'] = i.usuario + ' -- ' + i.nombre;
              return i;
            }),
            data.count
          );
          console.log(data, this.dataUser);
          subscription.unsubscribe();
        },
        error: error => {
          this.dataUser = new DefaultSelect();
          subscription.unsubscribe();
        },
      });
  }

  changeFirm(event: any) {
    console.log(event);
    this.formGroup.get('post').setValue(event ? event.denomination : null);
  }

  getFirmType(paramsData: ListParams, getByValue: boolean = false) {
    const params: any = new FilterParams();
    if (paramsData['search'] == undefined || paramsData['search'] == null) {
      paramsData['search'] = '';
    }
    params.removeAllFilters();
    if (getByValue) {
      // params.addFilter('id', this.formGroup.get('usuario').value);
      params['filter.signatoryType'] =
        '$eq:' + this.formGroup.get('idGuySignatory').value;
    } else {
      params.search = paramsData['search'];
    }
    params['sortBy'] = 'signatoryType:ASC';
    let subscription = this.svSignatureAuxiliaryCatalogsService
      .getComerTypeSignatories(params.getParams())
      .subscribe({
        next: data => {
          this.dataFirmType = new DefaultSelect(data.data, data.count);
          console.log(data, this.dataFirmType);
          subscription.unsubscribe();
        },
        error: error => {
          this.dataFirmType = new DefaultSelect();
          subscription.unsubscribe();
        },
      });
  }

  getConsecutiveNumber(id_docums_xml: number) {
    this.msDocumentsService.getMaxConsec(id_docums_xml).subscribe({
      next: res => {
        this.formGroup.get('numberconsec').setValue(res);
        console.log('RESPONSE', res, this.formGroup.value);
        this.svSignatureAuxiliaryCatalogsService
          .createComerceDocumentsXmlT(this.formGroup.value)
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
  }
}
