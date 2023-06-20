import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGeneric } from 'src/app/core/models/catalogs/generic.model';
import { Iformalizeprogramming } from 'src/app/core/models/ms-proceedings/formalize-programming.model';
import { IProceedings } from 'src/app/core/models/ms-proceedings/proceedings.model';
import { IReceipyGuardDocument } from 'src/app/core/models/receipt/receipt.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings';
import { ProgrammingGoodService } from 'src/app/core/services/ms-programming-request/programming-good.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { ReceptionGoodService } from 'src/app/core/services/reception/reception-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { EMAIL_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { PrintReportModalComponent } from '../print-report-modal/print-report-modal.component';

@Component({
  selector: 'app-information-record',
  templateUrl: './information-record.component.html',
  styles: [],
})
export class InformationRecordComponent extends BasePage implements OnInit {
  receiptId: number;
  actaId: number;
  receiptGuards: any;
  goodId: string = '';
  proceess: string = '';
  programming: IProceedings;
  infoForm: FormGroup = new FormGroup({});
  identifications = new DefaultSelect<IGeneric>();
  params = new BehaviorSubject<ListParams>(new ListParams());
  horaActual: string;
  programmingId: number = 0;
  receipts: LocalDataSource = new LocalDataSource();
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private genericService: GenericService,
    // private receptionGoodService: ReceptionGoodService,
    private authService: AuthService,
    private programmingsService: ProceedingsService,
    private wContentService: WContentService,
    private modalService: BsModalService,
    private programmingGoodService: ProgrammingGoodService,
    private activatedRoute: ActivatedRoute,
    private receptionGoodService: ReceptionGoodService,
    private route: ActivatedRoute
  ) {
    super();
    this.obtenerHoraActual();
    this.programmingId = this.activatedRoute.snapshot.paramMap.get(
      'id'
    ) as unknown as number;
    this.programmingId = this.route.snapshot.queryParams['programingId'];
  }

  ngOnInit(): void {
    this.prepareDevileryForm();
    this.getReceipts();
    this.route.params.subscribe(params => {
      const programmingId = params['programmingId'];
      console.log('ingreso', programmingId); // Debería imprimir '8451'
    });
    console.log('paraMSsssss', this.params);
  }
  getReceipts() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.programmingId'] = this.programmingId;
    console.log('programming24', this.programmingId);
    this.receptionGoodService.getReceipt(params.getValue()).subscribe({
      next: response => {
        this.receipts.load(response.data);
      },
      error: error => {
        this.receipts = new LocalDataSource();
      },
    });
  }
  obtenerHoraActual() {
    const fechaActual = new Date();
    const opcionesHora: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
    };
    this.horaActual = fechaActual.toLocaleTimeString([], opcionesHora);
  }
  prepareDevileryForm() {
    this.infoForm = this.fb.group({
      nameWorker1: [null, [Validators.pattern(STRING_PATTERN)]],
      electronicSignatureWorker1: [null],
      positionWorker1: [null, [Validators.pattern(STRING_PATTERN)]],
      residentialWorker1: [null, [Validators.pattern(STRING_PATTERN)]],
      idCatWorker1: [null],
      idNoWorker1: [null],
      idExpWorker1: [null, [Validators.pattern(STRING_PATTERN)]],
      emailWorker1: [null, [Validators.pattern(EMAIL_PATTERN)]],
      //---------------------------------
      nameWorker2: [null, [Validators.pattern(STRING_PATTERN)]],
      electronicSignatureWorker2: [null],
      positionWorker2: [null, [Validators.pattern(STRING_PATTERN)]],
      idCatWorker2: [null],
      idNoWorker2: [null],
      idExpWorker2: [null, [Validators.pattern(STRING_PATTERN)]],
      emailWorker2: [null, [Validators.pattern(EMAIL_PATTERN)]],
      //-----------------------------------------
      nameWitness1: [null, [Validators.pattern(STRING_PATTERN)]],
      electronicSignatureWitness1: [null],
      idCatWitness1: [null],
      idNoWitness1: [null],
      emailWitness1: [null, [Validators.pattern(EMAIL_PATTERN)]],
      //------------------------------------------
      nameWitness2: [null, [Validators.pattern(STRING_PATTERN)]],
      electronicSignatureWitness2: [null],
      idCatWitness2: [null],
      idNoWitness2: [null],
      emailWitness2: [null, [Validators.pattern(EMAIL_PATTERN)]],
      //-----------------------------------
      nameWorker3: [null, [Validators.pattern(STRING_PATTERN)]],
      nameWorkerOic: [null, [Validators.pattern(STRING_PATTERN)]],
      electronicSignatureOic: [null],
      positionWorkerOic: [null, [Validators.pattern(STRING_PATTERN)]],
      idCatWorkerOic: [null],
      idNoWorkerOic: [null],
      idExpWorkerOic: [null, [Validators.pattern(STRING_PATTERN)]],
      emailOic: [null, [Validators.pattern(EMAIL_PATTERN)]],
      //------------------------------------
      nameWorker4: [null, [Validators.pattern(STRING_PATTERN)]],
      // electronicSignatureUvfv: [null],
      positionWorker4: [null, [Validators.pattern(STRING_PATTERN)]],
      nameWorkerUvfv: [null, [Validators.pattern(STRING_PATTERN)]],
      // identification: [null],
      positionWorkerUvfv: [null],
      nocargo_funcionario_uvfv: [null, [Validators.pattern(STRING_PATTERN)]],
      creationDate: [null, [Validators.pattern(STRING_PATTERN)]],
      emailUvfv: [null, [Validators.pattern(EMAIL_PATTERN)]],
    });
    this.params.getValue()['filter.id'] = this.receiptId;

    this.programmingsService.getProceedings(this.params.getValue()).subscribe({
      next: response => {
        console.log('data1', response);
        this.infoForm.patchValue(response.data[0]);
      },
      error: error => {},
    });
  }
  confirm() {
    console.log('this.form', this.infoForm.value);
    this.infoForm.value.idPrograming = Number(this.programmingId);
    this.infoForm.value.electronicSignatureWorker1 = this.infoForm.value
      .electronicSignatureWorker1
      ? 1
      : 0;
    this.infoForm.value.electronicSignatureWorker2 = this.infoForm.value
      .electronicSignatureWorker2
      ? 1
      : 0;
    this.infoForm.value.electronicSignatureWitness1 = this.infoForm.value
      .electronicSignatureWitness1
      ? 1
      : 0;
    this.infoForm.value.electronicSignatureWitness2 = this.infoForm.value
      .electronicSignatureWitness2
      ? 1
      : 0;
    this.infoForm.value.electronicSignatureOic = this.infoForm.value
      .electronicSignatureOic
      ? 1
      : 0;

    this.programmingsService.createProceedings(this.infoForm.value).subscribe({
      next: async response => {
        console.log('actualizo recibo', response);
        this.openReport(response);
      },
      error: error => {
        console.log();
      },
    });
  }
  openReport(response: Iformalizeprogramming) {
    const idReportAclara = this.actaId;
    console.log('openreport', this.receiptId, this.proceess);
    if (this.proceess == 'acta') {
      const idTypeDoc = 106;
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
    } else {
      const idTypeDoc = 107;
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
    this.programmingsService.getProceedings(params.getValue()).subscribe({
      next: response => {
        response.data.map((item: IProceedings) => {
          this.goodId += item.programmingId + ' ';
        });

        let token = this.authService.decodeToken();
        console.log('goodId', this.goodId);
        const modelReport: IReceipyGuardDocument = {
          keyDoc: this.receiptGuards.id,
          autografos: true,
          electronicos: false,
          dDocTitle: 'ReciboResguardo',
          dSecurityGroup: 'Public',
          // xidTransferente: this.programming.tranferId,
          xidBien: this.goodId,
          xNivelRegistroNSBDB: 'Bien',
          xTipoDocumento: 185,
          xNoProgramacion: this.programming.id,
          xNombreProceso: 'Ejecutar Recepción',
          // xDelegacionRegional: this.programming.regionalDelegationNumber,
          // xFolioProgramacion: this.programming.folio,
        };
        //this.wContentService.addDocumentToContent();
        console.log('modelReport', modelReport);
      },
      error: error => {},
    });
  }
  close() {
    this.modalRef.hide();
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
}
