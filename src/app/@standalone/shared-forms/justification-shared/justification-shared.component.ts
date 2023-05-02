import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
//Rxjs
//Params
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Services
//import { MeasurementUnitsService } from 'src/app/core/services/catalogs/measurement-units.service';
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { IUser } from 'src/app/core/models/administrative-processes/siab-sami-interaction/user.model';
import { DynamicTablesService } from 'src/app/core/services/dynamic-catalogs/dynamic-tables.service';

@Component({
  selector: 'app-justification-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './justification-shared.component.html',
  styles: [],
})
export class JustificationSharedComponent extends BasePage implements OnInit {
  @Input() form: FormGroup;
  @Input() userField: string = 'justification';
  @Input() label: string = 'Justificación';
  @Input() showUsers: boolean = true;
  //If Form PatchValue
  @Input() patchValue: boolean = false;

  justifications = new DefaultSelect<IUser>();

  constructor(private readonly dynamicTablesService: DynamicTablesService) {
    super();
  }

  ngOnInit(): void {}

  getJustification(params: ListParams) {
    this.dynamicTablesService.getTvalTable1ByTableKey(2, params).subscribe({
      next: response => {
        this.justifications = new DefaultSelect(response.data, response.count);
        console.log(response);
      },
      error: err => {
        console.log(err);
      },
    });
  }

  onJustificationChange(type: any) {
    if (this.patchValue) {
      this.form.patchValue({
        value: type.value,
      });
      this.form.updateValueAndValidity();
    } else {
      this.form.updateValueAndValidity();
    }
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      //field.setValue(null);
      field = null;
    });
    this.form.updateValueAndValidity();
  }
}
