import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { SharedModule } from 'src/app/shared/shared.module';
//Params
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Services
import { ProcedureManagementService } from 'src/app/core/services/proceduremanagement/proceduremanagement.service';
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { IManagementArea } from 'src/app/core/models/ms-proceduremanagement/ms-proceduremanagement.interface';

@Component({
  selector: 'app-management-area-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './management-area-shared.component.html',
  styles: [],
})
export class ManagementAreaSharedComponent extends BasePage implements OnInit {
  @Input() form: FormGroup;
  @Input() managementAreaField: string = 'managementArea';
  @Input() showManagementArea: boolean = true;

  managementAreas = new DefaultSelect<IManagementArea>();
  listParams = new BehaviorSubject<ListParams>(new ListParams());

  get managementArea() {
    return this.form.get(this.managementAreaField);
  }

  constructor(private procedureManagementService: ProcedureManagementService) {
    super();
  }

  ngOnInit(): void {
    let params = {
      ...this.listParams.getValue(),
      order: 'DESC',
      take: 20,
    };

    this.getManagementAreas(params);
  }

  getManagementAreas(params: ListParams) {
    params = {
      ...params,
      order: 'DESC',
      take: 20,
    };
    this.procedureManagementService.getManagamentArea(params).subscribe({
      next: resp => {
        if (resp.data) {
          let data = resp.data.map(area => {
            area.description = `${area.id}-${area.description}`;
            return area;
          });
          this.managementAreas = new DefaultSelect(data, resp.count);
        }
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.error.message;
        }
        this.onLoadToast('error', error, '');
      },
    });
  }

  onManagementAreasChange(managementArea: any) {
    this.managementAreas = new DefaultSelect();
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      field = null;
    });
    this.form.updateValueAndValidity();
  }
}
