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
  status = new DefaultSelect();

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
    console.log('recibido ', this.contract);
    if (this.edit) {
      this.transformDateI(this.contract.startDate);
      this.transformDateF(this.contract.endDate);
      console.log('ng->', this.contract);
    }

    this.asignarDatos();
    this.getZoneContracts(new ListParams());
  }

  asignarDatos() {
    let itemVigente = {
      id: '1',
      descripcion: 'Vigente',
    };
    let itemNoVigente = {
      id: '0',
      descripcion: 'No vigente',
    };
    let lstDatos = [];
    lstDatos.push(itemVigente);
    lstDatos.push(itemNoVigente);
    this.status = new DefaultSelect(lstDatos, lstDatos.length);
  }

  private prepareForm() {
    this.contractForm = this.fb.group({
      id: [null, []],
      description: [null, [Validators.pattern(STRING_PATTERN)]],
      contractKey: [null, Validators.required],
      endDate: [null, Validators.required],
      registerNumber: [null],
      startDate: [null, Validators.required],
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
    if (this.validarFecha()) {
      this.edit ? this.update() : this.create();
    }
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    return `${year}-${month}-${day}`;
  }

  create() {
    this.loading = true;
    this.contractForm.patchValue({
      startDate: this.formatDate(this.contractForm.get('startDate').value),
      endDate: this.formatDate(this.contractForm.get('endDate').value),
    });
    console.log('antes de crear ', this.contractForm.value);
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
      statusContract: Number(this.contractForm.get('statusContract').value),
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

  validarFecha() {
    if (
      this.contractForm.get('startDate').value >=
      this.contractForm.get('endDate').value
    ) {
      this.onLoadToast(
        'warning',
        `La fecha inicial no puede ser mayor o igual a la fecha final`
      );
      return false;
    }
    return true;
  }

  transformDateI(fechaInput: string) {
    const partesFecha = fechaInput.split('-'); // Dividir la fecha en partes: [dia, mes, año]
    const fechaFormateada = `${partesFecha[2]}-${partesFecha[1]}-${partesFecha[0]}`;

    this.contractForm.patchValue({
      startDate: fechaFormateada,
    });
  }

  transformDateF(fechaInput: string) {
    const partesFecha = fechaInput.split('-'); // Dividir la fecha en partes: [dia, mes, año]
    const fechaFormateada = `${partesFecha[2]}-${partesFecha[1]}-${partesFecha[0]}`;

    this.contractForm.patchValue({
      endDate: fechaFormateada,
    });
  }
}
