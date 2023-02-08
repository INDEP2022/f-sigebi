import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-attribute-parametrization-form',
  templateUrl: './attribute-parametrization-form.component.html',
  styles: [],
})
export class AttributeParametrizationFormComponent implements OnInit {
  form = this.fb.group({
    tabla: [null, [Validators.required]],
    tipoconsulta: [null, [Validators.required]],
    columna: [null, [Validators.required]],
    tipoproceso: [null, [Validators.required]],
    dsatributo: [null, [Validators.required]],
    tipodato: [null, [Validators.required]],
  });
  loading: boolean = false;

  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {}

  ngOnInit(): void {}

  confirm() {}

  close() {
    this.modalRef.hide();
  }
}
