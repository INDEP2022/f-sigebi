import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGeneric } from 'src/app/core/models/catalogs/generic.model';
import { Iprogramming } from 'src/app/core/models/good-programming/programming';
import { IProceedings } from 'src/app/core/models/ms-proceedings/proceedings.model';
import { IReceipyGuardDocument } from 'src/app/core/models/receipt/receipt.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { SignatoriesService } from 'src/app/core/services/ms-electronicfirm/signatories.service';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings';
import { ProgrammingGoodService } from 'src/app/core/services/ms-programming-request/programming-good.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { ReceptionGoodService } from 'src/app/core/services/reception/reception-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { EMAIL_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { environment } from 'src/environments/environment';

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
    private transferentService: TransferenteService,
    private signatoriesService: SignatoriesService
  ) {
    super();
    this.obtenerHoraActual();
  }

  ngOnInit(): void {
    console.log('proceeding', this.proceeding);
    this.prepareDevileryForm();
    this.typeTrans();
    this.getIdentification(new ListParams());
  }

  typeTrans() {
    this.transferentService
      .getById(this.programming.tranferId)
      .subscribe(data => {
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
      idPrograming: [null],
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
      bases: [null],
      evet: [null],
      startTime: [null],
    });

    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.id'] = this.proceeding.id;
    params.getValue()['filter.idProgramming'] = this.programming.id;
    this.proceedingService.getProceedings(params.getValue()).subscribe({
      next: response => {
        console.log('acta', response);
        this.infoForm.patchValue(response.data[0]);
      },
      error: error => {},
    });
  }
  confirm() {
    this.loading = true;
    if (this.infoForm.get('electronicSignatureWorker1').value == 1) {
      this.infoForm.get('electronicSignatureWorker1').setValue(1);
    } else {
      this.infoForm.get('electronicSignatureWorker1').setValue(0);
    }

    if (this.infoForm.get('electronicSignatureWorker2').value == 1) {
      this.infoForm.get('electronicSignatureWorker2').setValue(1);
    } else {
      this.infoForm.get('electronicSignatureWorker2').setValue(0);
    }

    if (this.infoForm.get('electronicSignatureWitness1').value == 1) {
      this.infoForm.get('electronicSignatureWitness1').setValue(1);
    } else {
      this.infoForm.get('electronicSignatureWitness1').setValue(0);
    }

    if (this.infoForm.get('electronicSignatureWitness2').value == 1) {
      this.infoForm.get('electronicSignatureWitness2').setValue(1);
    } else {
      this.infoForm.get('electronicSignatureWitness2').setValue(0);
    }

    if (this.infoForm.get('electronicSignatureOic').value == 1) {
      this.infoForm.get('electronicSignatureOic').setValue(1);
    } else {
      this.infoForm.get('electronicSignatureOic').setValue(0);
    }

    this.infoForm.get('startTime').setValue(this.horaActual);
    this.infoForm.get('idPrograming').setValue(this.programming.id);

    console.log('this.infoForm.value', this.infoForm.value);
    this.proceedingService.updateProceeding(this.infoForm.value).subscribe({
      next: response => {
        this.loading = false;
        this.close();
        this.modalRef.content.callback(this.proceeding, this.tranType);
        //this.processInfoProceeding();
      },
      error: error => {},
    });
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
