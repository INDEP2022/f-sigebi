import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePageWidhtDinamicFilters } from 'src/app/core/shared/base-page-dinamic-filters';
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

  //Columns
  columns = COLUMNS;

  constructor(private goodService: GoodService) {
    super();

    this.service = this.goodService;

    /* this.settings = {
      ...this.settings,
      actions: {
        ...this.settings.actions,
        add: true,
        edit: true,
        delete: true,
      },
      mode: 'inline',
      hideSubHeader: false,
      columns: COLUMNS,
    }; */
    this.service = this.goodService;
    this.ilikeFilters = ['description'];
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      columns: COLUMNS,
    };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getStatusGood());

    this.dinamicFilterUpdate();
    this.searchParams();
  }

  getStatusGood() {
    this.loading = true;
    this.goodService.getAll(this.params.getValue()).subscribe(
      response => {
        console.log(response);
        this.comercializationGoods = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error => (this.loading = false)
    );
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

  onDeleteConfirm(event: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        event.confirm.resolve();
        this.goodService.remove(event.data.id).subscribe();

        this.onLoadToast('success', 'Elemento Eliminado', '');
      }
    });
  }

  selectRow(row: any) {
    this.selectedRow = row;
    this.rowSelected = true;
  }
}
