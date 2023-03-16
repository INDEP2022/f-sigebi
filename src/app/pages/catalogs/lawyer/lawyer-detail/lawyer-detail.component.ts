import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { OfficeService } from 'src/app/core/services/catalogs/office.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ILawyer } from '../../../../core/models/catalogs/lawyer.model';
import { DelegationService } from '../../../../core/services/catalogs/delegation.service';
import { LawyerService } from '../../../../core/services/catalogs/lawyer.service';
import {
  NUMBERS_PATTERN,
  PHONE_PATTERN,
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
  delegations = new DefaultSelect<ILawyer>();
  offices = new DefaultSelect<ILawyer>();

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
        [
          Validators.pattern(NUMBERS_PATTERN),
          Validators.required,
          Validators.maxLength(10),
        ],
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
      rfc: [null, [Validators.required, Validators.maxLength(20)]],
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
    if (this.edit) {
      this.status = 'Actualizar';
      const { idOffice, delegation } = this.lawyer;
      this.form.patchValue(this.lawyer);
      this.form.get('idOffice').setValue(idOffice.id);
      this.offices = new DefaultSelect([idOffice], 1);
      this.delegations = new DefaultSelect([delegation], 1);
    }
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  close() {
    this.modalRef.hide();
  }

  create() {
    this.loading = true;
    this.lawerService.create(this.form.value).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false)
    );
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', 'ABOGADO', `${message} Correctamente`);
    this.loading = false;
    this.refresh.emit(true);
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
    this.delegationService.getAll(params).subscribe(data => {
      this.delegations = new DefaultSelect(data.data, data.count);
    });
  }

  getOffices(params: ListParams) {
    this.officeService.getAll(params).subscribe(data => {
      console.log(data);
      this.offices = new DefaultSelect(data.data, 1);
    });
  }
}
