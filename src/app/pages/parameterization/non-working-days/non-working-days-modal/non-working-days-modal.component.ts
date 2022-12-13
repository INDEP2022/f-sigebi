import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-non-working-days-modal',
  templateUrl: './non-working-days-modal.component.html',
  styles: [],
})
export class NonWorkingDaysModalComponent implements OnInit {
  nonWorkingDaysForm: FormGroup;
  title: string = 'Días Inhábiles';
  edit: boolean = false;
  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {}

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.nonWorkingDaysForm = this.fb.group({
      day: [null, Validators.required],
      description: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
    });
  }
  close() {
    this.modalRef.hide();
  }
}
