import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';

import { LocalDataSource } from 'ng2-smart-table';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IDepartment } from 'src/app/core/models/catalogs/department.model';
import { DepartamentService } from 'src/app/core/services/catalogs/departament.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DepartmentFormComponent } from '../department-form/department-form.component';
import { DEPARTMENT_COLUMNS } from './department-columns';

@Component({
  selector: 'app-departments-list',
  templateUrl: './departments-list.component.html',
  styles: [],
})
export class DepartmentsListComponent extends BasePage implements OnInit {
  departments: IDepartment[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  constructor(
    private departmentService: DepartamentService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = DEPARTMENT_COLUMNS;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        add: false,
        delete: true,
        position: 'right',
      },
    };
  }

  ngOnInit(): void {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            filter.field == 'id' ||
            filter.field == 'dsarea' ||
            filter.field == 'delegation' ||
            filter.field == 'numSubDelegation' ||
            filter.field == 'description' ||
            filter.field == 'numRegister' ||
            filter.field == 'lastOffice' ||
            filter.field == 'level' ||
            filter.field == 'phaseEdo'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getDepartments();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDepartments());
  }

  getDepartments() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.departmentService.getAll(params).subscribe({
      next: response => {
        this.totalItems = response.count;
        this.departments = response.data;
        this.data.load(this.departments);
        //console.log(this.data);
        this.data.refresh();
        //console.log(this.departments);
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(department?: IDepartment) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      department,
      callback: (next: boolean) => {
        if (next) this.getDepartments();
      },
    };
    this.modalService.show(DepartmentFormComponent, modalConfig);
  }

  showDeleteAlert(department: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        let data = {
          id: department.id,
          numDelegation: department.numDelegation,
          numSubDelegation: department.numSubDelegation.id,
          phaseEdo: department.phaseEdo,
        };
        this.delete(data);
      }
    });
  }

  delete(data: any) {
    this.departmentService.remove3(data).subscribe({
      next: () => {
        this.getDepartments(), this.alert('success', 'Departamento', 'Borrado');
      },
    });
  }
}
