import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GoodTrackerForm } from '../../utils/goods-tracker-form';

@Component({
  selector: 'certificates-filter',
  templateUrl: './certificates-filter.component.html',
  styles: [],
})
export class CertificatesFilterComponent implements OnInit {
  @Output() onSubmit = new EventEmitter<any>();
  @Input() form: FormGroup<GoodTrackerForm>;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  search() {
    this.onSubmit.emit(this.form.value);
  }
}
