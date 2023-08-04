import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IGoodResDevInvView } from 'src/app/core/models/ms-goodsinv/goodsinv.model';
import { IGoodsResDev } from 'src/app/core/models/ms-rejectedgood/goods-res-dev-model';
import { RejectedGoodService } from 'src/app/core/services/ms-rejected-good/rejected-good.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-reserve-good-modal',
  templateUrl: './reserve-good-modal.component.html',
  styles: [],
})
export class ReserveGoodModalComponent extends BasePage implements OnInit {
  title: string = 'Seleccione la Cantidad a Reservar';
  good: IGoodResDevInvView;
  reserveForm: FormGroup = new FormGroup({});
  @Output() onReserve = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private rejectedGoodService: RejectedGoodService
  ) {
    super();
  }

  ngOnInit(): void {
    console.log('good', this.good);
    this.prepareForm();
  }

  private prepareForm(): void {
    this.reserveForm = this.fb.group({
      reserve: [
        null,
        [
          Validators.required,
          Validators.min(1),
          //alidators.max(parseInt(String(this.good.quantity))),
        ],
      ],
    });
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.handleSuccess();
  }

  handleSuccess() {
    this.loading = true;
    // Llamar servicio para agregar caratula
    this.loading = false;
    let availableAmount: number =
      parseInt(String(this.good.quantity)) -
      parseInt(this.reserveForm.controls['reserve'].value);
    const data = {
      amount: availableAmount,
      amountToReserve: this.reserveForm.controls['reserve'].value,
    };

    if (
      this.good.decimalQuantity == 'N' &&
      this.reserveForm.controls['reserve'].value % 1 != 0
    ) {
      this.onLoadToast(
        'info',
        'Para este bien no se permiten numeros decimales'
      );
      return;
    }

    let goodResDev: IGoodsResDev = {};
    goodResDev.applicationId = this.good.solicitudId;
    goodResDev.goodId = this.good.goodId;
    goodResDev.inventoryNumber = this.good.inventoryNum;
    goodResDev.jobNumber = this.good.officeNum;
    goodResDev.proceedingsId = this.good.fileId;
    goodResDev.proceedingsType = this.good.fileType;
    goodResDev.uniqueKey = this.good.uniqueKey;
    goodResDev.descriptionGood = this.good.goodDescription;
    goodResDev.unitExtent = this.good.unitMeasurement;
    goodResDev.amountToReserve = this.good.quantity;
    goodResDev.amount = this.reserveForm.controls['reserve'].value;
    goodResDev.statePhysical = this.good.physicalStatus;
    goodResDev.stateConservation = this.good.conservationStatus;
    goodResDev.fractionId = this.good.fractionId;
    goodResDev.relevantTypeId = this.good.typeRelevantId;
    goodResDev.destination = this.good.destination;
    goodResDev.delegationRegionalId = this.good.regionalDelegationId;
    goodResDev.cveState = this.good.stateKey;
    goodResDev.transfereeId = this.good.transferId;
    goodResDev.stationId = this.good.stationId;
    goodResDev.authorityId = this.good.authorityId;
    goodResDev.codeStore = this.good.warehouseCode;
    goodResDev.proceedingsType = this.good.fileType;
    goodResDev.locatorId = this.good.locatorId;
    goodResDev.inventoryItemId = this.good.inventoryItemId;
    goodResDev.organizationId = this.good.organizationId;
    goodResDev.invoiceRecord = this.good.folioAct;
    goodResDev.subinventory = this.good.destination;
    goodResDev.origin = this.good.origin;
    goodResDev.naturalness =
      this.good.inventoryNum != null ? 'INVENTARIOS' : 'GESTION';

    /*this.onLoadToast('success','Se agrego el bien');
    this.onReserve.emit(goodResDev);
    this.modalRef.hide();*/
    this.rejectedGoodService.createGoodsResDev(goodResDev).subscribe({
      next: resp => {
        debugger;
        this.onLoadToast('success', 'Se agrego el bien');
        this.onReserve.emit(resp);
        this.modalRef.hide();
      },
      error: error => {
        this.onLoadToast('error', 'No se pudo crear el bien');
        console.log(error);
      },
    });

    /*this.onReserve.emit({
      ...this.good,
      ...this.reserveForm.value,
      reservedAmount: this.reserveForm.controls['reserve'].value,
      availableAmount,
    }); */
    //
  }
}
