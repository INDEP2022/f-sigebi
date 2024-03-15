import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { GuarantyService } from 'src/app/core/services/ms-guaranty/guaranty.service';
import { BasePage } from 'src/app/core/shared';
import { COLUMNS_COMER_LOTES } from './columns-comer-lotes';

@Component({
  selector: 'app-comer-lotes-table',
  templateUrl: './comer-lotes-table.html',
  styleUrls: ['./comer-lotes-table.component.css'],
})
export class ComerLotesTableComponent extends BasePage implements OnInit {
  source: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  listObjects: any[] = [];
  @ViewChild('table', { static: false }) table: any;
  object: any;

  constructor(
    private modalRef: BsModalRef,
    private guarantyService: GuarantyService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: true,
      actions: false,
      selectMode: 'multi',
      /*actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        add: false,
        position: 'right',
      },*/
      columns: { ...COLUMNS_COMER_LOTES },
    };
  }

  ngOnInit(): void {
    this.params = this.pageFilter(this.params);

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
  }

  getData() {
    this.loading = true;

    //this.params = this.pageFilter(this.params);
    this.params.getValue()['sortBy'] = `publicLot:DESC`;
    let params = {
      ...this.params.getValue(),
      //...this.columnFiltersReprocess,
    };

    this.guarantyService.idEventXLote(params).subscribe({
      next: resp => {
        this.source = resp.data;
        this.totalItems = resp.count;
        this.loading = false;
      },
      error: error => {
        this.totalItems = 0;

        this.loading = false;
      },
    });
  }

  selectRows(event: any) {
    console.log('event.selected', event);

    if (event.isSelected == false) {
      this.table.isAllSelected = false;
    }
    this.listObjects = event.selected;

    if (this.listObjects.length <= 1) {
      if (event.isSelected === true) {
        this.object = this.listObjects[0];
      } else {
        this.object = null;
      }
    } else {
      this.object = this.listObjects;
      console.log('Objetos seleccionados: ', this.object);
    }
  }

  close() {
    this.modalRef.hide();
  }
}
