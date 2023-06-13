import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { POSITVE_NUMBERS_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-good-value-edit-web-car',
  templateUrl: './good-value-edit-web-car.component.html',
  styleUrls: ['./good-value-edit-web-car.component.scss'],
})
export class GoodValueEditWebCar implements OnInit {
  form: FormGroup;
  info: any;
  otvalor: string;
  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {}
  ngOnInit() {
    let validators = [];
    validators.push(Validators.required);
    if (
      [
        'HABITACIONES',
        'BAÑOS',
        'COCINA',
        'COMEDOR',
        'SALA',
        'ESTUDIO',
        'CUARTO DE SERVICIO',
        'NÚMERO DE SALAS',
        'NÚMERO DE LOCALES',
        'NÚMERO DE PISOS',
        'NÚMERO DE DEPARTAMENTOS',
        'ESPACIOS DE ESTACIONAMIENTO',
      ].includes(this.otvalor)
    ) {
      this.form = this.fb.group({
        info: [
          this.info,
          [Validators.required, Validators.pattern(POSITVE_NUMBERS_PATTERN)],
        ],
      });
    } else {
      this.form = this.fb.group({
        info: [this.info, [Validators.required]],
      });
    }
  }

  confirm() {
    this.modalRef.content.callback(this.form.value);
    this.modalRef.hide();
  }

  close() {
    this.modalRef.hide();
  }
}
