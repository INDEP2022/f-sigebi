import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IUnitCostDet } from 'src/app/core/models/administrative-processes/unit-cost-det.model';
import { ZoneContractService } from 'src/app/core/services/catalogs/zone-contract.service';
import { UnitCostDetService } from 'src/app/core/services/unit-cost/unit-cost-det.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-unit-cost-det-form',
  templateUrl: './unit-cost-det-form.component.html',
  styles: [],
})
export class UnitCostDetFormComponent extends BasePage implements OnInit {
  unitCostDetForm: ModelForm<IUnitCostDet>;
  unitCostDet: IUnitCostDet;
  zoneContracts = new DefaultSelect();

  title: string = 'Vigencia y Costo';
  edit: boolean = false;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private zoneContractService: ZoneContractService,
    private unitCostDetService: UnitCostDetService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getZoneContracts(new ListParams());
  }

  private prepareForm() {
    this.unitCostDetForm = this.fb.group({
      costId: [null, []],
      cveZoneContract: [null, []],
      startDate: [null, []],
      costUnitarian: [null, []],
      finalDate: [null, []],
      porceInflation: [null, []],
      validity: [null, []],
    });
    if (this.unitCostDet != null) {
      this.edit = true;
      this.unitCostDetForm.patchValue(this.unitCostDet);
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
    this.unitCostDetService.create(this.unitCostDetForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.unitCostDetService
      .update(this.unitCostDet.costId, this.unitCostDet)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  getZoneContracts(params: ListParams) {
    this.zoneContractService.getAll(params).subscribe({
      next: data =>
        (this.zoneContracts = new DefaultSelect(data.data, data.count)),
    });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
