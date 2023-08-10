import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
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
import { SignatoriesService } from 'src/app/core/services/ms-electronicfirm/signatories.service';
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
    private modalService: BsModalService,
    private signatoriesService: SignatoriesService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getIdentification(new ListParams());
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
      officialSeg: [null, [Validators.required]],
      chargeSeg: [null, [Validators.required]],
      catIdFuncSeg: [null, [Validators.required]],
      noIdFuncSeg: [null, [Validators.required]],
      expIdFuncSeg: [null],
      officialSae: [null, [Validators.required]],
      chargeSae: [null, [Validators.required]],
      contractNumber: [null],
      vigencia: [null],
      receiptDate: [null],
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
    const now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    this.form.get('receiptDate').setValue(now);

    this.receptionGoodService
      .updateReceiptGuard(this.receiptId, this.form.value)
      .subscribe({
        next: async response => {
          this.modalRef.content.callback(this.receiptGuards);
          this.modalRef.hide();
          //this.openReport(response);
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
          process: this.proceess,
          programming: this.programming,
          receiptGuards: this.receiptGuards,
          callback: (next: boolean) => {
            if (next) {
              //this.changeStatusAnswered();
            } else {
            }
          },
        },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      };
      this.modalService.show(PrintReportModalComponent, config);
    } else {
      /*const idTypeDoc = 185;
      let config: ModalOptions = {
        initialState: {
          idTypeDoc,
          programming: this.programming,
          receiptGuards: this.receiptGuards,
          callback: (next: boolean) => {
            if (next) {
              //this.changeStatusAnswered();
            } else {
              console.log('Modal no cerrado');
            }
          },
        },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      };
      this.modalService.show(ShowReportComponentComponent, config); */
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
      },
      error: error => {},
    });
  }

  getIdentification(params: ListParams) {
    params['filter.name'] = 'Identificaciones';
    params['sortBy'] = 'description:ASC';
    this.genericService.getAll(params).subscribe({
      next: response => {
        this.identifications = new DefaultSelect(response.data, response.count);
      },
      error: error => {},
    });
  }

  close() {
    this.modalRef.hide();
  }
}
