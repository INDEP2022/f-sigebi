import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
//Rxjs
import { BehaviorSubject } from 'rxjs';
//Params
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Services
import { DepartamentService } from 'src/app/core/services/catalogs/departament.service';
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { IDepartment } from 'src/app/core/models/catalogs/department.model';

@Component({
  selector: 'app-departments-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './departments-shared.component.html',
  styles: [],
})
export class DepartmentsSharedComponent extends BasePage implements OnInit {
  @Input() form: FormGroup;
  @Input() departmentField: string = 'department';
  @Input() numDelegation: string = 'delegation';
  @Input() numSubDelegation: string = 'subdelegation';
  @Input() showDepartments: boolean = true;
  @Input() label: string = 'Departamento';

  params = new BehaviorSubject<ListParams>(new ListParams());
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  departments = new DefaultSelect<IDepartment>();

  constructor(private service: DepartamentService) {
    super();
  }

  ngOnInit(): void {}

  getDepartments(params: ListParams) {
    const filterParams = this.filterParams.getValue();
    filterParams.removeAllFilters();

    filterParams.addFilter('delegation', this.form.get('delegation').value);

    filterParams.addFilter(
      'subdelegation',
      this.form.get('subdelegation').value
    );

    console.log(filterParams);
    params = {
      ...params,
    };
    console.log(params);
    this.service.getAll(params).subscribe(
      data => {
        this.departments = new DefaultSelect(data.data, data.count);
      },
      err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        this.onLoadToast('error', 'Error', error);
      },
      () => {}
    );
  }

  onDepartmentsChange(type: any) {
    //this.resetFields([this.subdelegation]);
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
