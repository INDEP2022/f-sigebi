import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-status-change',
  templateUrl: './status-change.component.html',
  styles: [],
})
export class StatusChangeComponent implements OnInit {
  form = this.fb.group({
    bien: [null, [Validators.required]],
    actual: [null, [Validators.required]],
    nuevo: [null, [Validators.required]],
    motivo: [null, [Validators.required]],
  });
  select = new DefaultSelect();
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}
}
