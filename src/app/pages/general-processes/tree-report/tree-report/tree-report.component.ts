import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-tree-report',
  templateUrl: './tree-report.component.html',
  styles: [],
})
export class TreeReportComponent extends BasePage implements OnInit {
  form = this.fb.group({
    origen: [null, [Validators.required]],
    ayuda: [null, [Validators.required]],
  });
  dataSource = [
    {
      columnas: 'EXAMPLE_1',
    },
    {
      columnas: 'EXAMPLE_1',
    },
    {
      columnas: 'EXAMPLE_1',
    },
    {
      columnas: 'EXAMPLE_1',
    },
    {
      columnas: 'EXAMPLE_1',
    },
  ];
  constructor(private fb: FormBuilder) {
    super();
    this.settings.actions = false;
    this.settings.selectMode = 'multi';
    this.settings.columns = {
      columnas: {
        title: 'Columnas de la tabla',
        sort: false,
      },
    };
  }

  ngOnInit(): void {}
}
