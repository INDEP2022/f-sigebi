import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ITvalTable1 } from 'src/app/core/models/catalogs/dinamic-tables.model';
import { DynamicTablesService } from 'src/app/core/services/dynamic-catalogs/dynamic-tables.service';
import { BasePage } from 'src/app/core/shared';
import { COLUMNS_GOODS_SITUATION } from './columns-situations-good';

@Component({
  selector: 'app-good-situations-modal',
  templateUrl: './good-situations-modal.component.html',
  styles: [],
})
export class GoodSituationsModalComponent extends BasePage implements OnInit {
  data: ITvalTable1[] = [];
  params = new ListParams();
  constructor(
    private modalRef: BsModalRef,
    private dynamicTablesService: DynamicTablesService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        add: false,
        position: 'right',
      },
      columns: { ...COLUMNS_GOODS_SITUATION },
      hideSubHeader: true,
    };
  }

  ngOnInit(): void {
    this.dynamicTablesService.getAllTvalTable1(this.params).subscribe({
      next: resp => {
        console.log('Datos obtenidos');
        this.data = resp.data;
      },
      error: error => {},
    });
  }

  confirm() {
    this.modalRef.hide();
  }

  close() {
    this.modalRef.hide();
  }
}
