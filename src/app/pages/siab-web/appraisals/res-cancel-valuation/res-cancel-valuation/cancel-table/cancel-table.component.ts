import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, take, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { AppraiseService } from 'src/app/core/services/ms-appraise/appraise.service';
import { JobsService } from 'src/app/core/services/ms-office-management/jobs.service';
import { BasePageTableNotServerPagination } from 'src/app/core/shared/base-page-table-not-server-pagination';
import { AppraisalsDataService } from '../../../appraisals-data.service';
import { SendObtainGoodValued } from '../res-cancel-valuation-class/class-service';
import {
  MOT_CAN,
  VALUATION_REQUEST_COLUMNS_TWO,
} from '../res-cancel-valuation-columns';

@Component({
  selector: 'app-cancel-table',
  templateUrl: './cancel-table.component.html',
  styleUrls: ['./cancel-table.component.css'],
})
export class CancelTableComponent
  extends BasePageTableNotServerPagination
  implements OnInit
{
  private _body: SendObtainGoodValued;
  @Input() get body() {
    return this._body;
  }
  set body(value) {
    this._body = value;
    this.getData();
  }
  @Input() event: any;
  @Input() officeType: number;
  @Input() set showModalCambioRev(value: number) {
    if (value > 0) {
      if (!this.event) {
        this.alert(
          'warning',
          'Seleccione un evento o folio para continuar',
          ''
        );
      }
      this.reasonsForChange();
    }
  }

  selectedRows: Array<any> = [];
  // Modal
  @ViewChild('modalRev', { static: true })
  miModalRev: TemplateRef<any>;
  // Modal #2
  dataModal: LocalDataSource = new LocalDataSource();
  settingsModal: any;
  paramsModal = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsModal: number = 0;
  constructor(
    private serviceAppraise: AppraiseService,
    private dataService: AppraisalsDataService,
    private modalService: BsModalService,
    private serviceJobs: JobsService
  ) {
    super();
    this.settings = {
      ...this.settings,
      selectMode: 'multi',
      actions: false,
      columns: { ...VALUATION_REQUEST_COLUMNS_TWO },
    };
    // Modal #2
    this.settingsModal = {
      ...this.settings,
      selectMode: 'multi',
      actions: false,
      columns: { ...MOT_CAN },
    };
    this.haveInitialCharge = false;
    this.paramsModal.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: response => {
        this.getReasonsChange();
      },
    });
  }

  get selectedRowsCancel() {
    return this.dataService.selectedRowsCancel;
  }

  set selectedRowsCancel(value) {
    this.dataService.selectedRowsCancel = value;
  }

  onUserRowSelectCancel(event: any): void {
    this.selectedRowsCancel = event.selected; // Aquí, event.selected te dará todas las filas seleccionadas
  }

  onUserRowSelect(event: any): void {
    this.selectedRows = event.selected; // Aquí, event.selected te dará todas las filas seleccionadas
  }

  closeModalSubtype() {
    this.modalService.hide();
  }

  private reasonsForChange() {
    this.modalService.show(this.miModalRev, {
      ...MODAL_CONFIG,
      class: 'modal-xl modal-dialog-centered',
    });
    this.getReasonsChange();
  }

  private getReasonsChange() {
    let eventGlobal: number;
    eventGlobal = this.event;
    this.serviceJobs
      .getMoCanById(eventGlobal, this.paramsModal.getValue())
      .subscribe({
        next: response => {
          this.dataModal.load(response.data[0]);
          this.dataModal.refresh();
          this.totalItemsModal = response.count || 0;
          this.loading = false;
        },
        error: error => {
          this.loader.load = false;
          this.loading = false;
          this.dataModal.load([]);
          this.dataModal.refresh();
        },
      });
  }

  modifySelectedRows(): void {
    let motivos = '';
    let noMot = '';
    let noCaracteres = '';
    this.selectedRows.forEach((row, index) => {
      noMot += row.id_motivo + (index < this.selectedRows.length ? ',' : '');
      motivos +=
        row.descripcion_motivo + (index < this.selectedRows.length ? '/' : '');
    });
    // console.log(this.selectedRowsCancel);

    this.selectedRowsCancel.forEach(row => {
      if (row.motivos + ''.trim() === '') {
        row.motivos += motivos;
      }
    });

    this.dataPaginated.refresh();
  }

  private validatedReasons() {
    if (this.officeType == 3) {
      if (this.selectedRowsCancel.length == 0) {
        this.alert(
          'warning',
          'Advertencia',
          'Para continuar es necesario que seleccione los motivos por los cuales se va a enviar a REV el bien'
        );
      }
    }
  }

  private changeChar(chain: string): string {
    let replacements = [
      { from: '&nbsp;', to: '' },
      { from: 'nbsp;', to: '' },
      { from: 'amp;NBSP;', to: '' },
      { from: '&amp;nbsp;', to: '' },
      { from: '&amp;amp;nbsp;', to: '' },
      { from: '&AMP;AMP;NBSP;', to: '' },
      { from: '&amp;', to: '' },
      { from: '&AMP;', to: '' },
      { from: '&#193;', to: 'Á' },
      { from: '#193;', to: 'Á' },
      { from: '&#225;', to: 'á' },
      { from: '#225;', to: 'á' },
      { from: '&#201;', to: 'É' },
      { from: '#201;', to: 'É' },
      { from: '&#233;', to: 'é' },
      { from: '#233;', to: 'é' },
      { from: '&#205;', to: 'Í' },
      { from: '&#237;', to: 'í' },
      { from: '&#211;', to: 'Ó' },
      { from: '#211;', to: 'Ó' },
      { from: '&#243;', to: 'ó' },
      { from: '#243;', to: 'ó' },
      { from: '&#218;', to: 'Ú' },
      { from: '#218;', to: 'Ú' },
      { from: '&#250;', to: 'ú' },
      { from: '#250;', to: 'ú' },
      { from: '&amp;amp;#225;', to: 'á' },
      { from: '&amp;amp;#233;', to: 'é' },
      { from: '&amp;amp;#237;', to: 'í' },
      { from: '&amp;amp;#243;', to: 'ó' },
      { from: '&amp;amp;#250;', to: 'ú' },
      { from: '&#241;', to: 'ñ' },
      { from: '&#209;', to: 'Ñ' },
      { from: '&amp;#209;', to: 'Ñ' },
      { from: '&#220;', to: 'Ü' },
      { from: '&#252;', to: 'ü' },
      { from: '&quot;', to: '' },
      { from: "'", to: '' },
    ];

    for (let replacement of replacements) {
      chain = chain.split(replacement.from).join(replacement.to);
    }

    return chain;
  }

  private addReasons() {
    this.validatedReasons();
    let arrayChange: any[] = [];
    for (const x of this.selectedRowsCancel) {
      this.changeChar(x.motivos);
      arrayChange = x;
    }
    this.selectedRowsCancel = arrayChange;
  }

  countGoodsSelected() {
    let typeOffice: number = this.officeType;
    if (typeOffice == 2) {
      if (this.selectedRowsCancel.length == 0) {
        this.alert(
          'warning',
          'Advertencia',
          'Para continuar es necesario seleccionar bienes'
        );
      }
    } else if (typeOffice == 3) {
      this.addReasons();
      if (this.selectedRowsCancel.length == 0) {
        this.alert(
          'warning',
          'Advertencia',
          'Para continuar es necesario seleccionar bienes'
        );
      }
      let countOne: number = 0;
      let countTwo: number = 0;
      for (const x of this.selectedRowsCancel) {
        countOne++;
        if (x.motivos != ' ') {
          countTwo++;
        }
      }
      if (countOne != countTwo) {
        this.alert(
          'warning',
          'Advertencia',
          'Para continuar es necesario que seleccione los motivos por los cuales se va a enviar a REV el bien'
        );
      }
    }
  }

  override getData() {
    if (!this.body) {
      this.notGetData();
      return;
    }
    let params = this.getParams();
    params.limit = 100000000;
    this.loading = true;
    this.serviceAppraise
      .postGetAppraise(this.body, params)
      .pipe(take(1))
      .subscribe({
        next: response => {
          if (response && response.data && response.data.length > 0) {
            this.data = response.data.map((row: any) => {
              return { ...row };
            });
            this.dataService.cancelsData = this.data;
            this.setTotals(this.data);
            this.totalItems = this.data.length;
            this.dataTemp = [...this.data];
            this.getPaginated(this.params.value);
            this.loading = false;
          } else {
            this.notGetData();
          }
        },
        error: error => {
          if (error.status == 400) {
            this.alert(
              'warning',
              'Advertencia',
              'No hay bienes para realizar el oficio de cancelación'
            );
          }
          this.notGetData();
        },
      });
  }
}
