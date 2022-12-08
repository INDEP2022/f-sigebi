import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-additional-values-modal',
  templateUrl: './additional-values-modal.component.html',
  styles: [],
})
export class AdditionalValuesModalComponent implements OnInit {
  additionalValuesForm: FormGroup;

  title: string = 'Valores Adicionales';
  edit: boolean = false;
  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {}

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.additionalValuesForm = this.fb.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
    });
  }
  close() {
    this.modalRef.hide();
  }
}
