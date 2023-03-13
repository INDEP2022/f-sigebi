import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-confirm-validation',
  templateUrl: './confirm-validation.component.html',
  styles: [],
})
export class ConfirmValidationComponent implements OnInit {
  form: FormGroup;
  public event: EventEmitter<any> = new EventEmitter();

  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      contributingResult: [null, Validators.required],
      observations: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  accept() {
    this.event.emit(this.form.value);
    this.modalRef.hide();
  }

  close() {
    this.modalRef.hide();
  }
}
