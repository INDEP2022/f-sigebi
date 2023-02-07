import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IDepartment } from 'src/app/core/models/catalogs/department.model';
import { DepartamentService } from 'src/app/core/services/catalogs/departament.service';
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
    this.departmentForm = this.fb.group({
      id: [null, [Validators.required, Validators.pattern(NUMBERS_PATTERN)]],
      numDelegation: [null, [Validators.required]],
      numSubDelegation: [null, [Validators.required]],
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
      numRegister: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
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
      phaseEdo: [null, [Validators.required]],
    });
    if (this.department != null) {
      this.edit = true;
      this.departmentForm.patchValue(this.department);
    }
  }

  getDelegations(params: ListParams) {
    this.departmentService.getDelegations(params).subscribe({
      next: data =>
        (this.delegations = new DefaultSelect(data.data, data.count)),
    });
  }

  getSubdelegations(params: ListParams) {
    this.departmentService.getSubdelegations(params).subscribe({
      next: data =>
        (this.subdelegations = new DefaultSelect(data.data, data.count)),
    });
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
    this.departmentService
      .update(this.department.id, this.departmentForm.value)
      .subscribe({
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
