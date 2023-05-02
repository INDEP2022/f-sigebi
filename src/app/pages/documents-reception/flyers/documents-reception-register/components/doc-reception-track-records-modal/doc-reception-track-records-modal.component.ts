import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { IUserRowSelectEvent } from 'src/app/core/interfaces/ng2-smart-table.interface';
import { IExpedient } from 'src/app/core/models/ms-expedient/expedient';
import { IGood } from 'src/app/core/models/ms-good/good';
import { INotification } from 'src/app/core/models/ms-notification/notification.model';
import { DocReceptionRegisterService } from 'src/app/core/services/document-reception/doc-reception-register.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DocumentsReceptionDataService } from '../../../../../../core/services/document-reception/documents-reception-data.service';
import { CopiesXFlierService } from '../../../../../../core/services/ms-flier/copies-x-flier.service';
import {
  DOCUMENTS_RECEPTION_SELECT_TRACK_RECORD_COLUMNS,
  DOCUMENTS_RECEPTION_SELECT_TRACK_RECORD_GOODS_COLUMNS,
} from '../../interfaces/columns';

@Component({
  selector: 'app-doc-reception-track-records-modal',
  templateUrl: './doc-reception-track-records-modal.component.html',
  styles: [
    `
      .tr-block {
        height: 26rem;
      }
      .tr-text {
        height: 23rem;
      }
      .tr-block-bottom {
        height: 30rem;
      }
      .tr-text-bottom {
        height: 27rem;
      }
      .bg-gray {
        background-color: #ececec;
      }
      ng-scrollbar {
        ::ng-deep {
          .ng-scroll-viewport {
            padding-right: 1em;
          }
        }
      }
    `,
  ],
})
export class DocReceptionTrackRecordsModalComponent
  extends BasePage
  implements OnInit
{
  rowSelected: boolean = false;
  selectedFlyer: INotification = null;
  notificationData: string[];
  expedientData: string[];
  goodAttributeData: string[];
  title: string = 'Antecedente';
  trackRecordsForm: FormGroup = this.fb.group({
    expedientDetail: null,
    notificationDetail: null,
    goodDetail: null,
  });
  @Input() trackRecords: any[]; //Input Requerido
  @Output() onSelect = new EventEmitter<any>();
  goodColumns: IGood[] = [];
  trackRecordSettings = {
    ...this.settings,
    selectedRowIndex: 0,
    actions: false,
    columns: DOCUMENTS_RECEPTION_SELECT_TRACK_RECORD_COLUMNS,
  };
  goodSettings = {
    ...this.settings,
    selectedRowIndex: 0,
    actions: false,
    columns: DOCUMENTS_RECEPTION_SELECT_TRACK_RECORD_GOODS_COLUMNS,
  };

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private expedientService: ExpedientService,
    private docReceptionService: DocReceptionRegisterService,
    private flyerService: CopiesXFlierService,
    private docsDataService: DocumentsReceptionDataService
  ) {
    super();
  }

  ngOnInit(): void {
    console.log(this.trackRecords);
  }

  getGoods(): void {
    this.loading = true;
    this.loading = false;
  }

  getGoodData(): void {
    this.loading = true;
    this.loading = false;
  }

  selectRow(row: IUserRowSelectEvent<INotification>) {
    if (!row.isSelected) {
      this.rowSelected = false;
      this.selectedFlyer = null;
      this.goodColumns = [];
      this.notificationData = [];
      this.expedientData = [];
      return;
    }
    this.selectedFlyer = row.data;
    this.rowSelected = true;
    this.loading = true;
    this.flyerService.getNotificationDetail(row.data.wheelNumber).subscribe({
      next: data => {
        this.notificationData = data.notif_det.split('\n');
      },
      error: () => {
        this.notificationData = [];
        this.loading = false;
      },
    });
    this.expedientService.getById(row.data.expedientNumber).subscribe({
      next: data => {
        this.getExpedientData(data);
      },
      error: () => {
        this.loading = false;
      },
    });
    const param = new FilterParams();
    param.addFilter('flyerNumber', row.data.wheelNumber);
    this.docReceptionService.getGoods(param.getParams()).subscribe({
      next: data => {
        if (data.count > 0) {
          this.goodColumns = data.data;
          this.loading = false;
        } else {
          this.goodColumns = [];
          this.loading = false;
        }
      },
      error: () => {
        this.goodColumns = [];
        this.loading = false;
      },
    });
  }

  getExpedientData(expedient: IExpedient) {
    this.flyerService.getExpedientDetail(expedient.id).subscribe({
      next: data => {
        this.expedientData = data.exp_det.split('\n');
      },
      error: () => {
        this.expedientData = [];
        this.loading = false;
      },
    });
  }

  selectGood(row: IUserRowSelectEvent<IGood>) {
    if (!row.isSelected) {
      this.goodAttributeData = [];
      return;
    }
    this.loading = true;
    this.flyerService.getGoodAttributeData(row.data.id).subscribe({
      next: data => {
        this.goodAttributeData = data.val_bien.split('\n');
        this.loading = false;
      },
      error: () => {
        this.goodAttributeData = [];
        this.loading = false;
      },
    });
  }

  confirm() {
    if (!this.rowSelected) return;
    this.docsDataService.trackRecordGoods = this.goodColumns;
    this.onSelect.emit(this.selectedFlyer);
    this.modalRef.hide();
  }

  close() {
    this.modalRef.hide();
  }
}
