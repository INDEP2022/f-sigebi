import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';

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
      nameWitness: [null],
      chargeWitness: [null],
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
      '¿Estas seguro que deseas crear un nuevo testigo?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast('success', 'Testigo creado correctamente', '');

        this.close();
      }
    });
  }
}
