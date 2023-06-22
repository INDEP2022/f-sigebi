/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { Example } from 'src/app/core/models/catalogs/example';

/** SERVICE IMPORTS */
import { ExampleService } from 'src/app/core/services/catalogs/example.service';

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { DocumentsViewerByFolioComponent } from 'src/app/@standalone/modals/documents-viewer-by-folio/documents-viewer-by-folio.component';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { IDescriptionByNoGoodBody } from 'src/app/core/models/good/good.model';
import { IAppointmentDepositary } from 'src/app/core/models/ms-depositary/ms-depositary.interface';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { IGood } from 'src/app/core/models/ms-good/good';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import {
  CURP_PATTERN,
  NUM_POSITIVE,
  PHONE_PATTERN,
  RFC_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { IGlobalVars } from 'src/app/shared/global-vars/models/IGlobalVars.model';
import { GlobalVarsService } from 'src/app/shared/global-vars/services/global-vars.service';
import { AppointmentsAdministrativeReportComponent } from '../appointments-administrative-report/appointments-administrative-report.component';
import { AppointmentsJuridicalReportComponent } from '../appointments-juridical-report/appointments-juridical-report.component';
import { AppointmentsRelationsPaysComponent } from '../appointments-relations-pays/appointments-relations-pays.component';
import { ModalScanningFoilAppointmentTableComponent } from '../modal-scanning-foil/modal-scanning-foil.component';
import { AppointmentsService } from '../services/appointments.service';
import { RELATED_FOLIO_COLUMNS } from './columns';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss'],
})
export class AppointmentsComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  items = new DefaultSelect<Example>();
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  public form: FormGroup;
  formScan: FormGroup;
  formRadioScan: FormGroup;
  public noBienReadOnly: number = null;
  public checked = false;
  globalVars_A: any = {
    noExiste: 0,
    depositaria: '',
    no_dep: '',
    folescaneo: '',
    procgenimg: 0,
    folsoldigt: 0,
    folescaneo2: null,
  };
  globalVars: any;
  public good: IGood;
  noBien: number = null;
  depositaryAppointment: IAppointmentDepositary;
  // Loadings
  loadingGood: boolean = false;
  loadingAppointment: boolean = false;
  showScanForm: boolean = false;
  // Selects
  delegations = new DefaultSelect();
  delegationSelectValue: string = '';
  locality = new DefaultSelect();
  localitySelectValue: string = '';
  state = new DefaultSelect();
  stateSelectValue: string = '';
  postalCode = new DefaultSelect();
  postalCodeSelectValue: string = '';
  dateFormat: string = 'dd/MM/yyyy';
  screenKey: string = 'FACTJURREGDESTLEG';
  showScanRadio: boolean = false;
  valuesChangeRadio = {
    lv_VALESCAN: 0,
    lv_TIPOFOL: '',
  };

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private exampleService: ExampleService,
    private appointmentsService: AppointmentsService,
    private documentsService: DocumentsService,
    private modalService: BsModalService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private siabService: SiabService,
    private globalVarsService: GlobalVarsService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.globalVarsService
      .getGlobalVars$()
      .subscribe((globalVars: IGlobalVars) => {
        this.globalVars = {
          ...this.globalVars_A,
          ...globalVars,
        };
        console.log(this.globalVars);
      });
    this.showScanForm = true;
    console.log(this.showScanForm);

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      if (!isNaN(Number(id))) {
        this.noBienReadOnly = Number(id);
        this.form.get('noBien').setValue(this.noBienReadOnly);
        this.validGoodNumberInDepositaryAppointment();
      } else {
        this.alert(
          'warning',
          'Número de Bien',
          'El número de Bien ingresado como parámetro no es un número'
        );
      }
    }
    // this.validGoodNumberInDepositaryAppointment(); // Buscar Bien
  }
  private prepareForm() {
    this.form = this.fb.group({
      noBien: [
        { value: '', disabled: false },
        [
          Validators.required,
          Validators.maxLength(11),
          Validators.pattern(NUM_POSITIVE),
        ],
      ], //*
      descriptionGood: [
        { value: '', disabled: true },
        [Validators.maxLength(1250), Validators.pattern(STRING_PATTERN)],
      ], //*
      noExpedient: [
        { value: '', disabled: true },
        [Validators.maxLength(30), Validators.pattern(NUM_POSITIVE)],
      ], //*
      averiguacionPrevia: [
        { value: '', disabled: true },
        [Validators.maxLength(200), Validators.pattern(STRING_PATTERN)],
      ], //*
      causaPenal: [
        { value: '', disabled: true },
        [Validators.maxLength(40), Validators.pattern(STRING_PATTERN)],
      ], //*

      fechaAcuerdoAsegurado: [
        { value: '', disabled: true },
        [Validators.maxLength(11)],
      ], //* ACUERDO ASEGURADO
      fechaRecepcion: [
        { value: '', disabled: true },
        [Validators.maxLength(11)],
      ], //* Recepcion SERA
      estatusBien: [
        { value: '', disabled: true },
        [Validators.maxLength(500), Validators.pattern(STRING_PATTERN)],
      ], //*
      fechaDecomiso: [
        { value: '', disabled: true },
        [Validators.maxLength(11)],
      ], //* DECOMISO

      tipoNombramiento: [
        { value: 'D', disabled: true },
        [Validators.maxLength(1), Validators.pattern(STRING_PATTERN)],
      ], //*
      ///*"Administrador, Depositaría, Interventor, Comodatarío,Bien en uso del SAE"
      tipoDepositaria: [
        { value: '', disabled: true },
        [Validators.maxLength(40), Validators.pattern(STRING_PATTERN)],
      ], //*
      estatus: [
        { value: 'P', disabled: true },
        [Validators.maxLength(1), Validators.pattern(STRING_PATTERN)],
      ], //* Provisional, Definitiva
      representanteSAE: [
        { value: '', disabled: true },
        [Validators.maxLength(100), Validators.pattern(STRING_PATTERN)],
      ], //*
      nombre: [
        { value: '', disabled: true },
        [Validators.maxLength(100), Validators.pattern(STRING_PATTERN)],
      ], //* Representante SERA
      bienesMenaje: { value: '', disabled: true }, //* Sin Menaje, Con Menaje

      depositaria: [
        { value: '', disabled: true },
        [Validators.maxLength(40), Validators.pattern(STRING_PATTERN)],
      ], //*
      representante: [
        { value: '', disabled: true },
        [Validators.maxLength(120), Validators.pattern(STRING_PATTERN)],
      ], //*

      calle: [
        { value: '', disabled: true },
        [Validators.maxLength(200), Validators.pattern(STRING_PATTERN)],
      ], //*
      noExterno: [
        { value: '', disabled: true },
        [Validators.maxLength(10), Validators.pattern(STRING_PATTERN)],
      ], //*
      noInterno: [
        { value: '', disabled: true },
        [Validators.maxLength(10), Validators.pattern(STRING_PATTERN)],
      ], //*
      colonia: [
        { value: '', disabled: true },
        [Validators.maxLength(100), Validators.pattern(STRING_PATTERN)],
      ], //*
      delegacionMunicipio: [
        { value: '', disabled: true },
        [Validators.maxLength(60), Validators.pattern(STRING_PATTERN)],
      ], //*
      codigoPostal: [
        { value: '', disabled: true },
        [Validators.maxLength(6), Validators.pattern(NUM_POSITIVE)],
      ], //*
      entidadFederativa: [
        { value: '', disabled: true },
        [Validators.maxLength(45), Validators.pattern(STRING_PATTERN)],
      ], //*
      telefono: [
        { value: '', disabled: true },
        [Validators.maxLength(20), Validators.pattern(PHONE_PATTERN)],
      ], //*
      rfc: [
        { value: '', disabled: true },
        [Validators.maxLength(20), Validators.pattern(RFC_PATTERN)],
      ], //*
      curp: [
        { value: '', disabled: true },
        [Validators.maxLength(20), Validators.pattern(CURP_PATTERN)],
      ], //*

      tipoPersona: [
        { value: '', disabled: true },
        [Validators.maxLength(20), Validators.pattern(STRING_PATTERN)],
      ], //* TIPO PERSONA
      tipoPersona2: [
        { value: '', disabled: true },
        [Validators.maxLength(30), Validators.pattern(STRING_PATTERN)],
      ], //* TIPO RESPONSABLE
      giro: [
        { value: '', disabled: true },
        [Validators.maxLength(45), Validators.pattern(STRING_PATTERN)],
      ],
      referencia: [
        { value: '', disabled: true },
        [Validators.maxLength(35), Validators.pattern(STRING_PATTERN)],
      ],

      remocion: [
        { value: 'N', disabled: true },
        [Validators.maxLength(1), Validators.pattern(STRING_PATTERN)],
      ],
      fecha: [{ value: '', disabled: true }, [Validators.maxLength(11)]],
      noOficio: [
        { value: '', disabled: true },
        [Validators.maxLength(20), Validators.pattern(STRING_PATTERN)],
      ],

      // Acuerdo Junta de Gobierno
      fechaAcuerdo: [{ value: '', disabled: true }, [Validators.maxLength(11)]],
      noAcuerdo: [
        { value: '', disabled: true },
        [Validators.maxLength(20), Validators.pattern(STRING_PATTERN)],
      ],

      contraprestacion: [
        { value: '0.00', disabled: true },
        [Validators.maxLength(17), Validators.pattern(STRING_PATTERN)],
      ],
      honorarios: [
        { value: '', disabled: true },
        [Validators.maxLength(17), Validators.pattern(STRING_PATTERN)],
      ],
      iva: [
        { value: '', disabled: true },
        [Validators.maxLength(5), Validators.pattern(STRING_PATTERN)],
      ],
      noNombramiento: [
        { value: '', disabled: true },
        [Validators.maxLength(60), Validators.pattern(STRING_PATTERN)],
      ], // CLAVE CONTRATO
      fechaInicio: [
        { value: '', disabled: true },
        ,
        [Validators.maxLength(11)],
      ],

      anexo: [
        { value: '', disabled: true },
        [Validators.maxLength(20), Validators.pattern(STRING_PATTERN)],
      ],
      observaciones: [
        { value: '', disabled: true },
        [Validators.maxLength(1000), Validators.pattern(STRING_PATTERN)],
      ],

      // folioRemocion: [
      //   { value: '', disabled: true },
      //   [Validators.maxLength(15), Validators.pattern(NUM_POSITIVE)],
      // ],
      // folioActaDepositaria: [
      //   { value: '', disabled: true },
      //   [Validators.maxLength(15), Validators.pattern(NUM_POSITIVE)],
      // ],
    });
    this.formScan = this.fb.group({
      scanningFoli: [
        { value: '', disabled: false },
        [Validators.pattern(NUM_POSITIVE), Validators.maxLength(15)],
      ],
      returnFoli: [
        { value: '', disabled: false },
        [Validators.pattern(NUM_POSITIVE), Validators.maxLength(15)],
      ],
    });
    this.formRadioScan = this.fb.group({
      scanningFolio: [{ value: 'D', disabled: false }],
    });
  }

  cleanScreenFields() {
    this.formScan.reset();
    this.form.reset();
    this.noBienReadOnly = null;
  }

  toggleRemocion(checked: any) {
    this.checked = checked;
  }

  mostrarInfo(): any {
    console.log(this.form.value);
  }

  btnBienes() {
    console.log('Bienes');
  }

  btnCatalogoDepositarias() {
    console.log('Depositarias');
  }

  btnPaysDetails() {
    console.log('Detalle Pagos');
    if (!this.noBienReadOnly) {
      this.alert(
        'warning',
        'Se requiere de una búsqueda de Bien primero para poder ver está opción',
        ''
      );
      return;
    }
    this.openModalPaysDetails({
      depositaryNumber: Number(this.depositaryAppointment.appointmentNumber),
    });
  }

  openModalPaysDetails(context?: Partial<AppointmentsRelationsPaysComponent>) {
    const modalRef = this.modalService.show(
      AppointmentsRelationsPaysComponent,
      {
        initialState: context,
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
  }

  btnJuridicalReport() {
    console.log('Reportes Juridicos');
    if (!this.noBienReadOnly) {
      this.alert(
        'warning',
        'Se requiere de una búsqueda de Bien primero para poder ver está opción',
        ''
      );
      return;
    }
    this.openModalJuridicalReport({
      depositaryNumber: Number(this.depositaryAppointment.appointmentNumber),
    });
  }

  openModalJuridicalReport(
    context?: Partial<AppointmentsJuridicalReportComponent>
  ) {
    const modalRef = this.modalService.show(
      AppointmentsJuridicalReportComponent,
      {
        initialState: context,
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
  }

  btnReportesAdministrativos() {
    console.log('Reportes Administrativos');
    if (!this.noBienReadOnly) {
      this.alert(
        'warning',
        'Se requiere de una búsqueda de Bien primero para poder ver está opción',
        ''
      );
      return;
    }
    this.openModaladministrativeReport({
      depositaryNumber: Number(this.depositaryAppointment.appointmentNumber),
    });
  }

  openModaladministrativeReport(
    context?: Partial<AppointmentsAdministrativeReportComponent>
  ) {
    const modalRef = this.modalService.show(
      AppointmentsAdministrativeReportComponent,
      {
        initialState: context,
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
  }

  btnMasivIncomePays() {
    console.log('Ingresos Masivos Pagos');
    if (!this.noBienReadOnly) {
      this.alert(
        'warning',
        'Se requiere de una búsqueda de Bien primero para poder ver está opción',
        ''
      );
      return;
    }
    // Llama pantalla FMASINSPAGDEPOSITARIAS
    this.router.navigate(
      ['/pages/juridical/depositary/bulk-loading-depository-cargo'],
      {
        queryParams: {
          origin: this.screenKey,
          no_bien: this.noBienReadOnly,
        },
      }
    );
  }

  btnConceptsPaysCatalogs() {
    console.log('Conceptos de Pagos');
    if (!this.noBienReadOnly) {
      this.alert(
        'warning',
        'Se requiere de una búsqueda de Bien primero para poder ver está opción',
        ''
      );
      return;
    }
    // Llama pantalla FCATCATCONCEPPAGO
    this.router.navigate(['/pages/catalogs/person'], {
      queryParams: {
        origin: this.screenKey,
        no_bien: this.noBienReadOnly,
      },
    });
  }

  btnDepositaryCatalog() {
    console.log('Cátalogo Depositarias');
    if (!this.noBienReadOnly) {
      this.alert(
        'warning',
        'Se requiere de una búsqueda de Bien primero para poder ver está opción',
        ''
      );
      return;
    }
    // Llama pantalla FCATCATMTOPERSONA
    this.router.navigate(
      ['/pages/parameterization/maintenance-individuals-and-companies'],
      {
        queryParams: {
          origin: this.screenKey,
          no_bien: this.noBienReadOnly,
        },
      }
    );
  }

  btnFolioEscaneoSolicitud() {
    // IMG_SOLICITUD
    console.log('Escaneo Solicitud');
  }

  btnReplicarFolio() {
    console.log('Replicar Folio');
  }

  btnImprimirSolicitudEscaneo() {
    console.log('Solicitud Escaneo');
  }

  btnConsultarImagenesEscaneadas() {
    console.log('Consultar Imágenes Escaneadas');
  }

  getFromSelect(params: ListParams) {
    this.exampleService.getAll(params).subscribe(data => {
      this.items = new DefaultSelect(data.data, data.count);
    });
  }

  changeMenaje() {
    if (this.form.get('bienesMenaje').value == '1') {
    }
  }

  async validFielddGoodNumber() {
    if (this.globalVars.noExiste != 1) {
      this.noBien = this.form.get('noBien').value;
      const params: ListParams = {
        page: this.params.getValue().page,
        limit: 10,
      };
      this.params.getValue().getParams();
      params['filter.goodId'] = this.noBien;
      params['filter.status'] = 'ADM';
      await this.appointmentsService.getGoodByParams(params).subscribe({
        next: res => {
          console.log(res);
          if (res.data.length > 0) {
            this.form.get('descriptionGood').setValue(res.data[0].description);
            this.form.get('noExpedient').setValue(res.data[0].fileNumber);
            this.form
              .get('fechaAcuerdoAsegurado')
              .setValue(res.data[0].agreementDate);
            this.form.updateValueAndValidity();
            this.getStatusGoodByStatus(res.data[0].id);
            this.getDataExpedientByNoExpedient(res.data[0].fileNumber);
          } else {
            this.alert(
              'warning',
              'Verificar el Número de Bien',
              'El No. de Bien ' +
                this.noBien +
                ' no existe ó el estatus para depositarias no es el adecuado.'
            );
          }
        },
        error: err => {
          console.log(err);
          this.alert(
            'warning',
            'Verificar el Número de Bien',
            'El No. de Bien ' +
              this.noBien +
              ' no existe ó el estatus para depositarias no es el adecuado.'
          );
        },
      });
    } else {
      this.alert('warning', 'Número de Bien', 'Ingresa un número de Bien.');
    }
  }

  async getStatusGoodByStatus(noGood: number) {
    await this.appointmentsService
      .getStatusAndDescriptionGoodByNoGood(noGood)
      .subscribe({
        next: res => {
          console.log(res);
          this.form.get('estatusBien').setValue(res.description);
          this.form.updateValueAndValidity();
        },
        error: err => {
          console.log(err);
          this.alertQuestion(
            'warning',
            'Estatus del Bien',
            'El estatus no se obtubo correctamente para el bien ' + noGood + '.'
          );
        },
      });
  }

  async getDataExpedientByNoExpedient(noExpedient: number) {
    await this.appointmentsService
      .getExpedientByNoExpedient(noExpedient)
      .subscribe({
        next: res => {
          console.log(res);
          this.form.get('averiguacionPrevia').setValue(res.preliminaryInquiry);
          this.form.get('causaPenal').setValue(res.keyPenalty);
          this.form.get('fechaRecepcion').setValue(res.receptionDate);
          this.form.updateValueAndValidity();
        },
        error: err => {
          console.log(err);
          this.alertQuestion(
            'warning',
            'Número de Expediente',
            'El número de expediente ' + noExpedient + ' NO existe.'
          );
        },
      });
  }

  /**
   * Validar el número de bien
   */
  async validGoodNumberInDepositaryAppointment() {
    if (this.form.get('noBien').valid) {
      this.loadingAppointment = true;
      this.noBien = this.form.get('noBien').value;
      const params: ListParams = {
        page: this.params.getValue().page,
        limit: 10,
      };
      this.params.getValue().getParams();
      params['filter.goodNumber'] = this.noBien;
      this.form.reset();
      this.form.get('noBien').setValue(this.noBien);
      this.form.updateValueAndValidity();
      await this.appointmentsService
        .getGoodAppointmentDepositaryByNoGood(params)
        .subscribe({
          next: res => {
            this.loadingAppointment = false;
            console.log(res);
            this.depositaryAppointment = res.data[0];
            this.setDataDepositary(); // Set data depositary
            if (this.depositaryAppointment.personNumber) {
              if (this.depositaryAppointment.personNumber.id) {
                this.setDataPerson(); // Set data Person
              }
            }
            this.getFromGoodsAndExpedients(true); // Get data good
            this.setOthers();
          },
          error: err => {
            this.loadingAppointment = false;
            console.log(err);
            if (err.status == 400) {
              this.globalVars.noExiste = 0;
              this.getFromGoodsAndExpedients();
            } else {
              this.alert(
                'warning',
                'Número de Bien',
                'El número de Bien no existe.'
              );
            }
          },
        });
    } else {
      this.alert('warning', 'Número de Bien', 'Ingresa un número de Bien.');
    }
  }

  validPostGetDepositary() {}

  setDataDepositary() {
    this.showScanForm = false; // Ocultar parte de escaneo
    this.form
      .get('representanteSAE')
      .setValue(this.depositaryAppointment.seraRepresentative);
    this.form.get('referencia').setValue(this.depositaryAppointment.reference);
    this.form
      .get('tipoNombramiento')
      .setValue(this.depositaryAppointment.typeNameKey);
    this.form
      .get('tipoDepositaria')
      .setValue(this.depositaryAppointment.depositaryType);

    setTimeout(() => {
      this.formScan
        .get('scanningFoli')
        .setValue(this.depositaryAppointment.universalFolio);
      this.formScan.get('scanningFoli').updateValueAndValidity();
      this.formScan
        .get('returnFoli')
        .setValue(this.depositaryAppointment.folioReturn);
      this.formScan.get('returnFoli').updateValueAndValidity();
      this.showScanForm = true; // Mostrar parte de escaneo
    }, 200);
  }

  setDataPerson() {
    this.form
      .get('depositaria')
      .setValue(
        this.depositaryAppointment.personNumber.nom_persona
          ? this.depositaryAppointment.personNumber.nom_persona +
            ' --- ' +
            this.depositaryAppointment.personNumber.nombre
            ? this.depositaryAppointment.personNumber.nombre
            : ''
          : '' + ' --- ' + this.depositaryAppointment.personNumber.nombre
          ? this.depositaryAppointment.personNumber.nombre
          : ''
      );
    this.form
      .get('representante')
      .setValue(
        this.depositaryAppointment.personNumber.representante
          ? this.depositaryAppointment.personNumber.representante
          : ''
      );
    this.form
      .get('calle')
      .setValue(this.depositaryAppointment.personNumber.calle);
    this.form
      .get('noExterno')
      .setValue(this.depositaryAppointment.personNumber.no_exterior);
    this.form
      .get('noInterno')
      .setValue(this.depositaryAppointment.personNumber.no_interior);
    if (
      this.depositaryAppointment.personNumber.codigo_postal ||
      this.depositaryAppointment.personNumber.codigo_postal == '0'
    ) {
      this.postalCodeSelectValue =
        this.depositaryAppointment.personNumber.codigo_postal;
      this.getPostalCodeByDetail(new ListParams(), true);
    } else {
      if (this.depositaryAppointment.personNumber.cve_entfed) {
        this.stateSelectValue =
          this.depositaryAppointment.personNumber.cve_entfed;
      }
      if (this.depositaryAppointment.personNumber.deleg_munic) {
        this.delegationSelectValue =
          this.depositaryAppointment.personNumber.deleg_munic;
      }
      if (this.depositaryAppointment.personNumber.colonia) {
        this.localitySelectValue =
          this.depositaryAppointment.personNumber.colonia;
      }
      if (this.stateSelectValue) {
        // call function
        this.getStateByDetail(new ListParams());
      }
      if (this.delegationSelectValue) {
        // CALL FUNCTION
        this.getDelegationByDetail(new ListParams());
      }
      if (this.localitySelectValue) {
        // call function
        this.getLocalityByDetail(new ListParams());
      }
    }
    // if (
    //   this.depositaryAppointment.personNumber.cve_entfed ||
    //   this.depositaryAppointment.personNumber.cve_entfed == '0'
    // ) {
    //   this.stateSelectValue =
    //     this.depositaryAppointment.personNumber.cve_entfed;
    //   this.getStateByDetail(new ListParams());
    // }
    // if (this.depositaryAppointment.personNumber.deleg_munic) {
    //   this.delegationSelectValue =
    //     this.depositaryAppointment.personNumber.deleg_munic;
    //   let deleg = new ListParams();
    //   deleg['search'] = this.depositaryAppointment.personNumber.deleg_munic;
    //   deleg['text'] = this.depositaryAppointment.personNumber.deleg_munic;
    //   this.getDelegationByDetail(deleg);
    // }
    // if (this.depositaryAppointment.personNumber.colonia) {
    //   this.localitySelectValue =
    //     this.depositaryAppointment.personNumber.colonia;
    //   let colonia = new ListParams();
    //   colonia['search'] = this.depositaryAppointment.personNumber.colonia;
    //   colonia['text'] = this.depositaryAppointment.personNumber.colonia;
    //   this.getLocalityByDetail(colonia);
    // }
    this.form
      .get('telefono')
      .setValue(this.depositaryAppointment.personNumber.telefono);
    this.form.get('rfc').setValue(this.depositaryAppointment.personNumber.rfc);
    this.form
      .get('curp')
      .setValue(this.depositaryAppointment.personNumber.curp);
    this.form
      .get('giro')
      .setValue(this.depositaryAppointment.personNumber.cve_giro);
    this.form
      .get('tipoPersona')
      .setValue(
        this.appointmentsService.getPersonType(
          this.depositaryAppointment.personNumber.tipo_persona
        )
      );
    this.form
      .get('tipoPersona2')
      .setValue(
        this.appointmentsService.getResponsibleType(
          this.depositaryAppointment.personNumber.tipo_responsable
        )
      );
  }

  setGoodData() {
    this.form.get('descriptionGood').setValue(this.good.description);
    if (this.good.expediente) {
      if (this.good.expediente.id) {
        this.form.get('causaPenal').setValue(this.good.expediente.criminalCase);
        this.form.get('noExpedient').setValue(this.good.expediente.id);
        this.form
          .get('averiguacionPrevia')
          .setValue(this.good.expediente.preliminaryInquiry);
        let dateAgree: any;
        if (this.good.expediente.dateAgreementAssurance) {
          dateAgree = this.datePipe.transform(
            this.good.expediente.dateAgreementAssurance,
            this.dateFormat
          );
        }
        this.form.get('fechaAcuerdoAsegurado').setValue(dateAgree);
        let dateReception: any;
        if (this.good.expediente.receptionDate) {
          dateReception = this.datePipe.transform(
            this.good.expediente.receptionDate,
            this.dateFormat
          );
        }
        this.form.get('fechaRecepcion').setValue(dateReception);
        let dateConfiscate: any;
        if (this.good.expediente.confiscateDictamineDate) {
          dateConfiscate = this.datePipe.transform(
            this.good.expediente.confiscateDictamineDate,
            this.dateFormat
          );
        }
        this.form.get('fechaDecomiso').setValue(dateConfiscate);
      }
    }
  }

  setOthers() {
    // Revocation
    this.form.get('remocion').setValue(this.depositaryAppointment.revocation);
    this.form.get('fecha').setValue(this.depositaryAppointment.revocationDate);
    this.form
      .get('noOficio')
      .setValue(this.depositaryAppointment.officialRevocationNumber);
    // Junta de gobierno
    this.form
      .get('fechaAcuerdo')
      .setValue(this.depositaryAppointment.governmentMeetingOfficialDate);
    this.form
      .get('noAcuerdo')
      .setValue(this.depositaryAppointment.governmentMeetingOfficialNumber);
    // Honorarios y Contraprestaciones
    this.form
      .get('contraprestacion')
      .setValue(this.depositaryAppointment.importConsideration);
    this.form.get('honorarios').setValue(this.depositaryAppointment.feeAmount);
    this.form.get('iva').setValue(this.depositaryAppointment.iva);
    let startDate: any;
    if (this.depositaryAppointment) {
      startDate = this.datePipe.transform(
        this.depositaryAppointment.contractStartDate,
        this.dateFormat
      );
    }
    this.form.get('fechaInicio').setValue(startDate);
    this.form
      .get('noNombramiento')
      .setValue(this.depositaryAppointment.appointmentNumber);
    // Anexo y Observaciones
    this.form.get('anexo').setValue(this.depositaryAppointment.annexed);
    this.form
      .get('observaciones')
      .setValue(this.depositaryAppointment.observation);
  }

  /**
   * INCIDENCIA 538 -- CERRADA --- SE CAMBIA OBTENIENDO EL BIEN Y VALIDAR CON EL EXPEDIENTE QUE RETORNA
   * Obtener los datos del bien de acuerdo al status DEP
   */
  async getFromGoodsAndExpedients(onlyGood: boolean = false) {
    // let paramsGoodExpedient: IFromGoodsAndExpedientsBody = {
    //   goodNumber: this.noBien,
    //   page: 1,
    //   limit: 10,
    // };
    this.loadingGood = true;
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('goodId', this.noBien);
    if (onlyGood == false) {
      params.addFilter('status', 'DEP');
    }
    await this.appointmentsService
      .getFromGoodsAndExpedients(params.getFilterParams())
      .subscribe({
        next: res => {
          console.log(res);
          this.good = res.data[0]; // Set data good
          this.setGoodData();
          this.getStatusGoodByNoGood();
        },
        error: err => {
          this.loadingGood = false;
          console.log(err);
          this.alert(
            'warning',
            'Número de Bien',
            'El número de Bien no existe.'
          );
        },
      });
  }

  /**
   * INCIDENCIA 530 -- RESUELTA -- 03/15/2023
   * Obtener el estatus del bien por el número del Bien
   */
  async getStatusGoodByNoGood() {
    let bodyRequest: IDescriptionByNoGoodBody = {
      goodNumber: this.noBien,
    };
    await this.appointmentsService
      .getDescriptionGoodByNoGood(bodyRequest)
      .subscribe({
        next: res => {
          this.loadingGood = false;
          console.log(res);
          if (res.data.length > 0) {
            this.form.get('estatusBien').setValue(res.data[0].description);
          }
        },
        error: err => {
          this.loadingGood = false;
          console.log(err);
          this.alertQuestion(
            'warning',
            'Descripción del Bien',
            'Error al consultar la descripción del Bien.'
          );
          // this.validFielddGoodNumber();
        },
      });
  }

  /**
   * DATA SELECT DEL COMPONENTE
   */

  changePostalCodeDetail(event: any) {
    if (event) {
      if (event.postalCode) {
        this.postalCodeSelectValue = event.postalCode.toString();
        if (event.stateKey) {
          this.stateSelectValue = event.stateKey.toString();
        }
        if (event.municipalityKey) {
          this.delegationSelectValue = event.municipalityKey.toString();
        }
        if (event.townshipKey) {
          this.localitySelectValue = event.townshipKey.toString();
        }
        if (this.stateSelectValue) {
          // call function
          this.getStateByDetail(new ListParams());
        }
        if (this.delegationSelectValue) {
          // CALL FUNCTION
          this.getDelegationByDetail(new ListParams());
        }
        if (this.localitySelectValue) {
          // call function
          this.getLocalityByDetail(new ListParams());
        }
      } else {
        this.postalCodeSelectValue;
      }
    } else {
      this.postalCodeSelectValue;
    }
  }

  getPostalCodeByDetail(
    paramsData: ListParams,
    setPostalCode: boolean = false
  ) {
    const params: any = new FilterParams();
    params.removeAllFilters();
    params['sortBy'] = 'postalCode:ASC';
    if (this.delegationSelectValue) {
      params.addFilter('municipalityKey', this.delegationSelectValue);
    }
    if (this.stateSelectValue) {
      params.addFilter('stateKey', this.stateSelectValue);
    }
    if (this.localitySelectValue) {
      params.addFilter('townshipKey', this.localitySelectValue);
    }
    if (this.postalCodeSelectValue && !paramsData['search']) {
      params.addFilter(
        'postalCode',
        this.postalCodeSelectValue,
        SearchFilter.LIKE
      );
    } else {
      if (paramsData['search'] || paramsData['search'] == '0') {
        params.addFilter('postalCode', paramsData['search'], SearchFilter.LIKE);
      }
    }
    let subscription = this.appointmentsService
      .getPostalCodeByFilter(params.getParams())
      .subscribe({
        next: data => {
          if (this.postalCodeSelectValue && !paramsData['search']) {
            this.setPostalCode(data, setPostalCode);
          } else {
            if (setPostalCode) {
              this.setPostalCode(data, setPostalCode);
            } else {
              this.postalCode = new DefaultSelect(
                data.data.map((i: any) => {
                  i.township = i.postalCode + ' -- ' + i.township;
                  return i;
                }),
                data.count
              );
            }
          }
          subscription.unsubscribe();
        },
        error: error => {
          this.postalCode = new DefaultSelect();
          subscription.unsubscribe();
        },
      });
  }

  setPostalCode(data: any, setPostalCode: boolean = false) {
    let dataSet = data.data.find((item: any) => {
      return setPostalCode
        ? item.postalCode
        : Number(item.postalCode) == Number(this.postalCodeSelectValue);
    });
    console.log(dataSet);
    if (dataSet) {
      if (setPostalCode) {
        this.postalCodeSelectValue = dataSet.postalCode.toString();
      }
      this.postalCode = new DefaultSelect(
        [dataSet].map((i: any) => {
          i.township = i.postalCode + ' -- ' + i.township;
          return i;
        }),
        data.count
      );
      if (setPostalCode) {
        this.form.get('codigoPostal').setValue(this.postalCodeSelectValue);
        this.changePostalCodeDetail(dataSet);
      }
    }
  }

  changeLocalityDetail(event: any) {
    console.log(event);
    if (event) {
      if (event.townshipKey) {
        this.localitySelectValue = event.townshipKey.toString();
      } else {
        this.localitySelectValue;
      }
      if (event.stateKey) {
        this.stateSelectValue = event.stateKey.toString();
        this.getStateByDetail(new ListParams());
      }
      if (event.municipalityKey) {
        this.delegationSelectValue = event.municipalityKey.toString();
        this.getDelegationByDetail(new ListParams());
      }
      if (event.townshipKey && event.stateKey && event.municipalityKey) {
        this.getPostalCodeByDetail(new ListParams(), true);
      }
    } else {
      this.localitySelectValue;
    }
  }
  getLocalityByDetail(paramsData: ListParams) {
    // if (!this.stateSelectValue && !this.delegationSelectValue) {
    //   this.locality = new DefaultSelect();
    //   return;
    // }
    const params: any = new FilterParams();
    params.removeAllFilters();
    params['sortBy'] = 'townshipKey:DESC';
    if (
      this.delegationSelectValue &&
      !isNaN(Number(this.localitySelectValue))
    ) {
      params.addFilter('municipalityKey', this.delegationSelectValue);
    }
    if (this.stateSelectValue) {
      params.addFilter('stateKey', this.stateSelectValue);
    }
    console.log(this.localitySelectValue);
    if (this.localitySelectValue && !paramsData['search']) {
      // params.addFilter('townshipKey', this.localitySelectValue);
      params.addFilter(
        isNaN(Number(this.localitySelectValue)) ? 'township' : 'townshipKey',
        this.localitySelectValue
      );
    } else {
      if (paramsData['search'] || paramsData['search'] == '0') {
        params.addFilter('township', paramsData['search'], SearchFilter.LIKE);
      }
    }
    let subscription = this.appointmentsService
      .getLocalityByFilter(params.getParams())
      .subscribe({
        next: data => {
          if (this.localitySelectValue && !paramsData['search']) {
            if (data.data) {
              let dataSet = data.data.find((item: any) => {
                return (
                  Number(item.townshipKey) == Number(this.localitySelectValue)
                );
              });
              if (dataSet) {
                this.localitySelectValue = dataSet.townshipKey.toString();
                this.locality = new DefaultSelect(
                  [dataSet].map((i: any) => {
                    i.township = i.townshipKey + ' -- ' + i.township;
                    return i;
                  }),
                  1
                );
                this.form
                  .get('colonia')
                  .setValue(Number(this.localitySelectValue));
              }
            }
          } else {
            this.locality = new DefaultSelect(
              data.data.map((i: any) => {
                i.township = i.townshipKey + ' -- ' + i.township;
                return i;
              }),
              data.count
            );
          }
          subscription.unsubscribe();
        },
        error: error => {
          this.locality = new DefaultSelect();
          subscription.unsubscribe();
        },
      });
  }

  changeDelegationDetail(event: any) {
    console.log(event);
    if (event) {
      if (event.municipalityKey) {
        this.delegationSelectValue = event.municipalityKey.toString();
      } else {
        this.delegationSelectValue;
      }
      if (event.stateKey) {
        this.stateSelectValue = event.stateKey.toString();
        this.getStateByDetail(new ListParams());
      }
    } else {
      this.delegationSelectValue;
    }
  }
  getDelegationByDetail(paramsData: ListParams) {
    // if (!this.stateSelectValue) {
    //   this.delegations = new DefaultSelect();
    //   return;
    // }
    const params = new FilterParams();
    params.removeAllFilters();
    params['sortBy'] = 'municipalityKey:ASC';
    if (this.stateSelectValue) {
      params.addFilter('stateKey', this.stateSelectValue);
    }
    console.log(
      this.delegationSelectValue,
      Number(this.delegationSelectValue),
      isNaN(Number(this.delegationSelectValue))
    );
    if (this.delegationSelectValue && !paramsData['search']) {
      params.addFilter(
        isNaN(Number(this.delegationSelectValue))
          ? 'municipality'
          : 'municipalityKey',
        this.delegationSelectValue,
        SearchFilter.LIKE
      );
      params['limit'] = 100;
    } else {
      if (paramsData['search'] || paramsData['search'] == '0') {
        params.addFilter(
          'municipality',
          paramsData['search'],
          SearchFilter.LIKE
        );
      }
    }
    let subscription = this.appointmentsService
      .getDelegationsByFilter(params.getParams())
      .subscribe({
        next: data => {
          if (this.delegationSelectValue && !paramsData['search']) {
            if (data.data) {
              let dataSet = data.data.find((item: any) => {
                return (
                  Number(item.municipalityKey) ==
                  Number(this.delegationSelectValue)
                );
              });
              if (dataSet) {
                this.delegationSelectValue = dataSet.municipalityKey.toString();
                this.delegations = new DefaultSelect(
                  [dataSet].map((i: any) => {
                    i.municipality =
                      i.municipalityKey + ' -- ' + i.municipality;
                    return i;
                  }),
                  1
                );
                this.form
                  .get('delegacionMunicipio')
                  .setValue(this.delegationSelectValue.toString());
              }
            }
          } else {
            this.delegations = new DefaultSelect(
              data.data.map((i: any) => {
                i.municipality = i.municipalityKey + ' -- ' + i.municipality;
                return i;
              }),
              1
            );
          }
          subscription.unsubscribe();
        },
        error: error => {
          this.delegations = new DefaultSelect();
          subscription.unsubscribe();
        },
      });
  }

  changeStateDetail(event: any) {
    console.log(event);
    if (event) {
      if (event.id) {
        this.stateSelectValue = event.id;
      } else {
        this.stateSelectValue;
      }
    } else {
      this.stateSelectValue;
    }
  }
  getStateByDetail(paramsData: ListParams) {
    if (this.stateSelectValue && !paramsData['search']) {
      let subscription = this.appointmentsService
        .getStateOfRepublicById(this.stateSelectValue)
        .subscribe({
          next: data => {
            if (data) {
              this.state = new DefaultSelect(
                [data].map(i => {
                  i.descCondition = i.id + ' -- ' + i.descCondition;
                  return i;
                }),
                1
              );
              this.form
                .get('entidadFederativa')
                .setValue(this.stateSelectValue.toString());
            }
            subscription.unsubscribe();
          },
          error: error => {
            this.state = new DefaultSelect();
            subscription.unsubscribe();
          },
        });
    } else {
      paramsData['sortBy'] = 'id:ASC';
      if (!isNaN(Number(paramsData['search']))) {
        return;
      }
      let subscription = this.appointmentsService
        .getStateOfRepublicByAll(paramsData)
        .subscribe({
          next: data => {
            this.state = new DefaultSelect(
              data.data.map(i => {
                i.descCondition = i.id + ' -- ' + i.descCondition;
                return i;
              }),
              data.count
            );
            console.log(data, this.state);
            subscription.unsubscribe();
          },
          error: error => {
            this.state = new DefaultSelect();
            subscription.unsubscribe();
          },
        });
    }
  }

  messageDigitalization(event: any) {
    console.log(event);
    if (this.depositaryAppointment.revocation == 'N') {
      if (this.formScan.get('scanningFoli').value) {
        // Continuar proceso mostrar reporte solicitud de escaneo
        this.reportDigitalizationReport(
          Number(this.depositaryAppointment.universalFolio)
        );
      } else {
        this.alertInfo(
          'warning',
          'No tiene folio de Escaneo para visualizar',
          ''
        );
      }
    } else {
      if (this.formScan.get('returnFoli').value) {
        // Continuar proceso mostrar reporte solicitud de escaneo  RGERGENSOLICDIGIT
        this.reportDigitalizationReport(
          Number(this.depositaryAppointment.folioReturn)
        );
      } else {
        this.alertInfo(
          'warning',
          'No tiene folio de Escaneo para visualizar',
          ''
        );
      }
    }
  }

  reportDigitalizationReport(folio: number) {
    let params = {
      pn_folio: folio,
    };
    this.siabService
      .fetchReport('RGERGENSOLICDIGIT', params)
      .subscribe(response => {
        console.log(response);
        if (response !== null) {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          let config = {
            initialState: {
              documento: {
                urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                type: 'pdf',
              },
              callback: (data: any) => {},
            }, //pasar datos por aca
            class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
            ignoreBackdropClick: true, //ignora el click fuera del modal
          };
          this.modalService.show(PreviewDocumentsComponent, config);
        } else {
          this.alert('warning', 'Reporte no disponible por el momento', '');
        }
      });
  }

  scanRequest(event: any) {
    console.log(event);
    this.formRadioScan.get('scanningFolio').setValue('D');
    this.formRadioScan.get('scanningFolio').updateValueAndValidity();
    this.showScanRadio = true;
    this.globalVars.procgenimg = 1;
  }

  showScanningPage(event: any) {
    console.log(event);
    this.showScanRadio = true;
    this.globalVars.procgenimg = 2;
  }

  closeRadioScan() {
    this.showScanRadio = false;
  }

  changeRadioScan(option: string) {
    console.log(option);
    if (this.globalVars.procgenimg == 1) {
      if (this.formRadioScan.get('scanningFolio').value == 'A') {
        this.appointmentsService
          .getCValFoUni({
            adminTypeKey: this.depositaryAppointment.typeAdminKey,
            goodNumber: this.noBienReadOnly,
            screen: this.screenKey,
          })
          .subscribe({
            next: async data => {
              console.log('DATA ', data);
              if (data.count == 0) {
                const response = await this.alertQuestion(
                  'question',
                  'Aviso',
                  '¿Quiere generar el folio de acta depositaria, aun que no cambiará el estatus?'
                );

                if (!response.isConfirmed) {
                  this.showScanRadio = false;
                } else {
                  this.valuesChangeRadio.lv_VALESCAN = 1;
                  this.validValScanFolio();
                }
              } else {
                const response = await this.alertQuestion(
                  'question',
                  'Aviso',
                  'Se generará un nuevo folio de escaneo para la depositaría. ¿Deseas continuar?'
                );

                if (!response.isConfirmed) {
                  this.valuesChangeRadio.lv_VALESCAN = 1;
                  this.validValScanFolio();
                } else {
                  this.showScanRadio = false;
                }
              }
            },
            error: error => {
              console.log(error);
              this.onLoadToast(
                'error',
                'Error al validar el Folio Universal',
                ''
              );
            },
          });
      } else if (this.formRadioScan.get('scanningFolio').value == 'R') {
        this.appointmentsService
          .getCValFoRev({
            adminTypeKey: this.depositaryAppointment.typeAdminKey,
            goodNumber: this.noBienReadOnly,
            screen: this.screenKey,
          })
          .subscribe({
            next: async data => {
              console.log('DATA ', data);
              if (data.count == 0) {
                this.alertInfo(
                  'info',
                  'No se puede generar el folio de escaneo por remoción, por que no tiene el estatus adecuado',
                  ''
                );
                this.showScanRadio = false;
              } else {
                const response = await this.alertQuestion(
                  'question',
                  'Aviso',
                  'Se generará un nuevo folio de escaneo para la remoción. ¿Deseas continuar?'
                );

                if (response.isConfirmed) {
                  if (this.form.get('remocion').value == 'N') {
                    this.alertInfo('info', 'No tiene datos de remoción', '');
                    this.showScanRadio = false;
                  } else {
                    this.valuesChangeRadio.lv_VALESCAN = 1;
                    this.validValScanFolio();
                  }
                } else {
                  this.showScanRadio = false;
                }
              }
            },
            error: error => {
              console.log(error);
              this.onLoadToast(
                'error',
                'Error al validar el Folio Universal',
                ''
              );
            },
          });
      }
    } else if (this.globalVars.procgenimg == 2) {
      if (!this.noBienReadOnly) {
        this.alert(
          'warning',
          'No se puede replicar el folio de escaneo si no existe un bien',
          ''
        );
        return;
      }
      if (this.formRadioScan.get('scanningFolio').value == 'A') {
        if (this.depositaryAppointment.universalFolio) {
          // LANZA ESCANEO
          this.runScanScreen(Number(this.depositaryAppointment.universalFolio));
        } else {
          this.alert(
            'warning',
            'No se puede escanear imagenes, folio de acta depositaria es nulo, ',
            ''
          );
          this.showScanRadio = false;
        }
      } else if (this.formRadioScan.get('scanningFolio').value == 'R') {
        if (this.depositaryAppointment.folioReturn) {
          // LANZA ESCANEO
          this.runScanScreen(Number(this.depositaryAppointment.folioReturn));
        } else {
          this.alert(
            'warning',
            'No se puede escanear imagenes, folio de remoción es nulo, ',
            ''
          );
          this.showScanRadio = false;
        }
      }
    }
  }

  runScanScreen(folio: number) {
    this.router.navigate(['/pages/general-processes/scan-documents'], {
      queryParams: {
        origin: this.screenKey,
        P_NB: this.noBienReadOnly,
        folio: folio,
      },
    });
  }

  validValScanFolio() {
    if (!this.noBienReadOnly) {
      this.alert(
        'warning',
        'No se puede generar el folio de escaneo si no existe un bien',
        ''
      );
      return;
    }
    this.appointmentsService.getCFlyer(this.good.fileNumber).subscribe({
      next: async data => {
        console.log('DATA ', data);
        let wheeelNumber = null;
        if (data[0].min) {
          wheeelNumber = data[0].min;
        } else {
          wheeelNumber = this.good.flyerNumber;
        }
        // http://localhost:4200/pages/general-processes/scan-request LLAMAR FORMA FACTGENSOLICDIGIT
        this.router.navigate(['/pages/general-processes/scan-request'], {
          queryParams: {
            origin: this.screenKey,
            P_NB: this.noBienReadOnly,
            P_NO_VOLANTE: wheeelNumber,
            FOL_ESCANEO: this.formRadioScan.get('scanningFolio').value,
            P_ND: this.depositaryAppointment.appointmentNumber,
          },
        });
        // To save appointment
        //         {
        //     "appointmentNumber": "378",
        //     "folioReturn": "3377076",
        //     "amountIVA": 16,
        //     "personNumber": 338,
        //     "iva": 16
        // }
      },
      error: error => {
        console.log(error);
        this.onLoadToast('error', 'Error al validar el Folio Universal', '');
      },
    });
  }

  viewPictures(event: any) {
    console.log(event);
    if (this.depositaryAppointment.revocation == 'N') {
      if (this.formScan.get('scanningFoli').value) {
        // Continuar proceso para cargar imágenes
        this.getDocumentsByFolio(
          Number(this.depositaryAppointment.universalFolio),
          true
        );
      } else {
        this.alertInfo(
          'warning',
          'No tiene folio de Escaneo para visualizar',
          ''
        );
      }
    } else {
      if (this.formScan.get('returnFoli').value) {
        // Continuar proceso para cargar imágenes
        this.getDocumentsByFolio(
          Number(this.depositaryAppointment.folioReturn),
          false
        );
      } else {
        this.alertInfo(
          'warning',
          'No tiene folio de Escaneo para visualizar',
          ''
        );
      }
    }
  }

  openDocumentsModal(
    flyerNum: string | number,
    folioUniversal: number,
    title: string,
    wheel: boolean,
    folio: boolean
  ) {
    const params = new FilterParams();
    params.addFilter('flyerNumber', flyerNum);
    const $params = new BehaviorSubject(params);
    const $obs = this.documentsService.getAllFilter;
    const service = this.documentsService;
    const columns = RELATED_FOLIO_COLUMNS;
    const config = {
      ...MODAL_CONFIG,
      initialState: {
        $obs,
        service,
        columns,
        title,
        $params,
        wheel,
        folio,
        folioUniversal: folioUniversal,
        wheelNumber: flyerNum,
        showConfirmButton: true,
      },
    };
    return this.modalService.show(
      ModalScanningFoilAppointmentTableComponent<IDocuments>,
      config
    );
  }

  getDocumentsByFolio(folio: number, folioUniversal: boolean) {
    const title = 'Folios relacionados al Volante';
    const modalRef = this.openDocumentsModal(
      folio,
      folio,
      title,
      false,
      folioUniversal
    );
    modalRef.content.selected
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(document => this.getPicturesFromFolio(document));
  }

  getDocumentsByFlyer(flyerNum: string | number) {
    const title = 'Folios relacionados al Volante';
    const modalRef = this.openDocumentsModal(flyerNum, 0, title, true, false);
    modalRef.content.selected
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(document => this.getPicturesFromFolio(document));
  }

  getPicturesFromFolio(document: IDocuments) {
    console.log(document);
    let folio = document.id;
    // let folio = document.file.universalFolio;
    // if (document.id != this.depositaryAppointment.){
    //   folio = this.depositaryAppointment;
    // }
    if (document.associateUniversalFolio) {
      folio = document.associateUniversalFolio;
    }
    const config = {
      ...MODAL_CONFIG,
      ignoreBackdropClick: false,
      initialState: {
        folio,
      },
    };
    this.modalService.show(DocumentsViewerByFolioComponent, config);
  }
}
