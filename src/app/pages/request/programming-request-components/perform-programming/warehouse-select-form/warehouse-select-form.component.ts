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
  idTransferent: number = 0;
  warehouses = new DefaultSelect<IWarehouse>();
  warehouse: IWarehouse;
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
    this.goodsQueryService.getCatStoresView(params).subscribe(data => {
      console.log('alamcenes relacionados con transferente', data);
      this.warehouses = new DefaultSelect(data.data, data.count);
    });
  }

  confirm() {
    this.alertQuestion(
      'warning',
      'Advertencía',
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
  }

  close() {
    this.loading = false;
    this.modalRef.hide();
  }
}
