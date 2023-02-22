import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styles: [],
})
export class SummaryComponent implements OnInit {
  flyersForm: FormGroup;
  select = new DefaultSelect();

  get includeArea() {
    return this.flyersForm.get('includeArea');
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.flyersForm = this.fb.group({
      delegation: [null, [Validators.required]],
      subdelegation: [null, [Validators.required]],
      entidad: [null, [Validators.required]],
      from: [null, [Validators.required]],
      to: [null, [Validators.required]],
      includeArea: [false, [Validators.required]],
      area: [null, [Validators.required]],
    });
  }
}
