import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'transfer-autority-filter',
  templateUrl: './transfer-autority-filter.component.html',
  styles: [],
})
export class TransferAutorityFilterComponent implements OnInit {
  @Output() onSubmit = new EventEmitter<any>();
  form = this.fb.group({
    transfer: [null, [Validators.required]],
    emisora: [null, [Validators.required]],
    autoridad: [null, [Validators.required]],
  });
  select = new DefaultSelect();
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  search() {
    this.onSubmit.emit(this.form.value);
  }
}
