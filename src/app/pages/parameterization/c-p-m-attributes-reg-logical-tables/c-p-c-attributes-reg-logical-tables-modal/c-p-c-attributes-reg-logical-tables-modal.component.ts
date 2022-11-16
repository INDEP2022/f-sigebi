import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-c-p-c-attributes-reg-logical-tables-modal',
  templateUrl: './c-p-c-attributes-reg-logical-tables-modal.component.html',
  styles: [],
})
export class CPCAttributesRegLogicalTablesModalComponent implements OnInit {
  title: string = 'Registro de atributos para tablas lógicas';
  edit: boolean = false;
  form: FormGroup = new FormGroup({});
  allotment: any;
  @Output() refresh = new EventEmitter<true>();

  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {}

  ngOnInit(): void {
    this.prepareForom();
  }

  private prepareForom() {
    this.form = this.fb.group({
      name: [null, [Validators.required]],
      type: [null, [Validators.required]],
      noAtt: [null, [Validators.required]],
      description: [null, [Validators.required]],
      format: [null, [Validators.required]],
      maxLong: [null, [Validators.required]],
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
