import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-consideration-form',
  templateUrl: './consideration-form.component.html',
  styles: [],
})
export class ConsiderationFormComponent implements OnInit {
  form = this.fb.group({
    capitulo: [null, [Validators.required]],
    partida: [null, [Validators.required]],
    subsubpartida: [null, [Validators.required]],
    nom: [null, [Validators.required]],
    subpartida: [null, [Validators.required]],
    destino: [null, [Validators.required]],
  });
  loading: boolean = false;

  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {}

  ngOnInit(): void {}

  confirm() {}

  close() {
    this.modalRef.hide();
  }
}
