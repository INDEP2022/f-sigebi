import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
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
  typeFirm: string = '';

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
      celebrates: [null],
      closingDate: [null],
    });

    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.id'] = this.proceeding.id;
    params.getValue()['filter.idPrograming'] = this.programming.id;
    params.getValue()['filter.statusProceeedings'] = 'ABIERTO';

    this.proceedingService.getProceedings(params.getValue()).subscribe({
      next: response => {
        this.infoForm.get('nameWorker1').setValue(response.data[0].nameWorker1);

        if (response.data[0].electronicSignatureWorker1 == 1) {
          this.infoForm
            .get('electronicSignatureWorker1')
            .setValue(response.data[0].electronicSignatureWorker1);
        }

        this.infoForm
          .get('positionWorker1')
          .setValue(response.data[0].positionWorker1);
        this.infoForm
          .get('residentialWorker1')
          .setValue(response.data[0].residentialWorker1);

        this.infoForm
          .get('idCatWorker1')
          .setValue(response.data[0].idCatWorker1);

        this.infoForm.get('idNoWorker1').setValue(response.data[0].idNoWorker1);
        this.infoForm
          .get('idExpWorker1')
          .setValue(response.data[0].idExpWorker1);
        this.infoForm
          .get('emailWorker1')
          .setValue(response.data[0].emailWorker1);

        this.infoForm.get('nameWorker2').setValue(response.data[0].nameWorker2);

        if (response.data[0].electronicSignatureWorker2 == 1) {
          this.infoForm
            .get('electronicSignatureWorker2')
            .setValue(response.data[0].electronicSignatureWorker2);
        }

        this.infoForm
          .get('positionWorker2')
          .setValue(response.data[0].positionWorker2);

        this.infoForm
          .get('idCatWorker2')
          .setValue(response.data[0].idCatWorker2);

        this.infoForm.get('idNoWorker2').setValue(response.data[0].idNoWorker2);
        this.infoForm
          .get('idExpWorker2')
          .setValue(response.data[0].idExpWorker2);
        this.infoForm
          .get('emailWorker2')
          .setValue(response.data[0].emailWorker2);

        this.infoForm
          .get('nameWitness1')
          .setValue(response.data[0].nameWitness1);

        if (response.data[0].electronicSignatureWitness1 == 1) {
          this.infoForm
            .get('electronicSignatureWitness1')
            .setValue(response.data[0].electronicSignatureWitness1);
        }
        this.infoForm
          .get('idCatWitness1')
          .setValue(response.data[0].idCatWitness1);
        this.infoForm
          .get('idNoWitness1')
          .setValue(response.data[0].idNoWitness1);
        this.infoForm
          .get('emailWitness1')
          .setValue(response.data[0].emailWitness1);

        this.infoForm
          .get('nameWitness2')
          .setValue(response.data[0].nameWitness2);

        if (response.data[0].electronicSignatureWitness2 == 1) {
          this.infoForm
            .get('electronicSignatureWitness2')
            .setValue(response.data[0].electronicSignatureWitness2);
        }
        this.infoForm
          .get('idCatWitness2')
          .setValue(response.data[0].idCatWitness2);
        this.infoForm
          .get('idNoWitness2')
          .setValue(response.data[0].idNoWitness2);
        this.infoForm
          .get('emailWitness2')
          .setValue(response.data[0].emailWitness2);

        this.infoForm.get('nameWorker3').setValue(response.data[0].nameWorker3);
        this.infoForm
          .get('nameWorkerOic')
          .setValue(response.data[0].nameWorkerOic);

        if (response.data[0].electronicSignatureOic == 1) {
          this.infoForm
            .get('electronicSignatureOic')
            .setValue(response.data[0].electronicSignatureOic);
        }

        this.infoForm
          .get('positionWorkerOic')
          .setValue(response.data[0].positionWorkerOic);
        this.infoForm
          .get('idCatWorkerOic')
          .setValue(response.data[0].idCatWorkerOic);
        this.infoForm
          .get('idNoWorkerOic')
          .setValue(response.data[0].idNoWorkerOic);
        this.infoForm
          .get('idExpWorkerOic')
          .setValue(response.data[0].idExpWorkerOic);
        this.infoForm.get('emailOic').setValue(response.data[0].emailOic);
        this.infoForm.get('nameWorker4').setValue(response.data[0].nameWorker4);
        this.infoForm
          .get('positionWorker4')
          .setValue(response.data[0].positionWorker4);
        this.infoForm
          .get('nameWorkerUvfv')
          .setValue(response.data[0].nameWorkerUvfv);
        this.infoForm
          .get('positionWorkerUvfv')
          .setValue(response.data[0].positionWorkerUvfv);
        this.infoForm.get('emailUvfv').setValue(response.data[0].emailUvfv);
        this.infoForm.get('otherFacts').setValue(response.data[0].otherFacts);
        this.infoForm.get('evet').setValue(response.data[0].evet);
        this.infoForm.get('startTime').setValue(response.data[0].startTime);
        this.infoForm.get('bases').setValue(response.data[0].bases);
        this.infoForm.get('celebrates').setValue(response.data[0].celebrates);

        //this.infoForm.patchValue(response.data[0]);
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
    this.infoForm
      .get('closingDate')
      .setValue(moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));

    this.infoForm.get('idPrograming').setValue(this.programming.id);

    if (
      this.infoForm.get('electronicSignatureWorker1').value == 1 &&
      this.infoForm.get('electronicSignatureWorker2').value == 0 &&
      this.infoForm.get('electronicSignatureWitness1').value == 0 &&
      this.infoForm.get('electronicSignatureWitness2').value == 0 &&
      this.infoForm.get('electronicSignatureOic').value == 0
    ) {
      this.alert(
        'error',
        'Acción Invalida',
        'Todas las firmas deben ser electronícas'
      );
      this.loading = false;
    } else if (
      this.infoForm.get('electronicSignatureWorker1').value == 0 &&
      this.infoForm.get('electronicSignatureWorker2').value == 1 &&
      this.infoForm.get('electronicSignatureWitness1').value == 0 &&
      this.infoForm.get('electronicSignatureWitness2').value == 0 &&
      this.infoForm.get('electronicSignatureOic').value == 0
    ) {
      this.alert(
        'error',
        'Acción Invalida',
        'Todas las firmas deben ser electronícas'
      );
      this.loading = false;
    } else if (
      this.infoForm.get('electronicSignatureWorker1').value == 0 &&
      this.infoForm.get('electronicSignatureWorker2').value == 0 &&
      this.infoForm.get('electronicSignatureWitness1').value == 1 &&
      this.infoForm.get('electronicSignatureWitness2').value == 0 &&
      this.infoForm.get('electronicSignatureOic').value == 0
    ) {
      this.alert(
        'error',
        'Acción Invalida',
        'Todas las firmas deben ser electronícas'
      );
      this.loading = false;
    } else if (
      this.infoForm.get('electronicSignatureWorker1').value == 0 &&
      this.infoForm.get('electronicSignatureWorker2').value == 0 &&
      this.infoForm.get('electronicSignatureWitness1').value == 0 &&
      this.infoForm.get('electronicSignatureWitness2').value == 1 &&
      this.infoForm.get('electronicSignatureOic').value == 0
    ) {
      this.alert(
        'error',
        'Acción Invalida',
        'Todas las firmas deben ser electronícas'
      );
      this.loading = false;
    } else if (
      this.infoForm.get('electronicSignatureWorker1').value == 0 &&
      this.infoForm.get('electronicSignatureWorker2').value == 0 &&
      this.infoForm.get('electronicSignatureWitness1').value == 0 &&
      this.infoForm.get('electronicSignatureWitness2').value == 0 &&
      this.infoForm.get('electronicSignatureOic').value == 1
    ) {
      this.alert(
        'error',
        'Acción Invalida',
        'Todas las firmas deben ser electronícas'
      );
      this.loading = false;
    } else if (
      this.infoForm.get('electronicSignatureWorker1').value == 0 &&
      this.infoForm.get('electronicSignatureWorker2').value == 0 &&
      this.infoForm.get('electronicSignatureWitness1').value == 0 &&
      this.infoForm.get('electronicSignatureWitness2').value == 0 &&
      this.infoForm.get('electronicSignatureOic').value == 0
    ) {
      this.typeFirm = 'autografa';
      this.proceedingService.updateProceeding(this.infoForm.value).subscribe({
        next: response => {
          this.loading = false;
          this.close();
          this.modalRef.content.callback(
            this.proceeding,
            this.tranType,
            this.typeFirm
          );
          //this.processInfoProceeding();
        },
        error: error => {},
      });
    } else if (
      this.infoForm.get('electronicSignatureWorker1').value == 1 &&
      this.infoForm.get('electronicSignatureWorker2').value == 1 &&
      this.infoForm.get('electronicSignatureWitness1').value == 1 &&
      this.infoForm.get('electronicSignatureWitness2').value == 1 &&
      this.infoForm.get('electronicSignatureOic').value == 1
    ) {
      this.typeFirm = 'electronica';
      this.proceedingService.updateProceeding(this.infoForm.value).subscribe({
        next: response => {
          this.loading = false;
          this.close();
          this.modalRef.content.callback(
            this.proceeding,
            this.tranType,
            this.typeFirm
          );
          //this.processInfoProceeding();
        },
        error: error => {},
      });
    }

    /*if (
      this.infoForm.get('electronicSignatureWorker1').value == 0 &&
      this.infoForm.get('electronicSignatureWorker2').value == 0 &&
      this.infoForm.get('electronicSignatureWitness1').value == 0 &&
      this.infoForm.get('electronicSignatureWitness2').value == 0 &&
      this.infoForm.get('electronicSignatureOic').value == 0
    ) {
      
    } else {
      this.alert(
        'error',
        'Acción Invalida',
        'Todas las firmas deben ser autografas'
      );
      this.loading = false;
    } */
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
      },
      error: error => {},
    });
  }
  close() {
    this.modalRef.hide();
  }

  getIdentification(params: ListParams) {
    params['filter.name'] = 'Identificaciones';
    params['sortBy'] = 'description:ASC';
    this.genericService.getAll(params).subscribe({
      next: response => {
        this.identifications = new DefaultSelect(response.data, response.count);
      },
      error: error => {
        this.identifications = new DefaultSelect();
      },
    });
  }

  SignatureWorker1Select() {
    const signatureWorker1 = this.infoForm.get(
      'electronicSignatureWorker1'
    ).value;

    if (signatureWorker1) {
      this.infoForm.get('electronicSignatureWorker2').setValue(true);
      this.infoForm.get('electronicSignatureWitness1').setValue(true);
      this.infoForm.get('electronicSignatureWitness2').setValue(true);
      this.infoForm.get('electronicSignatureOic').setValue(true);
    } else {
      this.infoForm.get('electronicSignatureWorker2').setValue(false);
      this.infoForm.get('electronicSignatureWitness1').setValue(false);
      this.infoForm.get('electronicSignatureWitness2').setValue(false);
      this.infoForm.get('electronicSignatureOic').setValue(false);
    }
  }

  SignatureWorker2Select() {
    const signatureWorker2 = this.infoForm.get(
      'electronicSignatureWorker2'
    ).value;

    if (signatureWorker2) {
      this.infoForm.get('electronicSignatureWorker1').setValue(true);
      this.infoForm.get('electronicSignatureWitness1').setValue(true);
      this.infoForm.get('electronicSignatureWitness2').setValue(true);
      this.infoForm.get('electronicSignatureOic').setValue(true);
    } else {
      this.infoForm.get('electronicSignatureWorker1').setValue(false);
      this.infoForm.get('electronicSignatureWitness1').setValue(false);
      this.infoForm.get('electronicSignatureWitness2').setValue(false);
      this.infoForm.get('electronicSignatureOic').setValue(false);
    }
  }

  SignatureWitness1Select() {
    const SignatureWitness1Select = this.infoForm.get(
      'electronicSignatureWitness1'
    ).value;

    if (SignatureWitness1Select) {
      this.infoForm.get('electronicSignatureWorker1').setValue(true);
      this.infoForm.get('electronicSignatureWorker2').setValue(true);
      this.infoForm.get('electronicSignatureWitness2').setValue(true);
      this.infoForm.get('electronicSignatureOic').setValue(true);
    } else {
      this.infoForm.get('electronicSignatureWorker1').setValue(false);
      this.infoForm.get('electronicSignatureWorker2').setValue(false);
      this.infoForm.get('electronicSignatureWitness2').setValue(false);
      this.infoForm.get('electronicSignatureOic').setValue(false);
    }
  }

  SignatureWitness2Select() {
    const SignatureWitness1Select = this.infoForm.get(
      'electronicSignatureWitness2'
    ).value;

    if (SignatureWitness1Select) {
      this.infoForm.get('electronicSignatureWorker1').setValue(true);
      this.infoForm.get('electronicSignatureWorker2').setValue(true);
      this.infoForm.get('electronicSignatureWitness1').setValue(true);
      this.infoForm.get('electronicSignatureOic').setValue(true);
    } else {
      this.infoForm.get('electronicSignatureWorker1').setValue(false);
      this.infoForm.get('electronicSignatureWorker2').setValue(false);
      this.infoForm.get('electronicSignatureWitness1').setValue(false);
      this.infoForm.get('electronicSignatureOic').setValue(false);
    }
  }

  SignatureOICSelect() {
    const electronicSignatureOic = this.infoForm.get(
      'electronicSignatureOic'
    ).value;

    if (electronicSignatureOic) {
      this.infoForm.get('electronicSignatureWorker1').setValue(true);
      this.infoForm.get('electronicSignatureWorker2').setValue(true);
      this.infoForm.get('electronicSignatureWitness1').setValue(true);
      this.infoForm.get('electronicSignatureWitness2').setValue(true);
    } else {
      this.infoForm.get('electronicSignatureWorker1').setValue(false);
      this.infoForm.get('electronicSignatureWorker2').setValue(false);
      this.infoForm.get('electronicSignatureWitness1').setValue(false);
      this.infoForm.get('electronicSignatureWitness2').setValue(false);
    }
  }
}
