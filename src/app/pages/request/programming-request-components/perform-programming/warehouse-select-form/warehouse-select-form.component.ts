import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  form: FormGroup = new FormGroup({});
  data: any[] = [];
  warehouses = new DefaultSelect<IWarehouse>();
  warehouse: IWarehouse;
  typeTransportable: string = '';
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private warehouseService: WarehouseService,
    private goodsQueryService: GoodsQueryService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getWarehouses(new ListParams());
  }

  prepareForm() {
    this.form = this.fb.group({
      warehouse: [null, [Validators.required]],
    });
  }

  getWarehouses(params: ListParams) {
    params['filter.name'] = `$ilike:${params.text}`;
    this.goodsQueryService.getCatStoresView(params).subscribe(data => {
      this.warehouses = new DefaultSelect(data.data, data.count);
    });
  }

  confirm() {
    if (this.typeTransportable == 'guard') {
      this.alertQuestion(
        'warning',
        'Advertencia',
        '¿Desea asignar el almacén para bienes de resguardo?'
      ).then(question => {
        if (question.isConfirmed) {
          this.loading = true;
          this.modalRef.content.callback(this.form.value);
          this.close();
        } else {
          this.close();
        }
      });
    } else if (this.typeTransportable == 'warehouse') {
      this.alertQuestion(
        'warning',
        'Advertencia',
        '¿Desea asignar el almacén para bienes de almacén?'
      ).then(question => {
        if (question.isConfirmed) {
          this.loading = true;
          this.modalRef.content.callback(this.form.value);
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
