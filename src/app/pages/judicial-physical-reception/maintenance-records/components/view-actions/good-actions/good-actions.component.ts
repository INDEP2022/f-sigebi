import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TableReplaceColumnModalComponent } from 'src/app/@standalone/modals/table-replace-column-modal/table-replace-column-modal.component';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IDetailProceedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/detail-proceeding-delivery-reception';
import { GoodTrackerService } from 'src/app/core/services/ms-good-tracker/good-tracker.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { StatusGoodService } from 'src/app/core/services/ms-good/status-good.service';
import { ProceedingsDetailDeliveryReceptionService } from 'src/app/core/services/ms-proceedings';
import { AlertButton } from 'src/app/pages/judicial-physical-reception/scheduled-maintenance-1/models/alert-button';

@Component({
  selector: 'app-good-actions',
  templateUrl: './good-actions.component.html',
  styles: [],
})
export class GoodActionsComponent extends AlertButton implements OnInit {
  @Input() statusActaValue: string;
  @Input() nroActa: string;
  @Input() data: IDetailProceedingsDeliveryReception[];
  @Input() rowsSelected: IDetailProceedingsDeliveryReception[] = [];
  @Output() updateTable = new EventEmitter();
  form: FormGroup;
  loading = false;
  selectedsForUpdate: IDetailProceedingsDeliveryReception[] = [];
  paramsGoods = new FilterParams();
  operatorGoods = SearchFilter.IN;
  paramsControl = new FilterParams();
  constructor(
    private fb: FormBuilder,
    private service: ProceedingsDetailDeliveryReceptionService,
    private goodTrackerService: GoodTrackerService,
    private modalService: BsModalService,
    private goodService: GoodService,
    private statusGoodService: StatusGoodService
  ) {
    super();
    this.form = this.fb.group({
      goodId: [null, [Validators.required]],
      action: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    // this.paramsControl.addFilter('status', 'status', SearchFilter.LIKE);
  }

  get goodsList() {
    return this.goodTrackerService.getAll(this.paramsGoods.getParams());
  }

  addGood(row: any) {
    console.log(row);
    this.service
      .create({
        numberProceedings: +this.nroActa,
        numberGood: this.form.get('goodId').value,
        amount: row.quantity,
        received: 'S',
        approvedDateXAdmon: new Date(),
        approvedXAdmon: 'S',
        approvedUserXAdmon: localStorage.getItem('username'),
        dateIndicatesUserApproval: new Date(),
        numberRegister: null,
        reviewIndft: null,
        correctIndft: null,
        idftUser: null,
        idftDate: null,
        numDelegationIndft: null,
        yearIndft: null,
        monthIndft: null,
        idftDateHc: null,
        packageNumber: null,
        exchangeValue: null,
      })
      .subscribe({
        next: response => {
          this.onLoadToast(
            'success',
            this.form.get('goodId').value,
            'Agregado exitosamente'
          );
          this.updateTable.emit();
        },
        error: err => {},
      });
  }

  openModals() {
    console.log(this.rowsSelected);
    if (this.form.get('action').value === 1) {
      this.openModalSelect(
        {
          titleColumnToReplace: 'bienes',
          columnsType: {
            numberGood: {
              title: 'N° Bien',
              type: 'string',
              sort: false,
            },
            numberProceedings: {
              title: 'N° Acta',
              type: 'string',
              sort: false,
            },
          },
          settings: { ...TABLE_SETTINGS },
          tableData: this.rowsSelected,
          form: this.fb.group({
            numberProceedings: [null, [Validators.required]],
          }),
          formField: 'numberProceedings',
        },
        this.replaceProceeding
      );
    } else {
      this.openModalSelect(
        {
          titleColumnToReplace: 'estados',
          columnsType: {
            numberGood: {
              title: 'N° Bien',
              type: 'string',
              sort: false,
            },
            status: {
              title: 'Estatus',
              type: 'string',
              sort: false,
            },
          },
          settings: { ...TABLE_SETTINGS },
          tableData: this.rowsSelected,
          service: this.statusGoodService,
          dataObservableFn: this.statusGoodService.getAllSelf,
          idSelect: 'status',
          labelSelect: 'status',
          paramFilter: 'status',
          operator: SearchFilter.ILIKE,
          form: this.fb.group({
            status: [null, [Validators.required]],
            justification: [null, [Validators.required]],
          }),
          formField: 'status',
          otherFormField: 'justification',
          otherFormLabel: 'Motivo del cambio',
        },
        this.replaceStatus
      );
    }
  }

  replaceProceeding(newValue: any) {}

  replaceStatus(
    newValue: { status: string; justification: string },
    self: GoodActionsComponent
  ) {
    const goods = self.rowsSelected.map(good => good.numberGood);
    let message = '';
    goods.forEach((good, index) => {
      message += good + (index < goods.length - 1 ? ',' : '');
    });
    self.goodService.updateGoodStatusMassive(goods, newValue.status).subscribe({
      next: response => {
        self.onLoadToast('success', 'Estados Actualizados', message);
      },
    });
  }

  private openModalSelect(
    context?: Partial<TableReplaceColumnModalComponent>,
    callback?: Function
  ) {
    const modalRef = this.modalService.show(TableReplaceColumnModalComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered modal-not-top-padding',
      ignoreBackdropClick: true,
    });
    modalRef.content.newValue.subscribe(data => {
      if (data) callback(data, this);
    });
  }

  updateGoods() {
    this.service
      .updateMasive(
        this.selectedsForUpdate.map(item => {
          return {
            fec_aprobacion_x_admon: item.approvedDateXAdmon + '',
            fec_indica_usuario_aprobacion: item.dateIndicatesUserApproval + '',
            no_bien: item.numberGood + '',
          };
        }),
        +this.nroActa
      )
      .subscribe({
        next: response => {
          let goods = '';
          this.selectedsForUpdate.forEach((selected, index) => {
            goods +=
              selected.numberGood +
              (index < this.selectedsForUpdate.length - 1 ? ',' : '');
          });
          const message = `Se actualizaron los bienes N° ${goods} `;
          this.onLoadToast('success', 'Exito', message);
          this.updateTable.emit();
        },
        error: err => {
          this.onLoadToast('error', 'Error', 'Bienes no actualizados');
        },
      });
  }
}
