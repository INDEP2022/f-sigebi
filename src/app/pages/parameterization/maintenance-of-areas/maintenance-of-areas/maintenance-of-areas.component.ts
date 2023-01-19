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
import { MaintenanceOfAreasModalComponent } from '../maintenance-of-areas-modal/maintenance-of-areas-modal.component';
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
        edit: true,
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
  openForm(allotment?: any) {
    this.openModal({ allotment });
  }

  openModal(context?: Partial<MaintenanceOfAreasModalComponent>) {
    const modalRef = this.modalService.show(MaintenanceOfAreasModalComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      /* if (next) this.getDepartment(); */
    });
  }

  getDepartment(idDelegation: number, idSubDelegation: number) {
    this.departments = [];
    this.loading = true;
    this.departmentService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.totalItems = response.count;
        this.loading = false;
        this.departments = response.data.filter(
          element =>
            element.numDelegation === idDelegation ||
            element.numSubDelegation === idSubDelegation
        );
      },
      error: error => (this.loading = false),
    });
  }

  delete(id: number) {
    this.departmentService.remove(id).subscribe({
      /* next: () => this.getDepartment(), */
    });
  }

  /*   getData() {
    this.loading = true;
    this.columns = this.data;
    this.totalItems = this.data.length;
    this.loading = false;
  } */

  getPagination() {
    this.columns = this.departments;
    this.totalItems = this.columns.length;
  }

  onDelegationsChange() {
    //console.log('Este es el valor', this.form.get('delegation').value);
    /* this.delegation = delegation;
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDepartment()); */
  }

  onSubDelegationChange() {
    console.log('Este es el valor', this.form.get('subdelegation').value);
    /* this.subDelegation = subDelegation; */
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() =>
        this.getDepartment(
          this.form.get('delegation').value,
          this.form.get('subdelegation').value
        )
      );
  }
}
