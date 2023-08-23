import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DetailProceeDelRecService } from 'src/app/core/services/ms-proceedings/detail-proceedings-delivery-reception.service';
import { BasePage } from '../../../../core/shared/base-page';
import { COLUMN } from './column';

@Component({
  selector: 'app-modal-search-acts',
  templateUrl: './modal-search-acts.component.html',
  styles: [],
})
export class ModalSearchActsComponent extends BasePage implements OnInit {
  refresh: boolean = false;
  totalItems: number = 0;
  data1 = new LocalDataSource();
  LocalData1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: any;
  selectedRow: any;
  @ViewChild('mySmartTable') mySmartTable: any;
  constructor(
    private modalRef: BsModalRef,
    private detailProceeDelRecService: DetailProceeDelRecService
  ) {
    super();
    this.settings = { ...this.settings, actions: false };
    this.settings.columns = COLUMN;
  }

  ngOnInit(): void {
    console.log('data que llega; ', this.data);
    this.getProceding(this.data);
  }

  close() {
    this.modalRef.content.callback(this.refresh);
    this.modalRef.hide();
  }

  getProceding(expedient: any) {
    this.detailProceeDelRecService.getProceding(expedient).subscribe({
      next: response => {
        for (let i = 0; i < response.count; i++) {
          let params = {
            keysProceedings: response.data[i].keysProceedings,
            id: response.data[i].id,
            statusProceedings: response.data[i].statusProceedings,
          };
          this.LocalData1.push(params);
          this.data1.load(this.LocalData1);
          this.data1.refresh();
          this.totalItems = response.count;
        }
      },
    });
  }

  onRowSelect(event: any) {
    this.selectedRow = event.data;
    console.log(this.selectedRow);
  }

  clearSelection() {
    const selectedRows = this.mySmartTable.grid.getSelectedRows();
    selectedRows.forEach((row: any) => {
      row.isSelected = false;
    });
  }

  cveActaSend() {
    if (this.selectedRow == null) {
      this.alert('warning', 'Es Necesario Seleccionar un Registro', '');
    } else {
      this.refresh = true;
      this.modalRef.content.callback(
        this.refresh,
        this.selectedRow.keysProceedings,
        this.selectedRow.id
      );
      this.modalRef.hide();
    }
  }
}
