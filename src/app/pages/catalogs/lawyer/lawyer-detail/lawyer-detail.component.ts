import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { OfficeService } from 'src/app/core/services/catalogs/office.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { DelegationService } from '../../../../core/services/catalogs/delegation.service';
import { LawyerService } from '../../../../core/services/catalogs/lawyer.service';
import {
  NUMBERS_PATTERN,
  PHONE_PATTERN,
  RFC_PATTERN,
  STRING_PATTERN,
} from '../../../../core/shared/patterns';

@Component({
  selector: 'app-lawyer-detail',
  templateUrl: './lawyer-detail.component.html',
  styles: [],
})
export class LawyerDetailComponent extends BasePage implements OnInit {
  status: string = 'Nuevo';
  edit: boolean = false;
  form: FormGroup = new FormGroup({});
  lawyer: any;
  delegations = new DefaultSelect();
  offices = new DefaultSelect();
  title: string = 'Abogado';
  @Output() refresh = new EventEmitter<true>();
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private lawerService: LawyerService,
    private delegationService: DelegationService,
    private officeService: OfficeService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm(): void {
    this.form = this.fb.group({
      id: [null],
      idOffice: [null],
      name: [
        '',
        [
          Validators.pattern(STRING_PATTERN),
          Validators.required,
          Validators.maxLength(80),
        ],
      ],
      street: [
        null,
        [
          Validators.pattern(STRING_PATTERN),
          Validators.required,
          Validators.maxLength(60),
        ],
      ],
      streetNumber: [
        null,
        [
          Validators.pattern(NUMBERS_PATTERN),
          Validators.required,
          Validators.maxLength(10),
        ],
      ],
      apartmentNumber: [
        null,
        [Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(10)],
      ],
      suburb: [
        null,
        [
          Validators.pattern(''),
          Validators.required,
          Validators.maxLength(100),
        ],
      ],
      delegation: [
        1,
        [Validators.pattern(''), Validators.required, Validators.maxLength(60)],
      ],
      zipCode: [null, [Validators.pattern(''), Validators.required]],
      rfc: [
        null,
        [
          Validators.pattern(RFC_PATTERN),
          Validators.required,
          Validators.maxLength(20),
        ],
      ],
      phone: [
        null,
        [
          Validators.pattern(PHONE_PATTERN),
          Validators.required,
          Validators.maxLength(20),
        ],
      ],
      registerNumber: [null],
    });
    if (this.lawyer != null) {
      this.edit = true;
      this.form.patchValue(this.lawyer);
      console.log(this.lawyer);
      console.log(this.lawyer.delegation);
      console.log(this.lawyer.idOffice);
      //this.form.controls['delegation'].setValue(this.lawyer.delegation);
      //this.form.controls['idOffice'].setValue(this.lawyer.idOffice);
      this.getFromSelect(new ListParams());
      this.getOffices(new ListParams());
    }
    setTimeout(() => {
      this.getFromSelect(new ListParams());
      this.getOffices(new ListParams());
    }, 1000);
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  close() {
    this.modalRef.hide();
  }

  create() {
    this.loading = true;
    this.lawerService.create(this.form.getRawValue()).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', this.title, `${message} Correctamente`);
    //this.onLoadToast('success', 'Abogado', `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  //TODO: corregir update with updateByIds
  update() {
    this.loading = true;
    this.lawerService.update(this.lawyer.id, this.form.value).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false)
    );
  }

  getFromSelect(params: ListParams) {
    /*params[
      'filter.id'
    ] = `$eq:${this.form.controls['idOffice'].value}`;*/

    this.delegationService.getAll(params).subscribe({
      next: data => {
        this.delegations = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        console.log(error);
        this.delegations = new DefaultSelect();
        this.loading = false;
      },
    });
  }

  getOffices(params: ListParams) {
    params[
      'filter.delegationDetail.id'
    ] = `$eq:${this.form.controls['idOffice'].value}`;

    this.officeService.getAll(params).subscribe({
      next: data => {
        console.log(data);
        this.offices = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        console.log(error);
        this.offices = new DefaultSelect();
        this.loading = false;
      },
    });
  }

  getFilterDelegations(params?: ListParams) {
    params[
      'filter.aprovedUser'
    ] = `$eq:${this.form.controls['aprovedUser'].value}`;
    console.log(this.form.controls['aprovedUser'].value);
    this.delegationService.getAll(params).subscribe({
      next: resp => {
        console.log(resp);
        this.delegations = new DefaultSelect(resp.data, resp.count);
      },
      error: error => {
        console.log(error);
        this.delegations = new DefaultSelect();
      },
    });
  }
}
