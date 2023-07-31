import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ParameterInvoiceService } from 'src/app/core/services/ms-parameterinvoice/parameterinvoice.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-rebilling-causes-modal',
  templateUrl: './rebilling-causes-modal.component.html',
  styles: [],
})
export class RebillingCausesModalComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  allotment: any;
  title: string = 'Causas para generar refacturación';
  edit: boolean = false;
  @Output() refresh = new EventEmitter<true>();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private comerRebilService: ParameterInvoiceService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      id: [null],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      rebill: ['R', Validators.required],
      apply: [null, Validators.required],
      comments: [null, Validators.pattern(STRING_PATTERN)],
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
      const sendData: any = this.form.value;
      sendData.comments = sendData.comments
        ? sendData.comments.toUpperCase()
        : '';
      sendData.description = sendData.description
        ? sendData.description.toUpperCase()
        : '';
      this.comerRebilService.update(sendData).subscribe({
        next: () => {
          this.alert('success', 'Refacturación', 'Actualizado Correctamente');
          this.modalRef.hide();
          this.modalRef.content.callback(true);
        },
        error: err => {
          this.loading = false;
          this.alert('error', 'Error', err.error.message);
        },
      });
    } else {
      const sendData: any = this.form.value;
      sendData.comments = sendData.comments
        ? sendData.comments.toUpperCase()
        : '';
      sendData.description = sendData.description
        ? sendData.description.toUpperCase()
        : '';
      delete sendData.id;
      this.comerRebilService.create(sendData).subscribe({
        next: () => {
          this.loading = false;
          this.alert('success', 'Refacturación', 'Creado Correctamente');
          this.modalRef.hide();
          this.modalRef.content.callback(true);
        },
        error: err => {
          this.loading = false;
          this.alert('error', 'Error', err.error.message);
        },
      });
    }
  }
}
