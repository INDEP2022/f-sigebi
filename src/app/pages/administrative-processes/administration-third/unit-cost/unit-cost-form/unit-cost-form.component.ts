import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IUnitCost } from 'src/app/core/models/administrative-processes/unit-cost.model';
import { StrategyProcessService } from 'src/app/core/services/ms-strategy/strategy-process.service';
import { StrategyServiceTypeService } from 'src/app/core/services/ms-strategy/strategy-service-type.service';
import { StrategyServiceService } from 'src/app/core/services/ms-strategy/strategy-service.service';
import { StrategyShiftService } from 'src/app/core/services/ms-strategy/strategy-shift.service';
import { StrategyVariableCostService } from 'src/app/core/services/ms-strategy/strategy-variable-cost.service';
import { UnitCostService } from 'src/app/core/services/unit-cost/unit-cost.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-unit-cost-form',
  templateUrl: './unit-cost-form.component.html',
  styles: [],
})
export class UnitCostFormComponent extends BasePage implements OnInit {
  unitCostForm: ModelForm<IUnitCost>;
  unitCost: IUnitCost;
  processes = new DefaultSelect();
  shifts = new DefaultSelect();
  services = new DefaultSelect();
  servicesTypes = new DefaultSelect();
  variablesCosts = new DefaultSelect();

  title: string = 'Clave de Costo';
  edit: boolean = false;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private unitCostService: UnitCostService,
    private serviceService: StrategyServiceService,
    private serviceTypeService: StrategyServiceTypeService,
    private shiftService: StrategyShiftService,
    private processService: StrategyProcessService,
    private varCostService: StrategyVariableCostService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getProcesses(new ListParams());
    this.getServices(new ListParams());
    this.getServicesTypes(new ListParams());
    this.getShifts(new ListParams());
    this.getVarCosts(new ListParams());
  }

  private prepareForm() {
    this.unitCostForm = this.fb.group({
      processNumber: [null],
      serviceNumber: [null],
      serviceTypeNumber: [null],
      shiftNumber: [null],
      varCostNumber: [null],
      strategyDetCostDetail: [null],
      strategyProcess: [null],
      strategyService: [null],
      strategyServicetype: [null],
      strategyShift: [null],
      strategyVariableCost: [null],
      costId: [null],
      nbOrigin: [null],
      registryNumber: [null],
    });
    if (this.unitCost != null) {
      this.edit = true;
      this.unitCostForm.patchValue(this.unitCost);
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
    const data: IUnitCost = this.unitCostForm.value;
    const req: IUnitCost = {
      processNumber: data.processNumber,
      serviceNumber: data.serviceNumber,
      serviceTypeNumber: data.serviceTypeNumber,
      shiftNumber: data.shiftNumber,
      varCostNumber: data.varCostNumber,
      costId: 0,
      registryNumber: 0,
      nbOrigin: '',
      strategyDetCostDetail: undefined,
      strategyProcess: '',
      strategyService: '',
      strategyServicetype: '',
      strategyShift: '',
      strategyVariableCost: '',
    };

    this.unitCostService.create(this.unitCostForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.unitCostService.update(this.unitCost.costId, this.unitCost).subscribe({
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

  getVarCosts(params: ListParams) {
    this.varCostService.getAll(params).subscribe({
      next: data =>
        (this.variablesCosts = new DefaultSelect(data.data, data.count)),
    });
  }

  getProcesses(params: ListParams) {
    this.processService.getAll(params).subscribe({
      next: data => (this.processes = new DefaultSelect(data.data, data.count)),
    });
  }

  getShifts(params: ListParams) {
    this.shiftService.getAll(params).subscribe({
      next: data => (this.shifts = new DefaultSelect(data.data, data.count)),
    });
  }

  getServices(params: ListParams) {
    this.serviceService.getAll(params).subscribe({
      next: data => (this.services = new DefaultSelect(data.data, data.count)),
    });
  }

  getServicesTypes(params: ListParams) {
    this.serviceTypeService.getAll(params).subscribe({
      next: data =>
        (this.servicesTypes = new DefaultSelect(data.data, data.count)),
    });
  }
}
