import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-range-picker',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './range-picker-modal.component.html',
  styles: [],
})
export class RangePickerModalComponent implements OnInit {
  form: FormGroup;
  loading = false;
  @Output() onSelect = new EventEmitter<any>();
  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {
    this.form = this.fb.group({
      inicio: [null, [Validators.required]],
      fin: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {}
  confirm() {
    this.onSelect.emit(this.form.value);
    this.modalRef.hide();
  }
  close() {
    this.modalRef.hide();
  }

  get fechaInicio() {
    return this.form.get('inicio');
  }
}
