import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ICircuit } from 'src/app/core/models/administrative-processes/siab-sami-interaction/circuit.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { SharedModule } from 'src/app/shared/shared.module';
import { circuitData } from './data';

@Component({
  selector: 'app-circuit-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './circuit-shared.component.html',
  styles: [],
})
export class CircuitSharedComponent extends BasePage implements OnInit {
  @Input() form: FormGroup;
  @Input() circuitField: string = 'circuit';

  @Input() showCircuit: boolean = true;

  circuit = new DefaultSelect<ICircuit>();

  constructor(/*private service: WarehouseService*/) {
    super();
  }

  ngOnInit(): void {}

  getCircuit(params: ListParams) {
    //Provisional data
    let data = circuitData;
    let count = data.length;
    this.circuit = new DefaultSelect(data, count);
    /*this.service.getAll(params).subscribe(data => {
        this.status = new DefaultSelect(data.data,data.count);
      },err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        this.onLoadToast('error', 'Error', error);

      }, () => {}
    );*/
  }

  onCircuitChange(type: any) {
    this.form.updateValueAndValidity();
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      //field.setValue(null);
      field = null;
    });
    this.form.updateValueAndValidity();
  }
}
