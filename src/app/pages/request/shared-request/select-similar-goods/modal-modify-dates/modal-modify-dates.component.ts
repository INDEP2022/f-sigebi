import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-modify-dates',
  templateUrl: './modal-modify-dates.component.html',
  styles: [],
})
export class ModalModifyDatesComponent implements OnInit {
  form: FormGroup;
  public event: EventEmitter<any> = new EventEmitter();

  constructor(private fb: FormBuilder, private bsModalRef: BsModalRef) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      initDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
    });
  }

  accept() {
    this.event.emit(this.form.value);
    this.bsModalRef.hide();
  }

  close() {
    this.bsModalRef.hide();
  }
}
