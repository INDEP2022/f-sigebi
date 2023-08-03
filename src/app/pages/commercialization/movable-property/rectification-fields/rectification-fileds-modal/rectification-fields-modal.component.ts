import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Params } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { RectifitationFieldsService } from 'src/app/core/services/ms-parameterinvoice/rectification-fields.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-rectification-fields-modal',
  templateUrl: './rectification-fields-modal.component.html',
  styles: [],
})
export class RectificationFieldsModalComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  allotment: any;
  title: string = 'Campo para Rectificación de Facturas';
  edit: boolean = false;
  valid: DefaultSelect = new DefaultSelect();
  @Output() refresh = new EventEmitter<true>();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private rectificationFieldService: RectifitationFieldsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      columnId: [null, Validators.required],
      invoiceFieldId: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      table: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    });
    if (this.allotment != null) {
      this.edit = true;
      this.form.patchValue(this.allotment);
    }
  }

  close() {
    this.modalRef.hide();
  }

  saveData() {
    this.loading = true;
    if (this.edit) {
      this.rectificationFieldService.update(this.form.value).subscribe({
        next: () => {
          this.loading = false;
          this.modalRef.hide();
          this.modalRef.content.callback(true);
          this.alert(
            'success',
            'Rectificación de Facturas',
            'Actualizado Correctamente'
          );
        },
        error: err => {
          this.loading = false;
          if (err.status == 400) {
            this.alert(
              'error',
              'Error',
              'Ya existe campo de Rectificación de Facturas'
            );
          } else {
            this.alert('error', 'Error', err.error.message);
          }
        },
      });
    } else {
      this.rectificationFieldService.create(this.form.value).subscribe({
        next: () => {
          this.loading = false;
          this.modalRef.hide();
          this.modalRef.content.callback(true);
          this.alert(
            'success',
            'Rectificación de Facturas',
            'Creado Correctamente'
          );
        },
        error: err => {
          this.loading = false;
          if (err.status == 400) {
            this.alert(
              'error',
              'Error',
              'Ya existe campo de Rectificación de Facturas'
            );
          } else {
            this.alert('error', 'Error', err.error.message);
          }
        },
      });
    }
  }

  getValidate(param: Params) {
    param['limit'] = 30;
    this.rectificationFieldService.getAllFieldValid(param).subscribe({
      next: resp => {
        this.valid = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.valid = new DefaultSelect();
      },
    });
  }
}
