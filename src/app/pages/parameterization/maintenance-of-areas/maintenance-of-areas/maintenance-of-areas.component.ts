import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { IDepartment } from 'src/app/core/models/catalogs/department.model';
import { ISubdelegation } from 'src/app/core/models/catalogs/subdelegation.model';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { DepartamentService } from 'src/app/core/services/catalogs/departament.service';
import { SubdelegationService } from 'src/app/core/services/catalogs/subdelegation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { DepartmentFormComponent } from '../department-form/department-form.component';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-maintenance-of-areas',
  templateUrl: './maintenance-of-areas.component.html',
  styles: [],
})
export class MaintenanceOfAreasComponent extends BasePage implements OnInit {
  delegation: IDelegation;
  subDelegation: ISubdelegation;
  departments: IDepartment[] = [];
  subdelegations = new DefaultSelect<ISubdelegation>();
  delegations = new DefaultSelect<IDelegation>();

  columns: any[] = [];
  totalItems: number = 0;

  params = new BehaviorSubject<ListParams>(new ListParams());
  form: FormGroup = new FormGroup({});
  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private departmentService: DepartamentService,
    private service: DelegationService,
    private serviceSubDeleg: SubdelegationService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        /* edit: true, */
        delete: true,
        position: 'right',
      },
      columns: { ...COLUMNS },
    };
  }

  ngOnInit(): void {
    this.buildForm();
    this.getPagination();
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */
  private buildForm() {
    this.form = this.fb.group({
      delegation: [null, [Validators.required]],
      subdelegation: [null, [Validators.required]],
    });
  }
  openForm(department?: IDepartment) {
    const modalConfig = {
      initialState: {},
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    modalConfig.initialState = {
      department,
      callback: (next: boolean) => {
        if (next) this.getDepartment();
      },
    };
    this.modalService.show(DepartmentFormComponent, modalConfig);
  }

  getDepartment() {
    this.departments = [];
    this.loading = true;
    this.departmentService
      .getByDelegationsSubdelegation(this.delegation.id, this.subDelegation.id)
      .subscribe({
        next: response => {
          console.log(response);
          this.departments = response.data;
          this.totalItems = response.count;
          this.loading = false;
          this.getPagination();
        },
        error: error => (this.loading = false),
      });
  }

  delete(departament: IDepartment) {
    let obj = {
      id: departament.id,
      numDelegation: departament.numDelegation,
      numSubDelegation: departament.numSubDelegation,
      phaseEdo: departament.phaseEdo,
    };
    this.departmentService.removeByBody(obj).subscribe({
      next: () => {
        this.getDepartment();
        this.alert('success', '', 'Borrado');
      },
    });
  }

  getPagination() {
    this.columns = this.departments;
    this.totalItems = this.columns.length;
  }

  onDelegationChange(delegation: any) {
    this.delegation = delegation;
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDepartment());
  }

  onSubDelegationChange(subdelegation: any) {
    this.subDelegation = subdelegation;
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDepartment());
  }

  showDeleteAlert(department: IDepartment) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(department);
      }
    });
  }
}
