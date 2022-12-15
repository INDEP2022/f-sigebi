import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-guidelines-form',
  templateUrl: './guidelines-form.component.html',
  styles: [],
})
export class GuidelinesFormComponent implements OnInit {
  form = this.fb.group({
    directriz: [null, [Validators.required]],
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
