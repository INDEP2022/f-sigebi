import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { EMAIL_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-information-record',
  templateUrl: './information-record.component.html',
  styles: [],
})
export class InformationRecordComponent extends BasePage implements OnInit {
  infoForm: FormGroup = new FormGroup({});
  horaActual: string;
  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
    this.obtenerHoraActual();
  }

  ngOnInit(): void {
    this.prepareDevileryForm();
  }
  obtenerHoraActual() {
    const fechaActual = new Date();
    const opcionesHora: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
    };
    this.horaActual = fechaActual.toLocaleTimeString([], opcionesHora);
  }
  prepareDevileryForm() {
    this.infoForm = this.fb.group({
      nom_funcionario_1: [null, [Validators.pattern(STRING_PATTERN)]],
      electronicSignature_1: [null],
      cargo_funcionario_1: [null, [Validators.pattern(STRING_PATTERN)]],
      resi_funcionario_1: [null, [Validators.pattern(STRING_PATTERN)]],
      cat_id_funcionario_1: [null],
      no_id_funcionario_1: [null],
      exp_id_funcionario_1: [null, [Validators.pattern(STRING_PATTERN)]],
      email_1: [null, [Validators.pattern(EMAIL_PATTERN)]],
      //---------------------------------
      nom_funcionario_2: [null, [Validators.pattern(STRING_PATTERN)]],
      electronicSignature_2: [null],
      cargo_funcionario_2: [null, [Validators.pattern(STRING_PATTERN)]],
      cat_id_funcionario_2: [null],
      no_id_funcionario_2: [null],
      exp_id_funcionario_2: [null, [Validators.pattern(STRING_PATTERN)]],
      email_2: [null, [Validators.pattern(EMAIL_PATTERN)]],
      //-----------------------------------------
      nom_testigo_1: [null, [Validators.pattern(STRING_PATTERN)]],
      electronicSignature_3: [null],
      cat_id_testigo_1: [null],
      no_id_testigo_1: [null],
      email_3: [null, [Validators.pattern(EMAIL_PATTERN)]],
      //------------------------------------------
      nom_testigo_2: [null, [Validators.pattern(STRING_PATTERN)]],
      electronicSignature_4: [null],
      cat_id_testigo_2: [null],
      no_id_testigo_2: [null],
      email_4: [null, [Validators.pattern(EMAIL_PATTERN)]],
      //-----------------------------------
      no_funcionario_3: [null, [Validators.pattern(STRING_PATTERN)]],
      nom_funcionario_oic: [null, [Validators.pattern(STRING_PATTERN)]],
      electronicSignature_5: [null],
      cargo_funcionario_oic: [null, [Validators.pattern(STRING_PATTERN)]],
      cat_id_funcionario_oic: [null],
      no_id_funcionario_oic: [null],
      exp_id_funcionario_oic: [null, [Validators.pattern(STRING_PATTERN)]],
      email_5: [null, [Validators.pattern(EMAIL_PATTERN)]],
      //------------------------------------
      nom_funcionario_uvfv: [null, [Validators.pattern(STRING_PATTERN)]],
      // electronicSignature: [null],
      cargo_funcionario_uvfv: [null, [Validators.pattern(STRING_PATTERN)]],
      nom_funcionario_4SAT: [null, [Validators.pattern(STRING_PATTERN)]],
      // identification: [null],
      cargo_funcionario_4: [null],
      nocargo_funcionario_uvfv: [null, [Validators.pattern(STRING_PATTERN)]],
      data_oficio_UVFV: [null, [Validators.pattern(STRING_PATTERN)]],
      email_6: [null, [Validators.pattern(EMAIL_PATTERN)]],
    });
  }
  confirm() {}

  close() {
    this.modalRef.hide();
  }
}
