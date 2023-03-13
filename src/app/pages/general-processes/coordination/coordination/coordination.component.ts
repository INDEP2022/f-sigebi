import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-coordination',
  templateUrl: './coordination.component.html',
  styles: [],
})
export class CoordinationComponent implements OnInit {
  form = this.fb.group({
    coordinacion: [null, [Validators.required]],
  });
  select = new DefaultSelect();
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}
}
