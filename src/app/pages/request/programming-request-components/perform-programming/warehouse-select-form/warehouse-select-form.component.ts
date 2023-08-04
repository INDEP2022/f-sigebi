import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IWarehouse } from 'src/app/core/models/catalogs/warehouse.model';
import { WarehouseService } from 'src/app/core/services/catalogs/warehouse.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-warehouse-select-form',
  templateUrl: './warehouse-select-form.component.html',
  styles: [],
})
export class WarehouseSelectFormComponent extends BasePage implements OnInit {
  @Output() formValue = new EventEmitter<any>();
  form: FormGroup = new FormGroup({});
  data: any[] = [];
  warehouses = new DefaultSelect<IWarehouse>();
  warehouse: IWarehouse;
  delegation: number = 0;
  typeTransportable: string = '';
  typeTrans: string = '';
  idTransferent: number = 0;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private warehouseService: WarehouseService,
    private goodsQueryService: GoodsQueryService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    console.log('delegation', this.delegation);
    console.log('typeTrans', this.typeTrans);
    this.prepareForm();
    if (this.typeTransportable == 'warehouse')
      this.getWarehouses(new ListParams());

    if (this.typeTransportable == 'guard') this.getStoreGuard(new ListParams());
  }

  prepareForm() {
    this.form = this.fb.group({
      warehouse: [null, [Validators.required]],
    });
  }

  getStoreGuard(params: ListParams) {
    if (this.typeTrans == 'massive') {
      params['filter.name'] = `$ilike:${params.text}`;
      params['filter.regionalDelegation'] = this.delegation;
      params['filter.administratorName'] = this.idTransferent;
      this.goodsQueryService.getCatStoresView(params).subscribe({
        next: data => {
          console.log('almacenes', data);
          this.warehouses = new DefaultSelect(data.data, data.count);
        },
        error: () => {
          this.alert(
            'error',
            'Error de Información',
            'La Transferente no cuenta con Almacenes'
          );
        },
      });
    } else {
      params['filter.name'] = `$ilike:${params.text}`;
      params['filter.regionalDelegation'] = this.data[0].idDelegation;
      //params['filter.administratorName'] = this.data[0].idTransferent;

      this.goodsQueryService.getCatStoresView(params).subscribe({
        next: data => {
          console.log('almacenes', data);
          this.warehouses = new DefaultSelect(data.data, data.count);
        },
        error: () => {
          this.alert(
            'error',
            'Error de Información',
            'La Transferente no cuenta con Almacenes'
          );
        },
      });
    }
  }

  getWarehouses(params: ListParams) {
    params['filter.name'] = `$ilike:${params.text}`;
    params['filter.regionalDelegation'] = this.delegation;
    params['filter.managedBy'] = 'SAE';
    this.goodsQueryService.getCatStoresView(params).subscribe(data => {
      this.warehouses = new DefaultSelect(data.data, data.count);
    });
  }

  confirm() {
    if (this.typeTransportable == 'guard') {
      this.alertQuestion(
        'warning',
        'Advertencia',
        '¿Desea asignar los Bienes al Almacén seleccionado?'
      ).then(question => {
        if (question.isConfirmed) {
          this.loading = true;
          this.modalRef.content.callback(this.form.value.warehouse);
          this.close();
        } else {
          this.close();
        }
      });
    } else if (this.typeTransportable == 'warehouse') {
      this.alertQuestion(
        'warning',
        'Advertencia',
        '¿Desea asignar los Bienes al Almacén seleccionado?'
      ).then(question => {
        if (question.isConfirmed) {
          this.loading = true;
          this.modalRef.content.callback(this.form.value.warehouse);
          this.close();
        } else {
          this.close();
        }
      });
    }
  }

  close() {
    this.loading = false;
    this.modalRef.hide();
  }
}
