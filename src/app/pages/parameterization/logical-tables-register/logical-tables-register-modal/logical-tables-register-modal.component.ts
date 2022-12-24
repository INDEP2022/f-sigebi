import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-logical-tables-register-modal',
  templateUrl: './logical-tables-register-modal.component.html',
  styles: [],
})
export class LogicalTablesRegisterModalComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  title: string = 'Catálogo de tablas lógicas';
  edit: boolean = false;
  allotment: any;
  @Output() refresh = new EventEmitter<true>();
  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      table: [
        null,
        [
          Validators.required,
          Validators.maxLength(8),
          Validators.minLength(1),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      name: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      actionType: [null, [Validators.required]],
      tableType: [null, [Validators.required]],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
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
