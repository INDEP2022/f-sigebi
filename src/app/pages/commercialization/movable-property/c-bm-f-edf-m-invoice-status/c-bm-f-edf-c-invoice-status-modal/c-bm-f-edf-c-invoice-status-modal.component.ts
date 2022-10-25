import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-c-bm-f-edf-c-invoice-status-modal',
  templateUrl: './c-bm-f-edf-c-invoice-status-modal.component.html',
  styles: [],
})
export class CBmFEdfCInvoiceStatusModalComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  allotment: any;
  title: string = 'Causas de ';
  edit: boolean = false;
  @Output() refresh = new EventEmitter<true>();

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      id: [null, [Validators.required]],
      descripcion: [null, [Validators.required]],
    });
    if (this.allotment != null) {
      this.edit = true;
      console.log(this.allotment);
      this.form.patchValue(this.allotment);
    }
  }

  close() {
    this.modalRef.hide();
  }
}
