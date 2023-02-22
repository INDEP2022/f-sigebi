import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-attributes-reg-logical-tables-modal',
  templateUrl: './attributes-reg-logical-tables-modal.component.html',
  styles: [],
})
export class AttributesRegLogicalTablesModalComponent implements OnInit {
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
      name: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      type: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      noAtt: [null, [Validators.required]],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      format: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
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
