import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGiro } from 'src/app/core/models/parameterization/giro.model';
import { TvalTable1Service } from 'src/app/core/services/catalogs/tval-table1.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-turn-company',
  templateUrl: './turn-company.component.html',
  standalone: true,
  imports: [CommonModule, SharedModule],
})
export class TurnCompanyComponent extends BasePage implements OnInit {
  @Input() form: FormGroup;
  @Input() turnField: string = 'keyOperation';

  @Input() showTurn: boolean = true;

  turn: any = new DefaultSelect<IGiro>();

  constructor(private tvalTable1Service: TvalTable1Service) {
    super();
  }

  get Federative() {
    console.log(this.turnField);
    return this.form.get(this.turnField);
  }

  ngOnInit(): void {
    //en espera de filtros dinamicos

    this.getTurn(new ListParams());
  }

  getTurn(params?: ListParams) {
    params['filter.nmtable'] = `$eq:8`;
    this.tvalTable1Service.getAlls(params).subscribe({
      next: data => (this.turn = new DefaultSelect(data.data, data.count)),
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        this.onLoadToast('error', 'Error', error);
      },
    });
  }
  onTurnChange(type: any) {}

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      //field.setValue(null);
      field = null;
    });
    this.form.updateValueAndValidity();
  }
}
