import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
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
import {
  ProceedingsDeliveryReceptionService,
  ProceedingsDetailDeliveryReceptionService,
} from 'src/app/core/services/ms-proceedings';
import { POSITVE_NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { AlertButton } from 'src/app/pages/judicial-physical-reception/scheduled-maintenance-1/models/alert-button';
import { secondFormatDate } from 'src/app/shared/utils/date';
import { MaintenanceRecordsService } from './../../../services/maintenance-records.service';

@Component({
  selector: 'app-good-actions',
  templateUrl: './good-actions.component.html',
  styles: [
    `
      .selectGood {
        display: flex;
        width: 100%;
        margin-left: 20px;
        column-gap: 10px;
        ng-custom-select-loading {
          width: calc(100% - 70px);
        }
      }
    `,
  ],
})
export class GoodActionsComponent extends AlertButton implements OnInit {
  @Input() statusActaValue: string;
  @Input() nroActa: string;
  @Input() rowsSelected: IDetailProceedingsDeliveryReception[] = [];
  @Output() updateTable = new EventEmitter();
  @Output() addGoodEvent =
    new EventEmitter<IDetailProceedingsDeliveryReception>();
  form: FormGroup;
  loading = false;
  selectedsForUpdate: IDetailProceedingsDeliveryReception[] = [];
  // dataForAdd: IDetailProceedingsDeliveryReception[] = [];
  selectedGood: any;
  @ViewChild('actaLabel') actaLabel: TemplateRef<any>;
  @ViewChild('actaOption') actaOption: TemplateRef<any>;
  paramsGoods = new FilterParams();
  operatorGoods = SearchFilter.IN;
  paramsControl = new FilterParams();

  // totalItems = 0;
  settings = { ...TABLE_SETTINGS };
  constructor(
    private fb: FormBuilder,
    private service: MaintenanceRecordsService,
    private detailService: ProceedingsDetailDeliveryReceptionService,
    private goodTrackerService: GoodTrackerService,
    private modalService: BsModalService,
    private goodService: GoodService,
    private statusGoodService: StatusGoodService,
    private proceedingService: ProceedingsDeliveryReceptionService
  ) {
    super();
    this.form = this.fb.group({
      goodId: [null],
      action: [null],
    });
  }

  ngOnInit(): void {
    // this.paramsControl.addFilter('status', 'status', SearchFilter.LIKE);
  }

  get data() {
    return this.service.data.concat(this.service.dataForAdd);
  }

  get dataForAdd() {
    return this.service.dataForAdd;
  }

  get goodsList() {
    return this.goodTrackerService.getAll(this.paramsGoods.getParams());
  }

  get rowsSelectedNotLocal() {
    return this.rowsSelected.filter(x => !x.createdLocal);
  }

  selectGood(good: any) {
    console.log(good);
    this.selectedGood = good;
  }

  addGood() {
    // console.log(row);
    // debugger;
    const newGood: IDetailProceedingsDeliveryReception = {
      numberProceedings: +this.nroActa,
      numberGood: this.form.get('goodId').value,
      amount: this.selectedGood.quantity,
      received: 'S',
      approvedDateXAdmon: secondFormatDate(new Date()),
      approvedXAdmon: 'S',
      approvedUserXAdmon: localStorage.getItem('username'),
      dateIndicatesUserApproval: secondFormatDate(new Date()),
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
      warehouse: this.selectedGood.warehouseNumber,
      vault: this.selectedGood.vaultNumber,
      createdLocal: true,
    };
    this.detailService.create(newGood).subscribe({
      next: response => {
        this.onLoadToast('success', 'Bien', 'Agregado exitosamente');
        this.updateTable.emit();
      },
      error: err => {
        let message = 'No se pudo agregar el bien';
        if (err.message === 'El registro ya existe.') {
          message = 'Bien ya registrado';
        }
        this.onLoadToast('error', 'Error', message);
      },
    });

    // const goodForAdd = this.dataForAdd.findIndex(
    //   x => x.numberGood === this.form.get('goodId').value
    // );

    // if (goodForAdd === -1) {
    //   this.dataForAdd.push({
    //     numberProceedings: +this.nroActa,
    //     numberGood: this.form.get('goodId').value,
    //     amount: this.selectedGood.quantity,
    //     received: 'S',
    //     approvedDateXAdmon: firstFormatDate(new Date()),
    //     approvedXAdmon: 'S',
    //     approvedUserXAdmon: localStorage.getItem('username'),
    //     dateIndicatesUserApproval: firstFormatDate(new Date()),
    //     numberRegister: null,
    //     reviewIndft: null,
    //     correctIndft: null,
    //     idftUser: null,
    //     idftDate: null,
    //     numDelegationIndft: null,
    //     yearIndft: null,
    //     monthIndft: null,
    //     idftDateHc: null,
    //     packageNumber: null,
    //     exchangeValue: null,
    //     warehouse: this.selectedGood.warehouseNumber,
    //     vault: this.selectedGood.vaultNumber,
    //     createdLocal: true,
    //   });
    // } else {
    //   this.dataForAdd[goodForAdd].amount =
    //     +(this.selectedGood.quantity + '') +
    //     +(this.dataForAdd[goodForAdd].amount + '');
    // }
    // this.service.dataForAdd = [...this.service.dataForAdd];
  }

  openModals() {
    console.log(this.rowsSelected, this.form.value);
    // this.openModalSelect(
    //   {
    //     titleColumnToReplace: 'estados',
    //     columnsType: {
    //       numberGood: {
    //         title: 'N° Bien',
    //         type: 'string',
    //         sort: false,
    //       },
    //       status: {
    //         title: 'Estatus',
    //         type: 'string',
    //         sort: false,
    //       },
    //     },
    //     settings: { ...TABLE_SETTINGS },
    //     tableData: this.rowsSelected,
    //     service: this.statusGoodService,
    //     dataObservableFn: this.statusGoodService.getAllSelf,
    //     idSelect: 'status',
    //     labelSelect: 'status',
    //     paramFilter: 'status',
    //     operator: SearchFilter.ILIKE,
    //     form: this.fb.group({
    //       status: [null, [Validators.required]],
    //       justification: [null, [Validators.required]],
    //     }),
    //     formField: 'status',
    //     otherFormField: 'justification',
    //     otherFormLabel: 'Motivo del cambio',
    //   },
    //   this.replaceStatus
    // );
    if (this.form.get('action').value == '1') {
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
          // service: this.proceedingService,
          // dataObservableFn: this.proceedingService.getAll2,
          labelTemplate: this.actaLabel,
          optionTemplate: this.actaOption,
          idSelect: 'id',
          labelSelect: 'keysProceedings',
          label: 'Acta',
          paramSearch: 'filter.keysProceedings',
          prefixSearch: '$ilike',
          path: 'proceeding/api/v1/proceedings-delivery-reception',
          form: this.fb.group({
            numberProceedings: [
              null,
              [
                Validators.required,
                Validators.pattern(POSITVE_NUMBERS_PATTERN),
              ],
            ],
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
          label: 'Estatus del bien',
          tableData: this.rowsSelected,
          path: 'good/api/v1/status-good',
          idSelect: 'status',
          labelSelect: 'status',
          paramSearch: 'filter.status',
          prefixSearch: '$ilike',
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

  replaceProceeding(
    newValue: { numberProceedings: string },
    self: GoodActionsComponent
  ) {
    // debugger
    const goods = self.rowsSelected.map(good => good.numberGood);
    let message = '';
    goods.forEach((good, index) => {
      message += good + (index < goods.length - 1 ? ',' : '');
    });
    self.changeGoodsAct(message, newValue.numberProceedings);
  }

  changeGoodsAct(message: string, numberProceedings: string) {
    this.proceedingService
      .createMassiveDetail(
        this.rowsSelected.map(x => {
          return {
            ...x,
            numberProceedings: +numberProceedings,
            numberGood: +(x.numberGood + ''),
          };
        })
      )
      .subscribe({
        next: response => {
          // debugger;
          this.proceedingService
            .deleteMassiveDetails(this.rowsSelected)
            .subscribe({
              next: response => {
                // debugger;
                this.onLoadToast('success', 'Bienes Actualizados', message);
                this.updateTable.emit();
              },
            });
        },
      });
  }

  replaceStatus(
    newValue: { status: string; justification: string },
    self: GoodActionsComponent
  ) {
    const goods = self.rowsSelected.map(good => good.numberGood);
    let message = '';
    goods.forEach((good, index) => {
      message += good + (index < goods.length - 1 ? ',' : '');
    });
    self.updateGoodStatusMassive(goods, newValue.status, message);
  }

  updateGoodStatusMassive(goods: number[], status: string, message: string) {
    this.goodService.updateGoodStatusMassive(goods, status).subscribe({
      next: response => {
        this.onLoadToast('success', 'Estados Actualizados', message);
        this.updateTable.emit();
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
    this.service.dataForAdd = this.selectedsForUpdate.filter(
      x => x.createdLocal
    );
    this.detailService
      .updateMasive(
        this.selectedsForUpdate
          .filter(x => !x.createdLocal)
          .map(item => {
            return {
              fec_aprobacion_x_admon: item.approvedDateXAdmon + '',
              fec_indica_usuario_aprobacion:
                item.dateIndicatesUserApproval + '',
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
