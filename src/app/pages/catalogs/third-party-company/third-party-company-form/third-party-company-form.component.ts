import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IThirdPartyCompany } from 'src/app/core/models/catalogs/third-party-company.model';
import { ThirdPartyService } from 'src/app/core/services/catalogs/third-party-company.service';
import { ZoneContractService } from 'src/app/core/services/catalogs/zone-contract.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-third-party-company-form',
  templateUrl: './third-party-company-form.component.html',
  styles: [],
})
export class ThirdPartyCompanyFormComponent extends BasePage implements OnInit {
  thirdPartyCompanyForm: ModelForm<IThirdPartyCompany>;
  title = 'Empresa de Terceros';
  edit = false;
  thirdParty: any;
  itemsZoneContract = new DefaultSelect();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private thirdPartyCompanyService: ThirdPartyService,
    private zoneContractService: ZoneContractService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.thirdPartyCompanyForm = this.fb.group({
      id: [null],
      keyCompany: [
        null,
        [
          Validators.required,
          Validators.pattern(KEYGENERATION_PATTERN),
          Validators.maxLength(10),
        ],
      ],
      description: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(80),
        ],
      ],
      keyZoneContract: [null, Validators.required],
    });

    if (this.thirdParty != null) {
      this.edit = true;
      this.thirdPartyCompanyForm.patchValue(this.thirdParty);
      this.thirdPartyCompanyForm.controls['keyZoneContract'].setValue(
        this.thirdParty.keyZoneContract.id
      );
    }
    this.getZoneContract(new ListParams());
  }

  close(): void {
    this.modalRef.hide();
  }

  confirm(): void {
    this.edit ? this.update() : this.create();
  }

  create(): void {
    if (
      this.thirdPartyCompanyForm.controls['description'].value.trim() === '' ||
      this.thirdPartyCompanyForm.controls['keyCompany'].value.trim() === ''
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      return; // Retorna temprano si el campo está vacío.
    }
    this.loading = true;
    this.thirdPartyCompanyService
      .create(this.thirdPartyCompanyForm.value)
      .subscribe({
        next: () => this.handleSuccess(),
        error: () => (this.loading = false),
      });
  }

  update(): void {
    this.loading = true;
    this.thirdPartyCompanyService
      .updateThirdPartyCompany(
        this.thirdParty.id,
        this.thirdPartyCompanyForm.value
      )
      .subscribe({
        next: () => this.handleSuccess(),
        error: () => (this.loading = false),
      });
  }
  getZoneContract(params: ListParams, id?: string) {
    if (id) {
      params['filter.id'] = `$eq:${id}`;
    }
    this.zoneContractService.getAll(params).subscribe((data: any) => {
      this.itemsZoneContract = new DefaultSelect(data.data, data.count);
    });
  }

  handleSuccess(): void {
    const message = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
