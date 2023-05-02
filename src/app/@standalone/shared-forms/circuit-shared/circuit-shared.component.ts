import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ICircuit } from 'src/app/core/models/administrative-processes/siab-sami-interaction/circuit.model';
import { DynamicTablesService } from 'src/app/core/services/dynamic-catalogs/dynamic-tables.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-circuit-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './circuit-shared.component.html',
  styles: [],
})
export class CircuitSharedComponent extends BasePage implements OnInit {
  @Input() form: FormGroup;
  @Input() circuitField: string = 'circuitCVE';
  @Input() showCircuit: boolean = true;

  get Court() {
    return this.form.get(this.circuitField);
  }

  circuit = new DefaultSelect<ICircuit>();
  code: number = 321;

  constructor(private dinamic: DynamicTablesService) {
    super();
  }

  ngOnInit(): void {
    this.form.get('circuitCVE').valueChanges.subscribe(data => {
      if (!data) return;
      this.dinamic.getByTableKeyOtKey(this.code, data).subscribe({
        next: resp => (this.circuit = new DefaultSelect([resp.data], 1)),
      });
    });
  }

  getCircuit(params?: ListParams) {
    this.dinamic.getTvalTable1ByTableKey(this.code, params).subscribe({
      next: response => {
        this.circuit = new DefaultSelect(response.data, response.count);
      },
      error: err => this.onLoadToast('error', err.error.message, ''),
    });
  }

  onCircuitChange(type: any) {
    this.circuit = new DefaultSelect();
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      field = null;
    });
    this.form.updateValueAndValidity();
  }
}
