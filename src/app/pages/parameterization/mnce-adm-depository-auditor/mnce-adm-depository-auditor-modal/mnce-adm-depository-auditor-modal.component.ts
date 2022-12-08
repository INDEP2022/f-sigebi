import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-mnce-adm-depository-auditor-modal',
  templateUrl: './mnce-adm-depository-auditor-modal.component.html',
  styles: [],
})
export class MnceAdmDepositoryAuditorModalComponent implements OnInit {
  title: string = 'Mantenimiento a administrador, depositario e interventor';
  edit: boolean = false;
  form: FormGroup = new FormGroup({});
  allotment: any;
  @Output() refresh = new EventEmitter<true>();

  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      cve: [null, [Validators.required]],
      description: [null, [Validators.required]],
      street: [null, [Validators.required]],
      noExt: [null, [Validators.required]],
      noInt: [null, [Validators.required]],
      suburb: [null, [Validators.required]],
      zipCode: [null, [Validators.required]],
    });
  }

  close() {
    this.modalRef.hide();
  }
}
