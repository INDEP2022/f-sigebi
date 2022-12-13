import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-measurement-units-form',
  templateUrl: './measurement-units-form.component.html',
  styles: [],
})
export class MeasurementUnitsFormComponent implements OnInit {
  form = this.fb.group({
    ligie: [null, [Validators.required]],
    siab: [null, [Validators.required]],
  });
  loading: boolean = false;

  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {}

  ngOnInit(): void {}

  confirm() {}

  close() {
    this.modalRef.hide();
  }
}
