import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-c-p-m-non-working-days-modal',
  templateUrl: './c-p-m-non-working-days-modal.component.html',
  styles: [
  ]
})
export class CPMNonWorkingDaysModalComponent implements OnInit {
  nonWorkingDaysForm: FormGroup;
  title: string = 'Días Inhábiles';
  edit: boolean = false;
  constructor(private fb: FormBuilder, private modalRef: BsModalRef) { }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.nonWorkingDaysForm = this.fb.group({
      day: [null, Validators.required],
      description: [null, Validators.required],
    });
  }
  close() {
    this.modalRef.hide();
  }
}
