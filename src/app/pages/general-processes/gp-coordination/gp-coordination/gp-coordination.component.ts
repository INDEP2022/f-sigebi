import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-gp-coordination',
  templateUrl: './gp-coordination.component.html',
  styles: [],
})
export class GpCoordinationComponent implements OnInit {
  form = this.fb.group({
    coordinacion: [null, [Validators.required]],
  });
  select = new DefaultSelect();
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}
}
