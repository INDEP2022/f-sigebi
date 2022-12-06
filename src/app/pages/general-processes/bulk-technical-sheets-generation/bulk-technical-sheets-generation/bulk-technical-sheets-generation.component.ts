import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-bulk-technical-sheets-generation',
  templateUrl: './bulk-technical-sheets-generation.component.html',
  styles: [],
})
export class BulkTechnicalSheetsGenerationComponent implements OnInit {
  form = this.fb.group({
    bien: [null, [Validators.required]],
    path: [null, [Validators.required]],
    listado: [null, [Validators.required]],
  });
  select = new DefaultSelect();
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}
}
