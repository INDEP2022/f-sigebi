import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-c-p-m-values-modal',
  templateUrl: './c-p-m-values-modal.component.html',
  styles: [
  ]
})
export class CPMValuesModalComponent implements OnInit {
  valuesForm: FormGroup;

  title: string = 'Valores';
  edit: boolean = false;
  constructor(private fb: FormBuilder, private modalRef: BsModalRef) { }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.valuesForm = this.fb.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
    });
  }
  close() {
    this.modalRef.hide();
  }
}
