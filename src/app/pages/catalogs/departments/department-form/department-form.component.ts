import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IDepartment } from 'src/app/core/models/catalogs/department.model';
import { ISubdelegation } from 'src/app/core/models/catalogs/subdelegation.model';
import { DepartamentService } from 'src/app/core/services/catalogs/departament.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  NUMBERS_PATTERN,
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
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
  delegations = new DefaultSelect();
  subdelegations = new DefaultSelect();
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private departmentService: DepartamentService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    //maximo a 4 caracteres
    this.departmentForm = this.fb.group({
      id: [
        null,
        [
          Validators.required,
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
          Validators.maxLength(4),
        ],
      ],
      numDelegation: [
        null,
        [
          Validators.required,
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
          Validators.maxLength(2),
        ],
      ],
      numSubDelegation: [
        null,
        [
          Validators.required,
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
          Validators.maxLength(2),
        ],
      ],
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
        [Validators.maxLength(10), Validators.pattern(POSITVE_NUMBERS_PATTERN)],
      ],
      numRegister: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      level: [
        null,
        [Validators.maxLength(2), Validators.pattern(POSITVE_NUMBERS_PATTERN)],
      ],
      depend: [
        null,
        [
          Validators.required,
          Validators.maxLength(4),
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
        ],
      ],
      depDelegation: [
        null,
        [
          Validators.required,
          Validators.maxLength(4),
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
        ],
      ],
      phaseEdo: [
        null,
        [Validators.required, Validators.pattern(POSITVE_NUMBERS_PATTERN)],
      ],
    });
    if (this.department != null) {
      this.edit = true;
      this.departmentForm.patchValue(this.department);
      let numSubDelegation = this.department.numSubDelegation as ISubdelegation;
      console.log(this.departmentForm.value);
      this.departmentForm.controls['numSubDelegation'].setValue(
        numSubDelegation.id
      );
      this.getDelegationsId(
        new ListParams(),
        this.departmentForm.controls['numDelegation'].value
      );
      this.getSubdelegations(
        new ListParams(),
        this.departmentForm.controls['numDelegation'].value
      );
    }
    this.getDelegations(new ListParams());
    // this.getSubdelegations(new ListParams);
  }

  getDelegations(params: ListParams) {
    this.departmentService.getDelegationsCatalog(params).subscribe({
      next: data => {
        this.delegations = new DefaultSelect(data.data, data.count);
        console.log(data.data);
      },
    });
  }
  getDelegationsId(params: ListParams, id: any) {
    params['filter.id'] = `$eq:${id}`;
    this.departmentService.getDelegationsCatalog(params).subscribe({
      next: data => {
        this.delegations = new DefaultSelect(data.data, data.count);
        console.log(data.data);
      },
    });
  }
  getSubdelegations(params: ListParams, id?: any) {
    if (id) {
      params['filter.delegationDetail.id'] = `$eq:${id}`;
    }
    this.departmentService.getSubdelegations(params).subscribe({
      next: data => {
        this.subdelegations = new DefaultSelect(data.data, data.count);
        console.log(data.data);
      },
    });
  }
  onSubDelegation(data: any) {
    console.log(data);
    this.getSubdelegations(new ListParams(), data.id);
  }
  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.departmentService.create(this.departmentForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.departmentService.update4(this.departmentForm.value).subscribe({
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
