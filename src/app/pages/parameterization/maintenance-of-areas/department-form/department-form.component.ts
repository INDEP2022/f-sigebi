import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { IDepartment } from 'src/app/core/models/catalogs/department.model';
import { ISubdelegation } from 'src/app/core/models/catalogs/subdelegation.model';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { DepartamentService } from 'src/app/core/services/catalogs/departament.service';
import { PrintFlyersService } from 'src/app/core/services/document-reception/print-flyers.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-department-form',
  templateUrl: './department-form.component.html',
  styles: [],
})
export class DepartmentFormComponent extends BasePage implements OnInit {
  departmentForm: ModelForm<IDepartment>;
  department: IDepartment;
  title: string = 'Departamento';
  edit: boolean = false;

  idDelegation: IDelegation;
  idSubDelegation: ISubdelegation;

  delegations = new DefaultSelect<IDelegation>();
  subdelegations = new DefaultSelect<ISubdelegation>();

  phaseEdo: number;

  get delegation() {
    return this.departmentForm.get('numDelegation');
  }
  get subdelegation() {
    return this.departmentForm.get('numSubDelegation');
  }

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private departmentService: DepartamentService,
    private serviceDeleg: DelegationService,
    private printFlyersService: PrintFlyersService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.departmentForm = this.fb.group({
      id: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      numDelegation: [null, []],
      numSubDelegation: [null, []],
      dsarea: [
        null,
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      description: [
        null,
        [
          Validators.required,
          Validators.maxLength(200),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      lastOffice: [
        null,
        [Validators.maxLength(10), Validators.pattern(NUMBERS_PATTERN)],
      ],
      numRegister: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      level: [
        null,
        [Validators.maxLength(2), Validators.pattern(NUMBERS_PATTERN)],
      ],
      depend: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      depDelegation: [
        null,
        [
          Validators.required,
          Validators.maxLength(4),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      phaseEdo: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
    });
    if (this.department != null) {
      this.edit = true;
      this.departmentForm.patchValue(this.department);
      this.idDelegation = this.department
        .numDelegation as unknown as IDelegation;
      this.idSubDelegation = this.department
        .numSubDelegation as unknown as ISubdelegation;
      this.departmentForm.controls['numDelegation'].setValue(this.idDelegation);
      this.departmentForm.controls['numSubDelegation'].setValue(
        this.idSubDelegation.id
      );
    }
  }

  getDelegations(params: ListParams) {
    this.serviceDeleg.getAll(params).subscribe(
      data => {
        this.delegations = new DefaultSelect(data.data, data.count);
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

  onDelegationsChange(element: any) {
    this.resetFields([this.delegation]);
    this.subdelegations = new DefaultSelect();
    // console.log(this.PN_NODELEGACION.value);
    if (this.delegation.value)
      this.getSubDelegations({ page: 1, limit: 10, text: '' });
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

        this.onLoadToast('error', 'Error', error);
      },
    });
  }

  onSubDelegationsChange(element: any) {
    this.resetFields([this.subdelegation]);
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      field = null;
    });
    this.departmentForm.updateValueAndValidity();
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  update() {
    this.loading = true;
    this.departmentService.update2(this.departmentForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  create() {
    this.loading = true;
    this.departmentService.create(this.departmentForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
