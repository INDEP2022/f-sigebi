import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { StatusInvoiceService } from 'src/app/core/services/ms-parameterinvoice/status-invoice.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-invoice-status-modal',
  templateUrl: './invoice-status-modal.component.html',
  styles: [],
})
export class InvoiceStatusModalComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  allotment: any;
  title: string = 'Estatus de Facturación';
  edit: boolean = false;
  @Output() refresh = new EventEmitter<true>();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private statusInvoiceService: StatusInvoiceService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      id: [null, [Validators.required]],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
    if (this.allotment != null) {
      this.edit = true;
      this.form.patchValue(this.allotment);
    }
  }

  saveData() {
    this.loading = true;

    if (this.edit) {
      const newData = this.form.value;
      this.statusInvoiceService.update(newData).subscribe({
        next: () => {
          this.loading = false;
          this.alert(
            'success',
            'Estatus Facturación',
            'Actualizado Correctamente'
          );
          this.modalRef.hide();
          this.modalRef.content.callback(true);
        },
        error: err => {
          this.loading = false;
          this.alert('error', 'Error', err.error.message);
        },
      });
    } else {
      const newData = this.form.value;

      newData.id = newData.id.toUpperCase();

      this.statusInvoiceService.create(newData).subscribe({
        next: () => {
          this.loading = false;
          this.alert('success', 'Estatus Facturación', 'Creado Correctamente');
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

  close() {
    this.modalRef.hide();
  }
}
