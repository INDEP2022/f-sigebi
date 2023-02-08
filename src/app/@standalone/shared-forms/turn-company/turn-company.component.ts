import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { IGiro } from 'src/app/core/models/parameterization/giro.model';
import { DynamicTablesService } from 'src/app/core/services/dynamic-catalogs/dynamic-tables.service';
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

  constructor(private service: DynamicTablesService) {
    super();
  }

  get Federative() {
    return this.form.get(this.turnField);
  }

  ngOnInit(): void {
    this.getTurn();
  }

  getTurn() {
    this.service.getByIdData(8).subscribe({
      next: data =>
        (this.turn = new DefaultSelect(
          data.table.data,
          data.table.data.lenght
        )),
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
  onTurnChange(type: any) {
    this.turn = new DefaultSelect();
    this.getTurn();
    this.form.updateValueAndValidity();
    // this.form.updateValueAndValidity();
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      //field.setValue(null);
      field = null;
    });
    this.form.updateValueAndValidity();
  }
}
