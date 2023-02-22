import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-modal-good-for-donation',
  templateUrl: './modal-good-for-donation.component.html',
  styles: [],
})
export class ModalGoodForDonationComponent implements OnInit {
  title: string = '';
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
      goodStatus: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      descriptionStatus: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      targetIndicator: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      targetIndicatorDesc: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
    if (this.allotment != null) {
      this.edit = true;
      console.log(this.allotment);
      this.form.patchValue(this.allotment);
    }
  }

  close() {
    this.modalRef.hide();
  }
}
