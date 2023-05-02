import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { IWarehouse } from 'src/app/core/models/catalogs/warehouse.model';
import { SafeService } from 'src/app/core/services/catalogs/safe.service';
import { WarehouseService } from 'src/app/core/services/catalogs/warehouse.service';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings';
import { AlertButton } from 'src/app/pages/judicial-physical-reception/scheduled-maintenance-1/models/alert-button';
import { MaintenanceRecordsService } from '../../../services/maintenance-records.service';
import { UpdateWarehouseVault } from './../../../../../../core/models/ms-proceedings/warehouse-vault.model';

@Component({
  selector: 'app-warehouse-proceedings',
  templateUrl: './warehouse-proceedings.component.html',
  styleUrls: ['./warehouse-proceedings.component.scss'],
})
export class WarehouseProceedingsComponent
  extends AlertButton
  implements OnInit
{
  form: FormGroup;
  selectedWarehouse: any;
  selectedVault: any;
  paramsWarehouse = new FilterParams();
  paramsSafes = new FilterParams();
  massive = false; // true si hay mas de un acta con misma clave de acta
  constructor(
    private fb: FormBuilder,
    private serviceW: WarehouseService,
    private safeService: SafeService,
    private service: ProceedingsService,
    private dataService: MaintenanceRecordsService
  ) {
    super();
    this.form = this.fb.group({
      warehouseId: [null],
      warehouseDescription: [null],
      vaultId: [null],
      vaultDescription: [null],
    });
    this.form.valueChanges.subscribe(x => {
      console.log(x);
    });
  }

  ngOnInit(): void {}

  get disabledForm() {
    return this.warehouse === null && this.vault === null;
  }

  get warehouse() {
    return this.form.get('warehouseId')
      ? this.form.get('warehouseId').value
      : null;
  }

  get vault() {
    return this.form.get('vaultId') ? this.form.get('vaultId').value : null;
  }

  get warehouses() {
    return this.serviceW.getAllFilter(this.paramsWarehouse.getParams());
  }

  get safes() {
    return this.safeService.getAllFilter(this.paramsSafes.getParams());
  }

  get statusActa() {
    return this.dataService.selectedAct
      ? this.dataService.selectedAct.statusProceedings
        ? this.dataService.selectedAct.statusProceedings
        : 'ABIERTA'
      : 'ABIERTA';
  }

  selectWarehouse(warehouse: IWarehouse) {
    // console.log(event);
    this.selectedWarehouse = warehouse;
    this.form.get('warehouseDescription').setValue(warehouse.description);
  }

  async update() {
    const model: UpdateWarehouseVault = {
      warehouseNumber: this.warehouse,
      safeNumber: this.vault,
      actKey: this.dataService.formValue.cveActa,
      actNumber: this.dataService.formValue.id,
    };
    let count = 0;
    if (this.vault) {
      const service = this.massive
        ? this.service.updateVaultByKeyProceeding(model)
        : this.service.updateVaultByProceedingNumber(model);
      await firstValueFrom(service).then(response => {
        count++;
        this.onLoadToast('success', 'Bovedas', 'Registros Actualizados');
      });
    }
    if (this.warehouse) {
      const service = this.massive
        ? this.service.updateWarehouseByKeyProceeding(model)
        : this.service.updateWarehouseByProceedingNumber(model);
      await firstValueFrom(service).then(response => {
        count++;
        // console.log(response);
        this.onLoadToast('success', 'Almacenes', 'Registros Actualizados');
      });
    }
    if (count > 0) this.dataService.updateWarehouseVault.emit('');
  }
}
