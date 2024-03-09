import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IGoodResDevInvView } from 'src/app/core/models/ms-goodsinv/goodsinv.model';
import { IGoodsResDev } from 'src/app/core/models/ms-rejectedgood/goods-res-dev-model';
import { RejectedGoodService } from 'src/app/core/services/ms-rejected-good/rejected-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { isNullOrEmpty } from '../../../request-complementary-documentation/request-comp-doc-tasks/request-comp-doc-tasks.component';

@Component({
  selector: 'app-reserve-good-modal',
  templateUrl: './reserve-good-modal.component.html',
  styles: [],
})
export class ReserveGoodModalComponent extends BasePage implements OnInit {
  title: string = 'Seleccione la Cantidad a Reservar';
  good: IGoodResDevInvView;
  exitGood: any;

  requestId: number;
  reserveForm: FormGroup = new FormGroup({});
  @Output() onReserve = new EventEmitter<any>();

  processing: boolean = true;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private rejectedGoodService: RejectedGoodService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();

    if (!isNullOrEmpty(this.exitGood)) {
      this.reserveForm.controls['reserve'].setValue(this.exitGood.amount);
    }
  }

  private prepareForm(): void {
    this.reserveForm = this.fb.group({
      reserve: [
        null,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(parseInt(String(this.good.quantity))),
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
    this.processing = false;
    // Llamar servicio para agregar caratula
    //this.loading = false;
    //const ableQuantity = this.good.quantity
    //const reservedQuantity = this.reserveForm.controls['reserve'].value;

    let reserve = parseInt(this.reserveForm.controls['reserve'].value);

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

    if (!isNullOrEmpty(this.exitGood)) {
      //Validar la cantidad ingresada con la cantidad que ya se agrego

      if (this.good.quantity < reserve) {
        this.onLoadToast(
          'warning',
          'El bien ya fue agregado',
          'La cantidad a reservar no puede ser mayor a la cantidad disponible'
        );
        return;
      }

      this.exitGood.amount = reserve;
      this.exitGood.viewFile = null;

      const id = this.exitGood.goodresdevId;
      const body: any = {
        goodresdevId: id,
        amount: reserve,
      };

      this.rejectedGoodService.updateGoodsResDev(id, body).subscribe({
        next: resp => {
          this.onLoadToast('success', 'Se actualizó el bien');
          this.onReserve.emit(false);
          this.modalRef.hide();
          //this.processing = true;
        },
        error: error => {
          this.onLoadToast('error', 'No se pudo actualizar el bien');
          this.processing = true;

          console.log(error);
        },
      });

      return;
    }

    let goodResDev: IGoodsResDev = {};
    goodResDev.applicationId = this.requestId; //this.good.solicitudId;
    goodResDev.goodId = this.good.goodId;
    goodResDev.inventoryNumber = this.good.inventoryNum;
    goodResDev.jobNumber = this.good.officeNum;
    goodResDev.proceedingsId = this.good.fileId;
    goodResDev.proceedingsType = this.good.fileType;
    goodResDev.uniqueKey = this.good.uniqueKey;
    goodResDev.descriptionGood = this.good.descriptionGood;
    goodResDev.unitExtent = this.good.unitMeasurement;
    goodResDev.amountToReserve = this.good.quantity;
    goodResDev.applicationResDevId = goodResDev.applicationId;
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

    /*this.onLoadToast('success','Se agregó el bien');
    this.onReserve.emit(goodResDev);
    this.modalRef.hide();*/
    console.log(goodResDev);
    this.rejectedGoodService.createGoodsResDev(goodResDev).subscribe({
      next: resp => {
        this.onLoadToast('success', 'Se agregó el bien');
        this.onReserve.emit(resp);
        this.modalRef.hide();
        //this.processing = true;
      },
      error: error => {
        this.onLoadToast('error', 'No se pudo crear el bien');
        this.processing = true;

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
  numericOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
