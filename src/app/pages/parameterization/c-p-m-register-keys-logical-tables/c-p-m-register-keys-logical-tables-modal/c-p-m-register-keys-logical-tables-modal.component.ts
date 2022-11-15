import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-c-p-m-register-keys-logical-tables-modal',
  templateUrl: './c-p-m-register-keys-logical-tables-modal.component.html',
  styles: [],
})
export class CPMRegisterKeysLogicalTablesModalComponent implements OnInit {
  title: string = 'Registro de claves para tablas logicas';
  edit: boolean = false;
  form: FormGroup = new FormGroup({});
  allotment: any;
  @Output() refresh = new EventEmitter<true>();

  get type1() {
    return this.form.get('type1');
  }

  get type5() {
    return this.form.get('type5');
  }

  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {}

  ngOnInit(): void {
    this.prepareForom();
  }

  private prepareForom() {
    this.form = this.fb.group({
      name: [null, [Validators.required]],
      description: [null, [Validators.required]],
      type1: [{ value: true, disabled: true }],
      type5: [null, [Validators.required]],
      cve1: [null],
      format1: [null],
      minLong1: [null, [Validators.required]],
      maxLong1: [null, [Validators.required]],

      cve2: [null],
      format2: [null],
      minLong2: [null],
      maxLong2: [null],

      cve3: [null],
      format3: [null],
      minLong3: [null],
      maxLong3: [null],

      cve4: [null],
      format4: [null],
      minLong4: [null],
      maxLong4: [null],

      cve5: [null],
      format5: [null],
      minLong5: [null],
      maxLong5: [null],
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
