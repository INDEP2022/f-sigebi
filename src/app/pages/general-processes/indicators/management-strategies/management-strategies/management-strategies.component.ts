import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { MANAGEMENT_STRATEGIES_COLUMNS } from './management-strategies.columns';

@Component({
  selector: 'app-management-strategies',
  templateUrl: './management-strategies.component.html',
  styles: [],
})
export class ManagementStrategiesComponent extends BasePage implements OnInit {
  form = this.fb.group({
    fecha: [null, [Validators.required]],
    month: [null, [Validators.required]],
    usuario: [null, [Validators.required]],
    coord: [null, [Validators.required]],
    estrategiasPreparar: [null, [Validators.required]],
    reportePreparar: [null, [Validators.required]],
    estrategiasEntregadas: [null, [Validators.required]],
    reporteEntregadas: [null, [Validators.required]],
    porcentaje: [null, [Validators.required]],
  });
  data: any[] = [];
  select = new DefaultSelect();

  constructor(private fb: FormBuilder) {
    super();
    this.settings.actions = false;
    this.settings.columns = MANAGEMENT_STRATEGIES_COLUMNS;
  }

  ngOnInit(): void {}
}
