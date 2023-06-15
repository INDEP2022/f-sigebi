import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGeneric } from 'src/app/core/models/catalogs/generic.model';
import { Iprogramming } from 'src/app/core/models/good-programming/programming';
import { IGood } from 'src/app/core/models/good/good.model';
import {
  IReceipyGuardDocument,
  IRecepitGuard,
} from 'src/app/core/models/receipt/receipt.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { ReceptionGoodService } from 'src/app/core/services/reception/reception-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { PrintReportModalComponent } from '../../../transfer-request/tabs/notify-clarifications-impropriety-tabs-component/print-report-modal/print-report-modal.component';

@Component({
  selector: 'app-generate-receipt-guard-form',
  templateUrl: './generate-receipt-guard-form.component.html',
  styles: [],
})
export class GenerateReceiptGuardFormComponent
  extends BasePage
  implements OnInit
{
  receiptId: number;
  receiptGuards: any;
  goodId: string = '';
  proceess: string = '';
  programming: Iprogramming;
  params = new BehaviorSubject<ListParams>(new ListParams());
  form: FormGroup = new FormGroup({});
  identifications = new DefaultSelect<IGeneric>();
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private genericService: GenericService,
    private receptionGoodService: ReceptionGoodService,
    private authService: AuthService,
    private wContentService: WContentService,
    private modalService: BsModalService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getIdentification(new ListParams());
    console.log('proceso', this.proceess);
  }

  prepareForm() {
    this.form = this.fb.group({
      id: [this.receiptId],
      nameWitnessOne: [null],
      catIdWitnessOne: [null],
      noIdWitnessOne: [null],
      expIdWitnessIne: [null],
      nameWitnessTwo: [null],
      catIdWitnessTwo: [null],
      noIdWitnessTwo: [null],
      expIdWitnessTwo: [null],
      officialSeg: [null],
      chargeSeg: [null],
      catIdFuncSeg: [null],
      noIdFuncSeg: [null],
      expIdFuncSeg: [null],
      officialSae: [null],
      chargeSae: [null],
      contractNumber: [null],
      vigencia: [null],
    });
    this.params.getValue()['filter.id'] = this.receiptId;
    this.receptionGoodService.getReceptions(this.params.getValue()).subscribe({
      next: response => {
        this.form.patchValue(response.data[0]);
      },
      error: error => {},
    });
  }

  confirm() {
    console.log('this.form', this.form.value);
    this.receptionGoodService
      .updateReceiptGuard(this.receiptId, this.form.value)
      .subscribe({
        next: async response => {
          console.log('actualizo recibo', response);
          await this.openReport(response);
        },
        error: error => {
          console.log();
        },
      });
  }

  openReport(response: IRecepitGuard) {
    const idReportAclara = this.receiptId;
    if (this.proceess == 'warehouse') {
      const idTypeDoc = 186;
      let config: ModalOptions = {
        initialState: {
          idTypeDoc,
          idReportAclara,
          callback: (next: boolean) => {
            if (next) {
              console.log('Modal cerrado');
              //this.changeStatusAnswered();
            } else {
              console.log('Modal no cerrado');
            }
          },
        },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      };
      this.modalService.show(PrintReportModalComponent, config);
    } else {
      const idTypeDoc = 185;
      let config: ModalOptions = {
        initialState: {
          idTypeDoc,
          idReportAclara,
          process: this.proceess,
          receiptGuards: this.receiptGuards,
          callback: (next: boolean) => {
            if (next) {
              console.log('Modal cerrado');
              //this.changeStatusAnswered();
            } else {
              console.log('Modal no cerrado');
            }
          },
        },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      };
      this.modalService.show(PrintReportModalComponent, config);
    }
  }

  createDocument() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.receiptGuardId'] = this.receiptId;
    this.receptionGoodService.getReceptionGoods(params.getValue()).subscribe({
      next: response => {
        response.data.map((item: IGood) => {
          this.goodId += item.idGood + ' ';
        });

        let token = this.authService.decodeToken();
        console.log('goodId', this.goodId);
        const modelReport: IReceipyGuardDocument = {
          keyDoc: this.receiptGuards.id,
          autografos: true,
          electronicos: false,
          dDocTitle: 'ReciboResguardo',
          dSecurityGroup: 'Public',
          xidTransferente: this.programming.tranferId,
          xidBien: this.goodId,
          xNivelRegistroNSBDB: 'Bien',
          xTipoDocumento: 185,
          xNoProgramacion: this.programming.id,
          xNombreProceso: 'Ejecutar Recepción',
          xDelegacionRegional: this.programming.regionalDelegationNumber,
          xFolioProgramacion: this.programming.folio,
        };
        //this.wContentService.addDocumentToContent();
        console.log('modelReport', modelReport);
      },
      error: error => {},
    });
  }

  getIdentification(params: ListParams) {
    params['filter.name'] = 'Identificaciones';
    this.genericService.getAll(params).subscribe({
      next: response => {
        console.log('response', response);
        this.identifications = new DefaultSelect(response.data, response.count);
      },
      error: error => {},
    });
  }

  close() {
    this.modalRef.hide();
  }
}
