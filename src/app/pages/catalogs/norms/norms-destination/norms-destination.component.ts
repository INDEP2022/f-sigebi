import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGeneric } from 'src/app/core/models/catalogs/generic.model';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NORMS_DETINATION_COLUMNS } from './norms-destination-columns';

@Component({
  selector: 'app-norms-destination',
  templateUrl: './norms-destination.component.html',
  styles: [],
})
export class NormsDestinationComponent extends BasePage implements OnInit {
  @Output() refresh = new EventEmitter<true>();
  columns: IGeneric[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  rowSelected: boolean = false;
  selectedRow: any = null;

  constructor(
    private genericService: GenericService,
    private modalRef: BsModalRef
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: NORMS_DETINATION_COLUMNS,
      selectedRowIndex: -1,
    };
  }

  ngOnInit(): void {
    this.getExample();
  }

  getExample() {
    this.loading = true;
    this.params.getValue()['filter.name'] = 'Destino';
    this.genericService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.columns = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }
  close() {
    this.modalRef.hide();
  }
  selectRow(row: any) {
    console.log(row);
    this.selectedRow = row;
    this.rowSelected = true;
  }
  confirm() {
    if (!this.rowSelected) return;
    this.refresh.emit(this.selectedRow);
    this.modalRef.hide();
  }
}
