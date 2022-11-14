import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-new-cover',
  templateUrl: './modal-new-cover.component.html',
  styles: [],
})
export class ModalNewCoverComponent implements OnInit {
  form: FormGroup;
  autocompleteForm: FormGroup;
  showProceedingsDetail: boolean = false;

  constructor(private fb: FormBuilder, private bsModalRef: BsModalRef) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      user: [null, Validators.required],
      unit: [null, [Validators.required]],
      file: [null, [Validators.required]],
      disposition: [null, [Validators.required]],
      proceedingsDate: [null, [Validators.required]],
      reserveDate: [null],
      fojas: [null, [Validators.required]],
      legajos: [null, Validators.required],
      regionalDeleg: [null],
    });

    this.autocompleteForm = this.fb.group({
      transf: [null],
      ddcId: [null],
      coding: [null],
      reservePeriod: [null],
      clasification: [null],
      documentarySection: [null],
      documentarySeries: [null],
      validityFileProcess: [null],
      validityFileConcentration: [null],
      documentaryValues: [null],
    });
  }

  generateCover() {
    this.showProceedingsDetail = !this.showProceedingsDetail;
  }

  closeModal() {
    this.bsModalRef.hide();
  }

  onSubmit() {}
}
