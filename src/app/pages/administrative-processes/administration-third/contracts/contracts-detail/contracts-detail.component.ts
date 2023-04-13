import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IContract } from 'src/app/core/models/administrative-processes/contract.model';
import { IZoneContract } from 'src/app/core/models/catalogs/zone-contract.model';
import { ZoneContractService } from 'src/app/core/services/catalogs/zone-contract.service';
import { ContractService } from 'src/app/core/services/contract/strategy-contract.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-contracts-detail',
  templateUrl: './contracts-detail.component.html',
  styles: [],
})
export class ContractsDetailComponent extends BasePage implements OnInit {
  contractForm: ModelForm<IContract>;
  contract: IContract;
  zoneContracts = new DefaultSelect();

  title: string = 'Contrato';
  edit: boolean = false;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private contractService: ContractService,
    private zoneContractService: ZoneContractService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getZoneContracts(new ListParams());
  }

  private prepareForm() {
    this.contractForm = this.fb.group({
      id: [null, []],
      description: [null, [Validators.pattern(STRING_PATTERN)]],
      contractKey: [null],
      endDate: [null],
      registerNumber: [null],
      startDate: [null],
      statusContract: [null],
      vigContract: [false],
      zone: [null],
      zoneContractKey: [null],
    });
    if (this.contract != null) {
      this.edit = true;
      this.contractForm.patchValue(this.contract);
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.contractService.create(this.contractForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    const req: IContract = {
      contractKey: this.contractForm.value.contractKey,
      endDate: this.contractForm.value.endDate,
      zoneContractKey: this.contractForm.value.zoneContractKey,
      startDate: this.contractForm.value.startDate,
    };

    this.contractService.update(this.contract.id, req).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  onValuesChange(zoneContractChange: IZoneContract) {
    if (this.contract) {
      this.contract.zoneContractKey = zoneContractChange.id;
    }
  }

  getZoneContracts(params: ListParams) {
    this.zoneContractService.getAll(params).subscribe({
      next: data =>
        (this.zoneContracts = new DefaultSelect(data.data, data.count)),
    });
  }
}
