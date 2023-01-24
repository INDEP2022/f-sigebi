import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { SEPARATE_FOLIOS_COLUMNS } from './separate-folios-columns';

@Component({
  selector: 'app-separate-folios-modal',
  templateUrl: './separate-folios-modal.component.html',
  styles: [],
})
export class SeparateFoliosModalComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...SEPARATE_FOLIOS_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      serie: [null, [Validators.required]],
      folio: [null, [Validators.required]],
      separate: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      userRegister: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      dateRegister: [null, [Validators.required]],
    });
  }

  close() {
    this.modalRef.hide();
  }

  data = [
    {
      serie: 'H',
      folio: 17663,
      separate: 'M',
      userRegister: 'GBLANCO',
      DateRegister: '11-ENE-2011',
    },
    {
      serie: 'H',
      folio: 17664,
      separate: 'M',
      userRegister: 'GBLANCO',
      DateRegister: '11-ENE-2011',
    },
    {
      serie: 'H',
      folio: 17665,
      separate: 'M',
      userRegister: 'GBLANCO',
      DateRegister: '11-ENE-2011',
    },
    {
      serie: 'H',
      folio: 17666,
      separate: 'M',
      userRegister: 'GBLANCO',
      DateRegister: '11-ENE-2011',
    },
    {
      serie: 'H',
      folio: 17667,
      separate: 'M',
      userRegister: 'GBLANCO',
      DateRegister: '11-ENE-2011',
    },
  ];
}
