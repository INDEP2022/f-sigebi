import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-ligies-departures-form',
  templateUrl: './ligies-departures-form.component.html',
  styles: [],
})
export class LigiesDeparturesFormComponent implements OnInit {
  form = this.fb.group({
    capitulo: [null, [Validators.required]],
    partida: [null, [Validators.required]],
  });
  loading: boolean = false;

  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {}

  ngOnInit(): void {}

  confirm() {}

  close() {
    this.modalRef.hide();
  }
}
