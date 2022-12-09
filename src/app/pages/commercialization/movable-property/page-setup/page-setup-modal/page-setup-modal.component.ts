import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-page-setup-modal',
  templateUrl: './page-setup-modal.component.html',
  styles: [],
})
export class PageSetupModalComponent extends BasePage implements OnInit {
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
      table: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      column: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      ak: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      orderColumns: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      ak2: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
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
