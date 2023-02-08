import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IDepartment } from 'src/app/core/models/catalogs/department.model';
import { DepartamentService } from 'src/app/core/services/catalogs/departament.service';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
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

  constructor(
    private departmentService: DepartamentService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = DEPARTMENT_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDepartments());
  }

  getDepartments() {
    this.loading = true;
    this.departmentService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.departments = response.data;
        this.totalItems = response.count;
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

  showDeleteAlert(department: IDepartment) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(department.id);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: number) {
    this.departmentService.remove(id).subscribe({
      next: () => this.getDepartments(),
    });
  }
}
