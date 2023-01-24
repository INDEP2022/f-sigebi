import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-register-keys-logical-tables-modal',
  templateUrl: './register-keys-logical-tables-modal.component.html',
  styles: [],
})
export class RegisterKeysLogicalTablesModalComponent implements OnInit {
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
      name: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      type1: [{ value: true, disabled: true }],
      type5: [null, [Validators.required]],
      cve1: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
      format1: [null, [Validators.pattern(STRING_PATTERN)]],
      minLong1: [null, [Validators.required]],
      maxLong1: [null, [Validators.required]],

      cve2: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
      format2: [null, [Validators.pattern(STRING_PATTERN)]],
      minLong2: [null],
      maxLong2: [null],

      cve3: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
      format3: [null, [Validators.pattern(STRING_PATTERN)]],
      minLong3: [null],
      maxLong3: [null],

      cve4: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
      format4: [null, [Validators.pattern(STRING_PATTERN)]],
      minLong4: [null],
      maxLong4: [null],

      cve5: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
      format5: [null, [Validators.pattern(STRING_PATTERN)]],
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
