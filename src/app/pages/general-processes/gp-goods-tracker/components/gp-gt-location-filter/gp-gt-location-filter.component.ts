import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'location-filter',
  templateUrl: './gp-gt-location-filter.component.html',
  styles: [],
})
export class GpGtLocationFilterComponent implements OnInit {
  @Output() onSubmit = new EventEmitter<any>();
  form = this.fb.group({
    almacen: [null, [Validators.required]],
    regional: [null, [Validators.required]],
    estadoAutoridad: [null, [Validators.required]],
    estadoBien: [null, [Validators.required]],
  });
  select = new DefaultSelect();
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  search() {
    this.onSubmit.emit(this.form.value);
  }
}
