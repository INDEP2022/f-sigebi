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
  delegacionId: any;
  phaseEdo: any;
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
        [
          Validators.required,
          Validators.maxLength(1),
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
        ],
      ],
    });
    if (this.department != null) {
      this.edit = true;

      this.departmentForm.patchValue(this.department);
      let numSubDelegation = this.department.numSubDelegation as ISubdelegation;
      console.log('consola 1', this.departmentForm.value);
      this.departmentForm.controls['numSubDelegation'].setValue(
        numSubDelegation.id
      );
      this.delegacionId = this.department.numDelegation;
      this.getDelegationsId(
        new ListParams(),
        this.departmentForm.controls['numDelegation'].value
      );
      this.getSubdelegations(new ListParams());
      this.departmentForm.controls['dsarea'].disable();
      this.departmentForm.controls['numDelegation'].disable();
      this.departmentForm.controls['numSubDelegation'].disable();
      this.departmentForm.controls['id'].disable();
      this.departmentForm.controls['phaseEdo'].disable();
    }
    this.departmentForm.controls['phaseEdo'].disable();
    setTimeout(() => {
      this.getDelegations(new ListParams());
    }, 1000);

    // this.getSubdelegations(new ListParams);
  }

  getDelegations(params: ListParams) {
    this.departmentService.getDelegationsCatalog(params).subscribe({
      next: data => {
        this.delegations = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.delegations = new DefaultSelect();
        this.loading = false;
      },
    });
  }

  getDelegationsId(params: ListParams, id: any) {
    params['filter.id'] = `$eq:${id}`;
    this.departmentService.getDelegationsCatalog(params).subscribe({
      next: data => {
        this.delegations = new DefaultSelect(data.data, data.count);
        console.log('consola 3', data.data);
      },
      error: () => {
        this.delegations = new DefaultSelect();
        this.loading = false;
      },
    });
  }
  getSubdelegations(params: ListParams) {
    if (this.delegacionId) {
      params['filter.delegationDetail.id'] = `$eq:${this.delegacionId}`;
    }
    this.departmentService.getSubdelegations(params).subscribe({
      next: data => {
        this.subdelegations = new DefaultSelect(data.data, data.count);
        console.log('consola 5', data.data);
      },
      error: error => {
        console.log(error);
        this.subdelegations = new DefaultSelect();
      },
    });
  }
  onSubDelegation(data: any) {
    console.log(data);

    if (data === null || data === undefined) {
      this.departmentForm.controls['numSubDelegation'].setValue(null);
    } else {
      this.delegacionId = data.id;
      const params = new ListParams();
      params['filter.delegationDetail.id'] = `$eq:${this.delegacionId}`;
      this.departmentService.getSubdelegations(params).subscribe({
        next: resp => {
          console.log(resp.data);
          this.subdelegations = new DefaultSelect(resp.data, resp.count);
          //this.departmentForm.controls['phaseEdo'].setValue(this.subdelegations[0].phaseEdo);
          //console.log(this.phaseEdo);
        },
        error: error => {
          console.log(error);
          this.subdelegations = new DefaultSelect();
        },
      });
    }

    /*for (const controlName in this.departmentForm.controls) {
      if (this.departmentForm.controls.hasOwnProperty(controlName)) {
        if (controlName != 'numDelegation') {
          this.departmentForm.controls['numSubDelegation'].setValue(null);
        }
      }
    }*/
    //console.log('consola 4', data);
    //this.getSubdelegations(new ListParams(), data.id);
  }

  onPhaseEdo(data: any) {
    console.log(data.phaseEdo);
    this.departmentForm.controls['phaseEdo'].setValue(data.phaseEdo);
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    if (
      this.departmentForm.controls['dsarea'].value.trim() == '' ||
      this.departmentForm.controls['description'].value.trim() == '' ||
      (this.departmentForm.controls['dsarea'].value.trim() == '' &&
        this.departmentForm.controls['description'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      this.departmentService
        .create(this.departmentForm.getRawValue())
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => (this.loading = false),
        });
    }
  }

  update() {
    if (
      this.departmentForm.controls['dsarea'].value.trim() == '' ||
      this.departmentForm.controls['description'].value.trim() == '' ||
      (this.departmentForm.controls['dsarea'].value.trim() == '' &&
        this.departmentForm.controls['description'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      this.departmentService
        .update4(this.departmentForm.getRawValue())
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => (this.loading = false),
        });
    }
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', this.title, `${message} Correctamente`);
    //this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
