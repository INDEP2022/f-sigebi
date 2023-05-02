import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-witness-form',
  templateUrl: './witness-form.component.html',
  styles: [],
})
export class WitnessFormComponent extends BasePage implements OnInit {
  witnessForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.witnessForm = this.fb.group({
      nameWitness: [null, [Validators.pattern(STRING_PATTERN)]],
      chargeWitness: [null, [Validators.pattern(STRING_PATTERN)]],
      electronicSignature: [null],
    });
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Estás seguro que desea crear un nuevo testigo?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast('success', 'Testigo creado correctamente', '');

        this.close();
      }
    });
  }
}
