import { Component, OnInit } from '@angular/core';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePageWidhtDinamicFilters } from 'src/app/core/shared/base-page-dinamic-filters';
import Swal from 'sweetalert2';
import { COLUMNS } from './columns';
//Provisional Data
import { data } from './data';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styles: [],
})
export class StatusComponent
  extends BasePageWidhtDinamicFilters
  implements OnInit
{
  comercializationGoods: any[] = [];
  goodsAFSD = data;
  rowSelected: boolean = false;
  selectedRow: any = null;
  status: any;
  columns = COLUMNS;

  constructor(private goodService: GoodService) {
    super();
    this.service = this.goodService;
    this.service = this.goodService;
    this.ilikeFilters = ['description'];
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      columns: COLUMNS,
    };
  }

  onSaveConfirm(event: any) {
    event.confirm.resolve();
    this.goodService.update(event.newData).subscribe();
    this.onLoadToast('success', 'Elemento Actualizado', '');
  }

  onAddConfirm(event: any) {
    event.confirm.resolve();
    this.goodService.create(event.newData).subscribe();
    this.onLoadToast('success', 'Elemento Creado', '');
  }

  showDeleteAlert(event: any) {
    const body = {
      id: event.id,
      goodId: event.goodId,
    };
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(body);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(body: Object) {
    this.goodService.removeGood(body).subscribe();
  }

  selectRow(row: any) {
    this.selectedRow = row;
    this.rowSelected = true;
  }
}
