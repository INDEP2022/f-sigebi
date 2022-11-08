import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-c-bm-vm-c-cp-page-setup-modal',
  templateUrl: './c-bm-vm-c-cp-page-setup-modal.component.html',
  styles: [],
})
export class CBmVmCCpPageSetupModalComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  pageSetup: any;
  title: string = 'Campos para Tablas y columnas"';
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
      table: [null, [Validators.required]],
      column: [null, [Validators.required]],
      ak: [null, [Validators.required]],
      orderColumns: [null, [Validators.required]],
      ak2: [null, [Validators.required]],
    });
    if (this.pageSetup != null) {
      this.edit = true;
      console.log(this.pageSetup);
      this.form.patchValue(this.pageSetup);
    }
  }

  close() {
    this.modalRef.hide();
  }
}
