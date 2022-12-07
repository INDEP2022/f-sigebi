import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-assign-good-grouper',
  templateUrl: './modal-assign-good-grouper.component.html',
  styles: [],
})
export class ModalAssignGoodGrouperComponent implements OnInit {
  form: FormGroup;
  public event: EventEmitter<any> = new EventEmitter();

  constructor(private fb: FormBuilder, private bsModalRef: BsModalRef) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nameGoodGrouper: ['', [Validators.required]],
    });
  }

  accept() {
    this.event.emit(this.form.value.nameGoodGrouper);
    this.bsModalRef.hide();
  }

  close() {
    this.bsModalRef.hide();
  }
}
