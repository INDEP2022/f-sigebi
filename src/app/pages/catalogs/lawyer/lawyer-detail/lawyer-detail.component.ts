import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ILawyer } from '../../../../core/models/catalogs/lawyer.model';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DelegationService } from '../../../../core/services/catalogs/delegation.service';
import { OfficeService } from 'src/app/core/services/catalogs/office.service';
import { LawyerService } from '../../../../core/services/catalogs/lawyer.service';

@Component({
  selector: 'app-lawyer-detail',
  templateUrl: './lawyer-detail.component.html',
  styles: [],
})
export class LawyerDetailComponent implements OnInit {
  loading: boolean = false;
  status: string = 'Nuevo';
  edit: boolean = false;
  form: FormGroup = new FormGroup({});
  lawyer: any;
  delegations = new DefaultSelect<ILawyer>();
  offices = new DefaultSelect<ILawyer>();

  public get id() {
    return this.form.get('id');
  }

  @Output() refresh = new EventEmitter<true>();
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private lawerService: LawyerService,
    private delegationService: DelegationService,
    private officeService: OfficeService
  ) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm(): void {
    this.form = this.fb.group({
      id: [null],
      idOffice: [null],
      name: [
        '',
        Validators.compose([
          Validators.pattern(''),
          Validators.required,
          Validators.maxLength(80),
        ]),
      ],
      street: [
        null,
        Validators.compose([
          Validators.pattern(''),
          Validators.required,
          Validators.maxLength(60),
        ]),
      ],
      streetNumber: [
        null,
        Validators.compose([
          Validators.pattern(''),
          Validators.required,
          Validators.maxLength(10),
        ]),
      ],
      apartmentNumber: [
        null,
        Validators.compose([
          Validators.pattern(''),
          Validators.required,
          Validators.maxLength(10),
        ]),
      ],
      suburb: [
        null,
        Validators.compose([
          Validators.pattern(''),
          Validators.required,
          Validators.maxLength(100),
        ]),
      ],
      delegation: [
        1,
        Validators.compose([
          Validators.pattern(''),
          Validators.required,
          Validators.maxLength(60),
        ]),
      ],
      zipCode: [
        null,
        Validators.compose([Validators.pattern(''), Validators.required]),
      ],
      rfc: [
        null,
        Validators.compose([
          Validators.pattern(''),
          Validators.required,
          Validators.maxLength(20),
        ]),
      ],
      phone: [
        null,
        Validators.compose([
          Validators.pattern(''),
          Validators.required,
          Validators.maxLength(20),
        ]),
      ],
      registerNumber: [
        4,
        Validators.compose([Validators.pattern(''), Validators.required]),
      ],
    });
    if (this.edit) {
      this.status = 'Actualizar';
      const { idOffice, delegation } = this.lawyer;
      this.form.patchValue(this.lawyer);
      this.id.disable();
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
    this.loading = false;
    this.refresh.emit(true);
    this.modalRef.hide();
  }

  //TODO: corregir update with updateByIds
  update() {
    this.loading = true;

    const dataToUpdate: any = {
      id: parseInt(this.lawyer.id),
      idOffice: this.lawyer.idOffice.id,
      apartmentNumber: parseInt(this.lawyer.apartmentNumber),
      delegation: this.lawyer.delegation,
      name: this.lawyer.name,
      phone: this.lawyer.phone,
      registerNumber: parseInt(this.lawyer.registerNumber),
      rfc: this.lawyer.rfc,
      street: this.lawyer.street,
      streetNumber: this.lawyer.streetNumber,
      zipCode: parseInt(this.lawyer.zipCode),
      suburb: this.lawyer.suburb,
    };

    this.lawerService.update(dataToUpdate.id, dataToUpdate).subscribe(
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
