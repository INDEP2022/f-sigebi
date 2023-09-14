import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IUnitCostDet } from 'src/app/core/models/administrative-processes/unit-cost-det.model';
import { ZoneContractService } from 'src/app/core/services/catalogs/zone-contract.service';
import { ContractService } from 'src/app/core/services/contract/strategy-contract.service';
import { UnitCostDetService } from 'src/app/core/services/unit-cost/unit-cost-det.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-unit-cost-det-form',
  templateUrl: './unit-cost-det-form.component.html',
  styles: [],
})
export class UnitCostDetFormComponent extends BasePage implements OnInit {
  //unitCostDetForm: ModelForm<IUnitCostDet>;
  unitCostDetForm: ModelForm<IUnitCostDet>;
  //unitCostDetForm: FormGroup = new FormGroup({});
  unitCostDet1: any;
  zoneContracts = new DefaultSelect();
  contracts = new DefaultSelect();
  params = new BehaviorSubject<ListParams>(new ListParams());

  title: string = 'Vigencia y Costo';
  edit: boolean = false;

  idCost: string;

  maxDate: Date;
  minDate: Date;

  contract: string;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private zoneContractService: ZoneContractService,
    private unitCostDetService: UnitCostDetService,
    private contractService: ContractService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getZoneContracts(new ListParams());
  }

  private prepareForm() {
    this.unitCostDetForm = this.fb.group({
      costId: [null],
      cveZoneContract: [null],
      startDate: [null, [Validators.required]],
      costUnitarian: [null],
      finalDate: [null],
      porceInflation: [null],
      validity: [null],
      recordNumber: [null],
      contract: [null],
    });
    if (this.unitCostDet1 != null) {
      this.edit = true;
      console.log(this.unitCostDet1);
      this.unitCostDetForm.patchValue(this.unitCostDet1);
      this.unitCostDetForm.controls['costId'].setValue(this.idCost);
      console.log(this.unitCostDet1.cveZoneContract);
      this.getContractFilter(this.unitCostDet1.cveZoneContract);
      this.unitCostDetForm.controls['contract'].setValue(
        this.unitCostDet1.cveZoneContract
      );
      this.unitCostDetForm.controls['validity'].setValue(
        this.unitCostDet1.validity
      );
      console.log(this.unitCostDet1.validity);
      //this.getContractFilter();
      //console.log(this.idCost);
    }
    this.unitCostDetForm.controls['finalDate'].disable();
    this.unitCostDetForm.controls['costId'].setValue(this.idCost);
  }

  close() {
    this.modalRef.hide();
  }

  changeZone(zone: any) {
    console.log(zone.id);
    this.getContractFilter(zone.id);
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  getContractFilter(id?: string) {
    if (id) {
      this.params.getValue()['filter.statusContract'] = 1;
      this.params.getValue()['filter.zoneContractKey'] = id;
    }
    let params = {
      ...this.params.getValue(),
    };
    this.contractService.getAll(params).subscribe({
      next: response => {
        this.contracts = new DefaultSelect(response.data, response.count);
        console.log(response);
      },
      error: err => {
        this.contracts = new DefaultSelect();
      },
    });
  }

  changeContract(event: any) {
    console.log(event.startDate);
    const date = new Date(event.startDate);
    const datePipe = new DatePipe('en-US');
    const formatTrans = datePipe.transform(date, 'yyyy/MM/dd', 'UTC');
    this.unitCostDetForm.controls['startDate'].setValue(formatTrans);
    this.minDate = new Date(formatTrans);
    const date1 = new Date(event.endDate);
    const datePipe1 = new DatePipe('en-US');
    const formatTrans1 = datePipe1.transform(date1, 'yyyy/MM/dd', 'UTC');
    this.unitCostDetForm.controls['finalDate'].setValue(formatTrans1);
    this.maxDate = new Date(formatTrans1);
  }

  create() {
    this.loading = true;
    //console.log(this.idCost);
    let body = {
      costId: Number(this.unitCostDetForm.controls['costId'].value),
      cveZoneContract: this.unitCostDetForm.controls['cveZoneContract'].value,
      startDate: this.unitCostDetForm.controls['startDate'].value,
      finalDate: this.unitCostDetForm.controls['finalDate'].value,
      costUnitarian: this.unitCostDetForm.controls['costUnitarian'].value,
      porceInflation: this.unitCostDetForm.controls['porceInflation'].value,
      validity: this.unitCostDetForm.controls['validity'].value,
    };

    this.unitCostDetService.create1(body).subscribe({
      next: data => {
        console.log(data);
        this.handleSuccess();
      },
      error: error => {
        this.loading = false;
        console.log(error);
      },
    });
  }

  update() {
    this.loading = true;
    console.log(this.unitCostDetForm.controls['validity'].value);
    let body = {
      costId: Number(this.unitCostDetForm.controls['costId'].value),
      cveZoneContract: this.unitCostDetForm.controls['cveZoneContract'].value,
      startDate: this.unitCostDetForm.controls['startDate'].value,
      finalDate: this.unitCostDetForm.controls['finalDate'].value,
      costUnitarian: this.unitCostDetForm.controls['costUnitarian'].value,
      porceInflation: this.unitCostDetForm.controls['porceInflation'].value,
      validity: this.unitCostDetForm.controls['validity'].value,
    };
    this.unitCostDetService.update1(body).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  getZoneContracts(params: ListParams) {
    this.zoneContractService.getAll(params).subscribe({
      next: data => {
        console.log(data);
        this.zoneContracts = new DefaultSelect(data.data, data.count);
      },
      error: err => {
        this.zoneContracts = new DefaultSelect();
        this.loading = false;
      },
    });
  }

  /*handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }*/

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
