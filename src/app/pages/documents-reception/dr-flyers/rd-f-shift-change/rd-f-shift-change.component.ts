import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';

import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { RdFShitChangeHistoryComponent } from './rd-f-shit-change-history/rd-f-shit-change-history.component';
import {
  SHIFT_CHANGE_COLUMNS,
  SHIFT_CHANGE_EXAMPLE_DATA,
} from './shit-change-columns';

@Component({
  selector: 'app-rd-f-shift-change',
  templateUrl: './rd-f-shift-change.component.html',
  styles: [],
})
export class RdFShiftChangeComponent extends BasePage implements OnInit {
  turnForm: FormGroup;
  settings = { ...TABLE_SETTINGS, actions: false, selectMode: 'multi' };
  atentions = new DefaultSelect();
  data = SHIFT_CHANGE_EXAMPLE_DATA;
  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    super();
    this.settings.columns = SHIFT_CHANGE_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.turnForm = this.fb.group({
      noVolante: [null, [Validators.required]],
      asunto: [null, [Validators.required]],
      fecRec: [null, [Validators.required]],
      fecCap: [null, [Validators.required]],
      remitente: [null, [Validators.required]],
      noAtencion: [null, [Validators.required]],
      atencion: [null, Validators.required],
      noAtencion2: [null, Validators.required],
      atencion2: [null, Validators.required],
      argumento: [null, [Validators.required]],
    });
  }
  save() {
    this.turnForm.markAllAsTouched();
  }

  showHistory() {
    const modalConfig = MODAL_CONFIG;
    this.modalService.show(RdFShitChangeHistoryComponent, modalConfig);
  }
}
