import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-fraction-with-classifier-form',
  templateUrl: './fraction-with-classifier-form.component.html',
  styles: [],
})
export class FractionWithClassifierFormComponent implements OnInit {
  form = this.fb.group({
    capitulo: [null, [Validators.required]],
    subsubpartida: [null, [Validators.required]],
    partida: [null, [Validators.required]],
    subpartida: [null, [Validators.required]],
    clasificador: [null, [Validators.required]],
  });
  loading: boolean = false;

  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {}

  ngOnInit(): void {}

  confirm() {}

  close() {
    this.modalRef.hide();
  }
}
