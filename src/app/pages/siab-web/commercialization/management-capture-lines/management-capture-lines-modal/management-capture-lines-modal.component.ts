import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { RFC_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-management-capture-lines-modal',
  templateUrl: './management-capture-lines-modal.component.html',
  styles: [],
})
export class managementCaptureLinesModalComponent implements OnInit {
  title: string = 'Línea de captura';
  edit: boolean = true;
  form: FormGroup = new FormGroup({});

  allotment: any;
  @Output() refresh = new EventEmitter<true>();

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      lc: [null, [Validators.required]],
      lote_publico: [null, [Validators.required]],
      importe: [null, [Validators.required]],
      estatus: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      tipo: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      referencia: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      fec_vigencia: [null, [Validators.required]],
      rfc: [null, [Validators.required, Validators.pattern(RFC_PATTERN)]],
      idClient: [null, [Validators.required]],
      cliente: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      monto_pena: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      note: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
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
