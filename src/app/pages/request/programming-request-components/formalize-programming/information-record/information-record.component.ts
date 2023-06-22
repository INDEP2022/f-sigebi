import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGeneric } from 'src/app/core/models/catalogs/generic.model';
import { Iprogramming } from 'src/app/core/models/good-programming/programming';
import { IProceedings } from 'src/app/core/models/ms-proceedings/proceedings.model';
import { IReceipyGuardDocument } from 'src/app/core/models/receipt/receipt.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings';
import { ProgrammingGoodService } from 'src/app/core/services/ms-programming-request/programming-good.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { ReceptionGoodService } from 'src/app/core/services/reception/reception-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { EMAIL_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { environment } from 'src/environments/environment';
import { ShowReportComponentComponent } from '../../execute-reception/show-report-component/show-report-component.component';

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
  programming: Iprogramming;
  infoForm: FormGroup = new FormGroup({});
  apartOneForm: FormGroup = new FormGroup({});
  identifications = new DefaultSelect<IGeneric>();
  params = new BehaviorSubject<ListParams>(new ListParams());
  horaActual: string;
  programmingId: number = 0;
  receipts: LocalDataSource = new LocalDataSource();
  proceeding: IProceedings;
  tranType: string = '';
  urlBaseReport = `${environment.API_URL}processgoodreport/report/showReport?nombreReporte=`;
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
    private route: ActivatedRoute,
    private proceedingService: ProceedingsService,
    private transferentService: TransferenteService
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
    this.getIdentification(new ListParams());
    this.typeTransferent();
  }

  typeTransferent() {
    this.transferentService
      .getById(this.programming.tranferId)
      .subscribe(data => {
        console.log('transferent', data);
        this.tranType = data.typeTransferent;
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
      id: [this.proceeding.id],
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
      //reg_envio_sat: [null, [Validators.pattern(STRING_PATTERN)]],
      creationDate: [null, [Validators.pattern(STRING_PATTERN)]],
      emailUvfv: [null, [Validators.pattern(EMAIL_PATTERN)]],
      otherFacts: [null],
    });

    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.id'] = this.proceeding.id;
    params.getValue()['filter.idProgramming'] = this.proceeding.programmingId;
    this.proceedingService.getProceedings(params.getValue()).subscribe({
      next: response => {
        console.log('acta', response);
        this.infoForm.patchValue(response.data[0]);
      },
      error: error => {},
    });
  }
  confirm() {
    this.infoForm.value.idPrograming = Number(this.programming.id);
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

    console.log('this.infoForm.value', this.infoForm.value);

    this.proceedingService.updateProceeding(this.infoForm.value).subscribe({
      next: response => {
        this.processInfoProceeding();
      },
      error: error => {},
    });
  }

  processInfoProceeding() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    let nomReport: string = '';
    let idTypeDoc: number = 0;
    params.getValue()['filter.id'] = this.proceeding.id;
    params.getValue()['filter.idProgramming'] = this.proceeding.programmingId;
    this.proceedingService.getProceedings(params.getValue()).subscribe({
      next: response => {
        /*if (this.tranType == 'A') {
          nomReport = 'ActaAseguradosBook.jasper';
          idTypeDoc = 106;
        } else if (this.tranType == 'NO') {
          nomReport = 'Acta_VoluntariasBook.jasper';
          idTypeDoc = 107;
        } else if (this.tranType == 'CE') {
          nomReport = 'Acta_SATBook.jasper';
          idTypeDoc = 210;
        }

        if (nomReport) {
          this.loadDocument(nomReport, response.data[0].id, idTypeDoc);
        } */
      },
      error: error => {},
    });
  }

  loadDocument(nomReport: string, actId: number, typeDoc: number) {
    const idTypeDoc = typeDoc;
    const idProg = this.programming.id;
    //Modal que genera el reporte
    let config: ModalOptions = {
      initialState: {
        idTypeDoc,
        idProg,
        nomReport: nomReport,
        actId: actId,
        callback: (next: boolean) => {
          if (next) {
            //this.uplodadReceiptDelivery();
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ShowReportComponentComponent, config);
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
