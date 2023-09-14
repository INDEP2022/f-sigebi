import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { _Params } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { GoodFinderService } from 'src/app/core/services/ms-good/good-finder.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-modal-scanning-foil',
  templateUrl: './modal-scanning-foil.component.html',
  styles: [],
})
export class ModalScanningFoilAppointmentTableComponent<T = any>
  extends BasePage
  implements OnInit
{
  $obs: (params?: _Params, body?: any) => Observable<IListResponse<any>>;
  service: DocumentsService;
  title: string = '';
  rows: any[] = [];
  totalItems = 0;
  columns: any = {};
  $params = new BehaviorSubject(new FilterParams());
  body: any = {};
  showConfirmButton: boolean = false;
  selectedRow: T = null;
  @Input() folio: boolean = false;
  @Input() wheel: boolean = false;
  @Input() folioUniversal: number;
  @Input() wheelNumber: any;
  @Output() selected = new EventEmitter<T>();
  constructor(
    private modalRef: BsModalRef,
    private goodFinderService: GoodFinderService,
    private documentsService: DocumentsService
  ) {
    super();
    this.settings = { ...this.settings, actions: false };
  }

  ngOnInit(): void {
    this.settings = { ...this.settings, columns: this.columns };

    this.getData();
  }

  getData() {
    const params = new FilterParams();
    if (this.wheel == true) {
      params.addFilter('flyerNumber', this.wheelNumber);
    } else {
      params.addFilter('id', this.folioUniversal);
      // if (this.folio == true) {
      // } else {
      //   params.addFilter('id', this.folioUniversal);
      // }
    }
    this.loading = true;
    this.documentsService.getAllFilter(params.getParams()).subscribe({
      next: resp => {
        this.loading = false;
        this.rows = resp.data;
        console.log(this.rows);
        this.totalItems = resp.count;
      },
      error: error => {
        this.loading = false;
        this.onLoadToast('warning', 'Atención', 'No se encontraron registros');
      },
    });
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.selected.emit(this.selectedRow);
    this.modalRef.hide();
  }
}
