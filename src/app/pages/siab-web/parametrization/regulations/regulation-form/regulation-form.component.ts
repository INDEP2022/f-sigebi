import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-regulation-form',
  templateUrl: './regulation-form.component.html',
  styles: [],
})
export class RegulationFormComponent implements OnInit {
  form = this.fb.group({
    regulacion: [null, [Validators.required]],
    mercancia: [null, [Validators.required]],
    descripcion: [null, [Validators.required]],
  });
  loading: boolean = false;

  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {}

  ngOnInit(): void {}

  confirm() {}

  close() {
    this.modalRef.hide();
  }
}
