import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'clasification-filter',
  templateUrl: './clasification-filter.component.html',
  styles: [],
})
export class ClasificationFilterComponent implements OnInit {
  @Output() onSubmit = new EventEmitter<any>();
  form = this.fb.group({
    fraccion: new FormControl(null, [Validators.required]),
    numeroClasificacion: new FormControl(null, [Validators.required]),
    clasificacionAlterna: new FormControl(null, [Validators.required]),
    sssubtipoDescripcion: new FormControl(null, [Validators.required]),
    type: new FormControl(null, [Validators.required]),
    subtype: new FormControl(null, [Validators.required]),
    ssubtype: new FormControl(null, [Validators.required]),
    sssubtype: new FormControl(null, [Validators.required]),
  });
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  search() {
    this.onSubmit.emit(this.form.value);
  }
}
