import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ServiceFormatService } from '../service-orders-format/services';

@Component({
  selector: 'app-add-update-control-order',
  templateUrl: './add-update-control-order.component.html',
  styles: [],
})
export class AddUpdateControlOrderComponent extends BasePage implements OnInit {
  form: FormGroup;
  edit: boolean = false;
  numberFormat: number | string;
  processNumber: number | string;
  typeStrategy: string;
  data: any;
  public strategyService = new DefaultSelect();
  public typeServiceNumber = new DefaultSelect();
  public turnNumber = new DefaultSelect();
  public varCostNumber = new DefaultSelect();
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private serviceFormatService: ServiceFormatService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  prepareForm() {
    this.form = this.fb.group({
      formatNumberId: this.numberFormat,
      costId: [null, Validators.required],
      processNumber: this.processNumber,
      serviceNumber: [null, Validators.required],
      typeServiceNumber: [null, Validators.required],
      turnNumber: [null, Validators.required],
      varCostNumber: [null, Validators.required],
      observation: [],
      totQuantity: [],
      totAmount: [],
      captureDate: [],
      recordNumber: [],
      nbOrigin: [''],
    });

    if (this.data) {
      this.getStrategyTypeService(new ListParams());
      this.getTurnNumber(new ListParams());
      this.getVarCostNumber(new ListParams());
      this.edit = true;
      console.log(this.data);
      this.data.nbOrigin = this.data.nbOrigin == null ? '' : this.data.nbOrigin;
      this.form.patchValue(this.data);
    } else {
      this.form.get('typeServiceNumber').disable();
      this.form.get('turnNumber').disable();
      this.form.get('varCostNumber').disable();
    }
  }

  async confirm() {
    const data = this.edit
      ? await this.serviceFormatService.updateStrategyImport(this.form.value)
      : await this.serviceFormatService.createStrategyImport(this.form.value);
    if (data == 200) {
      if (this.edit)
        this.alert('success', 'Registro actualizado correctamente', '');
      else this.alert('success', 'Registro guardado correctamente', '');
      this.modalRef.content.callback(true);
      this.close();
    } else {
      if (this.edit)
        this.alert(
          'warning',
          'No se pudo actualizar el registro',
          'Verifique e intente nuevamente'
        );
      else
        this.alert(
          'warning',
          'No se pudo guardar el registro',
          'Verifique e intente nuevamente'
        );
    }
  }
  close() {
    this.modalRef.hide();
  }
  // ------------------------------------------------------------ //
  async getStrategyService(params: ListParams) {
    params.limit = 100;
    const data = await this.serviceFormatService.getStrategyService(
      this.processNumber,
      params
    );
    this.strategyService = new DefaultSelect(data.data, data.count);
  }
  changeStrategyService(event: any) {
    // CHANGE //
    if (event) {
      this.getStrategyTypeService(new ListParams());
      this.form.get('typeServiceNumber').enable();
      this.form.get('turnNumber').disable();
      this.form.get('varCostNumber').disable();
      this.form.get('typeServiceNumber').reset();
      this.form.get('turnNumber').reset();
      this.form.get('varCostNumber').reset();
    } else {
      this.form.get('typeServiceNumber').disable();
      this.form.get('turnNumber').disable();
      this.form.get('varCostNumber').disable();
      this.form.get('typeServiceNumber').reset();
      this.form.get('turnNumber').reset();
      this.form.get('varCostNumber').reset();
      this.typeServiceNumber = new DefaultSelect([], 0);
      this.turnNumber = new DefaultSelect([], 0);
      this.varCostNumber = new DefaultSelect([], 0);
    }
  }
  // ------------------------------------------------------------ //
  async getStrategyTypeService(params: ListParams) {
    params.limit = 100;
    const body = {
      processNumber: this.processNumber,
      serviceNumber: this.form.value.serviceNumber,
    };
    const data = await this.serviceFormatService.getStrategyServiceType(
      body,
      params
    );
    this.typeServiceNumber = new DefaultSelect(data.data, data.count);
  }

  changeStrategyTypeService(event: any) {
    // CHANGE //
    if (event) {
      this.form.get('turnNumber').enable();
      this.form.get('varCostNumber').disable();
      this.form.get('turnNumber').reset();
      this.form.get('varCostNumber').reset();
      this.getTurnNumber(new ListParams());
    } else {
      this.form.get('turnNumber').disable();
      this.form.get('varCostNumber').disable();
      this.form.get('turnNumber').reset();
      this.form.get('varCostNumber').reset();
      this.turnNumber = new DefaultSelect([], 0);
      this.varCostNumber = new DefaultSelect([], 0);
    }
  }
  // ------------------------------------------------------------ //
  async getTurnNumber(params: ListParams) {
    params.limit = 100;
    const body = {
      processNumber: this.processNumber,
      serviceNumber: this.form.value.serviceNumber,
      serviceTypeNumber: this.form.value.typeServiceNumber,
    };
    const data = await this.serviceFormatService.getTurnNumber(body, params);
    this.turnNumber = new DefaultSelect(data.data, data.count);
  }

  changeTurnNumber(event: any) {
    // CHANGE //
    if (event) {
      this.form.get('varCostNumber').enable();
      this.form.get('varCostNumber').reset();
      this.getVarCostNumber(new ListParams());
    } else {
      this.form.get('varCostNumber').disable();
      this.form.get('varCostNumber').reset();
      this.varCostNumber = new DefaultSelect([], 0);
    }
  }
  // ------------------------------------------------------------ //
  async getVarCostNumber(params: ListParams) {
    params.limit = 100;
    const body = {
      processNumber: this.processNumber,
      serviceNumber: this.form.value.serviceNumber,
      serviceTypeNumber: this.form.value.typeServiceNumber,
      turnNumber: this.form.value.turnNumber,
    };
    const data = await this.serviceFormatService.getVarCostNumber(body, params);
    this.varCostNumber = new DefaultSelect(data.data, data.count);
  }
  changeVarCostNumber(event: any) {
    // CHANGE //
    if (event) {
      const { serviceNumber, typeServiceNumber, turnNumber, varCostNumber } =
        this.form.value;
      const params = new ListParams();
      params['filter.processNumber'] = `$eq:${this.processNumber}`;
      params['filter.serviceNumber'] = `$eq:${serviceNumber}`;
      params['filter.serviceTypeNumber'] = `$eq:${typeServiceNumber}`;
      params['filter.shiftNumber'] = `$eq:${turnNumber}`;
      params['filter.varCostNumber'] = `$eq:${varCostNumber}`;
      this.getStrategyCost(params);
    } else {
      this.form.get('costId').setValue(null);
    }
  }
  async getStrategyCost(params?: ListParams) {
    const data = await this.serviceFormatService.getStrategyCost(params);
    if (data) this.form.get('costId').setValue(data.data[0].costId);
    else
      this.alert(
        'warning',
        'Los valores de este tipo de Costo Unitario no son validos',
        ''
      ),
        this.form.get('costId').setValue(null);
  }
  // ------------------------------------------------------------ //
}
