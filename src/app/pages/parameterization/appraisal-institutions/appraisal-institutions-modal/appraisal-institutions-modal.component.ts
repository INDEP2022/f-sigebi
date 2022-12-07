import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-appraisal-institutions-modal',
  templateUrl: './appraisal-institutions-modal.component.html',
  styles: [],
})
export class AppraisalInstitutionsModalComponent implements OnInit {
  appraisalInstitutionsForm: FormGroup;
  title: string = 'Instituciones Valuadoras';
  edit: boolean = false;
  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {}

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.appraisalInstitutionsForm = this.fb.group({
      noAppraiser: [null, Validators.required],
      nameComplete: [null, Validators.required],
      street: [null, Validators.required],
      noExterior: [null, Validators.required],
      noInside: [null, Validators.required],
      postalCode: [null, Validators.required],
      colony: [null, Validators.required],
      delegationMunicipality: [null, Validators.required],
      federalEntity: [null, Validators.required],
      rfc: [null, Validators.required],
      curp: [null, Validators.required],
      phone: [null, Validators.required],
      representative: [null, Validators.required],
      observations: [null, Validators.required],
    });
  }
  close() {
    this.modalRef.hide();
  }
}
