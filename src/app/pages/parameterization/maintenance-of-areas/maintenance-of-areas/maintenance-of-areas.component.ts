import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { IDepartment } from 'src/app/core/models/catalogs/department.model';
import { ISubdelegation } from 'src/app/core/models/catalogs/subdelegation.model';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { DepartamentService } from 'src/app/core/services/catalogs/departament.service';
import { PrintFlyersService } from 'src/app/core/services/document-reception/print-flyers.service';
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
  departments: IDepartment[] = [];

  delegations = new DefaultSelect<IDelegation>();
  subdelegations = new DefaultSelect<ISubdelegation>();

  phaseEdo: number;

  get delegation() {
    return this.form.get('delegation');
  }
  get subdelegation() {
    return this.form.get('subdelegation');
  }

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  form: FormGroup = new FormGroup({});
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  delegationId: string;
  subdelegationId: string;
  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private departmentService: DepartamentService,
    private service: DelegationService,
    private serviceDeleg: DelegationService,
    private printFlyersService: PrintFlyersService
  ) {
    super();
    // this.settings = {
    //   ...this.settings,
    //   actions: {
    //     hideSubHeader: false,
    //     columnTitle: 'Acciones',
    //     /* edit: true, */
    //     delete: true,
    //     position: 'right',
    //   },
    //   columns: { ...COLUMNS },
    // };
    this.settings.columns = COLUMNS;
    this.settings.actions.delete = true;
    this.settings.actions.add = false;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            console.log(filter);
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              console.log(
                (this.columnFilters[field] = `${searchFilter}:${filter.search}`)
              );
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getDepartmentByIds();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDepartmentByIds());
  }

  private prepareForm() {
    this.form = this.fb.group({
      delegation: [null, [Validators.required]],
      subdelegation: [null, [Validators.required]],
    });
  }

  getDelegations(params: ListParams) {
    this.serviceDeleg.getAll(params).subscribe(
      {
        next: data => {
          this.delegations = new DefaultSelect(data.data, data.count);
        },
        error: err => {
          let error = '';
          if (err.status === 0) {
            error = 'Revise su conexión de Internet.';
          } else {
            error = err.message;
          }
          this.onLoadToast('error', 'Error', error);
        },
      }

      //() => {}
    );
  }

  onDelegationsChange(element: any) {
    console.log(element.id);
    this.delegationId = element.id;
    this.resetFields([this.delegation]);
    this.subdelegations = new DefaultSelect([], 0, true);
    this.form.controls['subdelegation'].setValue('');
    // console.log(this.PN_NODELEGACION.value);
    if (this.delegation.value) {
      this.getSubDelegations({ page: 1, limit: 10, text: '' });
    } else {
      this.data = new LocalDataSource();
      this.data.refresh();
    }
  }

  getSubDelegations(lparams: ListParams) {
    // console.log(lparams);
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    if (lparams?.text.length > 0)
      params.addFilter('dsarea', lparams.text, SearchFilter.LIKE);
    if (this.delegation.value) {
      params.addFilter('delegationNumber', this.delegation.value);
    }
    if (this.phaseEdo) params.addFilter('phaseEdo', this.phaseEdo);
    // console.log(params.getParams());
    this.printFlyersService.getSubdelegations(params.getParams()).subscribe({
      next: data => {
        this.subdelegations = new DefaultSelect(data.data, data.count);
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }

        this.alert('error', 'No esta registrada ninguna Subdelegación', '');
      },
    });
  }

  onSubDelegationsChange(element: any) {
    console.log(element.id);
    this.subdelegationId = element.id;
    this.resetFields([this.subdelegation]);
    this.getDepartmentByIds();
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDepartmentByIds());
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      field = null;
    });
    this.form.updateValueAndValidity();
  }

  getDepartmentByIds() {
    this.departments = [];
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.departmentService
      .getByDelegationsSubdelegation2(
        this.delegation.value,
        this.subdelegation.value,
        params
      )
      .subscribe({
        next: response => {
          console.log(response);
          this.departments = response.data;
          this.data.load(response.data);
          this.data.refresh();
          this.totalItems = response.count | 0;
          this.loading = false;
        },
        error: error => (this.loading = false),
      });
    /*this.departmentService
      .getAll(params)
      .subscribe({
        next: response => {
          console.log(response);
          this.departments = response.data;
          this.data.load(response.data);
          this.data.refresh();
          this.totalItems = response.count | 0;
          this.loading = false;
        },
        error: error => (this.loading = false),
      });*/
  }

  openForm(department?: IDepartment) {
    /*const idDelegation = { ...this.delegation.value };
    const idSubDelegation = { ...this.subdelegation.value };*/

    const idDelegation = this.delegationId;
    const idSubDelegation = this.subdelegationId;
    console.log(this.delegationId, this.subdelegationId);
    const modalConfig = MODAL_CONFIG;
    /*const modalConfig = {
      idDelegation,
      idSubDelegation,
      initialState: {},
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };*/
    modalConfig.initialState = {
      department,
      idDelegation,
      idSubDelegation,
      callback: (next: boolean) => {
        if (next) this.getDepartmentByIds();
      },
    };
    this.modalService.show(DepartmentFormComponent, modalConfig);
  }

  delete(departament: IDepartment) {
    let numSubDelegation = departament.numSubDelegation as ISubdelegation;
    let obj = {
      id: departament.id,
      numDelegation: departament.numDelegation,
      numSubDelegation: numSubDelegation.id,
      phaseEdo: departament.phaseEdo,
    };
    this.departmentService.removeByBody(obj).subscribe({
      next: () => {
        this.getDepartmentByIds();
        this.alert(
          'success',
          'Mantenimiento de Areas',
          'Borrado Correctamente'
        );
      },
      error: error => {
        this.alert(
          'warning',
          'Mantenimiento de Areas',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }

  showDeleteAlert(department: IDepartment) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea Eliminar este Registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(department);
      }
    });
  }
}
