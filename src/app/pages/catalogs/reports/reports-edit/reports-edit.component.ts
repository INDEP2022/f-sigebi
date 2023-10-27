import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-reports-edit',
  templateUrl: './reports-edit.component.html',
  styles: [],
})
export class ReportsEditComponent implements OnInit {
  form = this.fb.group({
    report: [],
    name: [],
    description: [],
    radio: [],
  });
  reports = new DefaultSelect();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}
}
