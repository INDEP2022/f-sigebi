import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { IDonacContract } from 'src/app/core/models/ms-donation/donation-good.model';
import { GranteeService } from 'src/app/core/services/catalogs/grantees.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DonationRequestService } from 'src/app/core/services/ms-donationgood/donation-requets.service';
import { DonationService } from 'src/app/core/services/ms-donationgood/donation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { ListParams } from './../../../../common/repository/interfaces/list-params';
import { CheckboxElementComponent } from './../../../../shared/components/checkbox-element-smarttable/checkbox-element';
import { COLUMNS } from './columns';
import { DonationProcessService } from './donation-process.service';
import { ModalSelectRequestsComponent } from './modal-select-requests/modal-select-requests.component';

@Component({
  selector: 'app-view-donation-contracts',
  templateUrl: './view-donation-contracts.component.html',
  styles: [],
})
export class ViewDonationContractsComponent extends BasePage implements OnInit {
  @Input() op: number;
  form: FormGroup;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  parametros: any;
  dataTable: LocalDataSource = new LocalDataSource();
  data: LocalDataSource = new LocalDataSource();
  bsModalRef?: BsModalRef;
  bsValueFromYear: Date = new Date();
  bsConfigFromYear: Partial<BsDatepickerConfig>;
  bsValueFromMonth: Date = new Date();
  bsConfigFromMonth: Partial<BsDatepickerConfig>;
  minModeFromMonth: BsDatepickerViewMode = 'month';
  minModeFromYear: BsDatepickerViewMode = 'year';
  parameterTypeDonation: string = null;
  title: string = 'Contratos de Donación';
  contract: IDonacContract;
  buttonIncorporar: boolean = false;
  buttonImprimir: boolean = false;
  buttonBloquear: boolean = false;
  buttonCerrarContrato: boolean = false;
  buttonInsertarParrafo: boolean = false;
  disabledFoli: boolean = false;
  consulto: boolean = false;
  idContrato: string;

  lista: any = [];
  bienSeleccionado: any = {};
  goodNumber: string;
  datosParaTabla: any[] = [];

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private donationService: DonationProcessService,
    private previousDonationService: DonationService,
    private donationRequestService: DonationRequestService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private granteeService: GranteeService,
    private activateRoute: ActivatedRoute,
    private goodService: GoodService,
    private datePipe: DatePipe
  ) {
    super();
    this.parameterTypeDonation =
      this.activateRoute.snapshot.queryParams?.['typeDonation'];
    console.log(this.parameterTypeDonation);
  }

  ngOnInit(): void {
    this.initForm();
    this.configInputsDate();
    this.assignTableColumns();
    console.log(this.op);

    // this.donationService.getAllContracts();

    // this.donationService.getDataInventario().subscribe({
    //   next: data => {
    //     console.log(data);
    //   },
    //   error: error => {
    //     console.log(error);
    //   },
    // });
    console.log('El this.idContrato es: ', this.idContrato);

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (this.idContrato !== undefined) {
        this.fillTable();
      } else {
        this.clean();
      }
      // if (this.consulto) this.getDataTable();
    });
  }

  getDonacRequest(doneeId: number | string, request: boolean = false) {
    return new Promise<any[]>((res, rej) => {
      const param: ListParams = {};
      if (!request) param['filter.doneeId'] = `$eq:${doneeId}`;
      if (request) param['filter.requestId.id'] = `$eq:${doneeId}`;
      this.donationRequestService.getDonacRequest(param).subscribe({
        next: data => {
          console.log(data.data);
          res(data.data);
        },
        error: (error: any) => {
          res([]);
        },
      });
    });
  }

  getDonacContract() {
    const { idContract } = this.form.value;
    const param: ListParams = {};
    param.limit = 1;
    param['filter.id'] = `$eq:${idContract}`;
    const body = {
      requestType: this.parameterTypeDonation,
    };
    this.donationRequestService.getContractByType(body, param).subscribe({
      next: data => {
        this.contract = data.data[0];
        this.desaHabForms();
        this.setForm();
        this.postQueryContract();
        this.getDataTable();
      },
      error: (error: any) => {
        this.alert(
          'warning',
          this.title,
          'No se encontraron registros con ese Id'
        );
      },
    });
  }

  setForm() {
    this.form.get('idContract').setValue(this.contract.id);
    this.form.patchValue(this.contract);
  }

  getDataTable() {
    this.loading = true;
    this.params.getValue()['filter.contractid'] = `$eq:${this.contract.id}`;
    this.donationRequestService.getDonationData2(this.params.value).subscribe({
      next: data => {
        console.log(data);
        console.error(data.data);
        this.data.load(data.data);
        this.data.refresh();
        this.totalItems = data.count;
        this.loading = false;
      },
      error: (error: any) => {
        this.loading = false;
        this.data.load([]);
        this.data.refresh();
      },
    });
  }

  async pupArmaClave() {
    console.log('ENTRO ARMA CLAVE');

    if (
      this.form.get('cto').value === null &&
      this.form.get('donee').value !== null
    ) {
      const data: any[] = await this.getDonacRequest(
        this.form.get('donee').value
      );
      if (data.length > 0) {
        if (data[0]['authorizeType'] === 'D') {
          this.form.get('cto').setValue('DON');
        } else if (data[0]['authorizeType'] === 'A') {
          this.form.get('cto').setValue('ASI');
        } else {
          this.alert(
            'warning',
            this.title,
            'Error en la localización del tipo de acta'
          );
        }
      }
    }
    const key = `${this.form.get('cto').value}/${
      this.form.get('status').value
    }/${this.form.get('trans').value}/${this.form.get('don').value}/${
      this.form.get('donee').value
    }/${this.form.get('ctrlAut').value}/${this.form.get('folio').value}/${
      this.form.get('year').value
    }/${this.form.get('month').value}`;
    this.form.get('contractKey').setValue(key);
    this.contract.contractKey = key;
  }

  desaHabForms() {
    if (this.contract.contractStatus === 'C') {
      this.form.disable();
      this.form.get('idContract').enable();
      /// todos lod botones
      this.buttonBloquear = true;
      this.buttonCerrarContrato = true;
      this.buttonInsertarParrafo = true;
      this.buttonImprimir = true;
      this.buttonIncorporar = true;
      this.disabledFoli = true;
    } else if (this.contract.contractStatus === 'P') {
      this.form.disable();
      this.form.get('idContract').enable();
      /// botones
      /// insertar parrafo
      /// bloquear en firmas
      /// Incorporar
      this.buttonBloquear = true;
      this.buttonIncorporar = true;
      this.buttonInsertarParrafo = true;
    } else {
      this.form.enable();
    }
  }

  newColumn = {
    select: {
      title: 'Sel',
      type: 'custom',
      renderComponent: CheckboxElementComponent,
      onComponentInitFunction(instance: any) {
        instance.toggle.subscribe((data: any) => {
          data.row.to = data.toggle;
        });
      },
      sort: false,
    },
  };

  assignTableColumns() {
    let column = {};
    Object.assign(column, COLUMNS);
    Object.assign(column, this.newColumn);
    console.log(column);
    this.settings = { ...this.settings, actions: false };
    if (this.op == 2) {
      this.settings.columns = column;
    } else {
      this.settings.columns = COLUMNS;
    }
  }

  initForm() {
    this.form = this.fb.group({
      idContract: [null, [Validators.required, Validators.maxLength(10)]],
      cto: [null, [Validators.maxLength(5)]],
      status: [null],
      trans: [null, [Validators.maxLength(50)]],
      don: [null, [Validators.maxLength(30)]],
      ctrlAut: [null, [Validators.maxLength(30)]],
      folio: [null, [Validators.maxLength(4)]],
      year: [this.bsValueFromYear],
      month: [this.bsValueFromMonth],
      contractKey: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
      job: [
        null,
        [Validators.pattern(KEYGENERATION_PATTERN), Validators.maxLength(100)],
      ],
      donee: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      reasonSocial: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(255)],
      ],
      subscribeDate: [null],
      home: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(250)],
      ],
      nomrepdona: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      positionDona: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      usersae: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      representativeSae: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      puetsosae: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      witness1: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      witness2: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      observations: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1250)],
      ],
      deliveryDate: [null],
      folioScan: [
        null,
        [
          Validators.required,
          Validators.pattern(KEYGENERATION_PATTERN),
          Validators.maxLength(15),
        ],
      ],
      contractStatus: [null],
      paragraph1: [null],
      paragraph2: [null],
      paragraph3: [null],
      paragraph4: [null],
      paragraph5: [null],
      typeDonac: [null],
      justification: [null],
      requestDate: [null],
      authorizeKey: [null],
      authorizeDate: [null],
    });
  }

  onSubmit() {}

  getIdContract() {
    const { idContract } = this.form.value;
    this.idContrato = idContract;
    this.loading = true;
    if (this.idContrato.length > 2) {
      this.donationService.getContrato(this.idContrato).subscribe({
        next: data => {
          console.log(data);
          console.log(data.data[0].donee);
          this.alert(
            'success',
            '',
            'Contrato o Convenio encontrado exitosamente'
          );

          const receptionDate = new Date(data.data[0].requestId.receptionDate);
          const formattedreceptionDate = this.datePipe.transform(
            receptionDate,
            'yyyy-MM-dd'
          );
          const year = receptionDate.getFullYear();
          const month = receptionDate.getMonth() + 1;

          console.log(month);

          const formattedMonth = month < 10 ? `0${month}` : `${month}`;

          console.log(formattedMonth);

          const deliveryFecha = new Date(
            data.data[0].requestId.verificationDateCump
          );
          const formatteddeliveryFecha = this.datePipe.transform(
            deliveryFecha,
            'yyyy-MM-dd'
          );
          this.form.controls['year'].setValue(year || null);
          this.form.controls['month'].setValue(formattedMonth || null);
          this.form.controls['donee'].setValue(data.data[0].donee || null);
          this.form.controls['reasonSocial'].setValue(
            data.data[0].doneeId?.razonSocial || null
          );
          this.form.controls['cto'].setValue(
            data.data[0].requestId.affair || null
          );
          this.form.controls['status'].setValue(data.data[0].sunStatus || null);
          this.form.controls['trans'].setValue(
            data.data[0].requestId.transferenceId || null
          );
          this.form.controls['don'].setValue(data.data[0].doneeId?.col || null);
          this.form.controls['ctrlAut'].setValue(
            data.data[0].authorizeType || null
          );
          this.form.controls['folio'].setValue(
            data.data[0].requestId.rulingDocumentId || null
          );
          this.form.controls['contractKey'].setValue(
            data.data[0].authorizeCve || null
          );
          this.form.controls['job'].setValue(
            data.data[0].requestId.reportSheet || null
          );
          this.form.controls['subscribeDate'].setValue(
            formattedreceptionDate || null
          );
          this.form.controls['nomrepdona'].setValue(
            data.data[0].doneeId?.description || null
          );
          this.form.controls['home'].setValue(data.data[0].doneeId?.street);
          this.form.controls['positionDona'].setValue(
            data.data[0].doneeId?.puesto || null
          );
          this.form.controls['usersae'].setValue(
            data.data[0].requestId.rulingCreatorName || null
          );
          this.form.controls['representativeSae'].setValue(
            data.data[0].requestId.nameOfOwner || null
          );
          this.form.controls['puetsosae'].setValue(
            data.data[0].requestId.holderCharge || null
          );
          this.form.controls['witness1'].setValue(
            data.data[0].requestId.nameRecipientRuling || null
          );
          this.form.controls['witness2'].setValue(
            data.data[0].requestId.nameSignatoryRuling || null
          );
          this.form.controls['observations'].setValue(
            data.data[0].requestId.observations || null
          );
          this.form.controls['deliveryDate'].setValue(
            formatteddeliveryFecha || null
          );
          this.form.controls['contractStatus'].setValue(
            data.data[0].requestId.requestStatus || null
          );
          this.form.controls['paragraph1'].setValue(
            data.data[0].requestId.paragraphOneRuling || null
          );
          this.form.controls['paragraph2'].setValue(
            data.data[0].requestId.paragraphTwoRuling || null
          );

          this.fillTable();
        },
        error: () => {
          this.alert(
            'error',
            'Atención',
            'Contrato o Convenio no encontrado, verifique'
          );

          this.clean();
          this.loading = false;
        },
      });
    }
  }

  settingsChange(event: any) {
    this.settings = event;
  }

  onIncorporar() {
    let params = `filter.id=$eq:${this.form.get('idContract').value}`;

    this.donationService.getAllContracts(params).subscribe({
      next: (data: any) => {
        console.log(data);
        console.log(data.data);
        ///Try to find the way to data come in a better and clean way
      },
      error: error => {
        console.log(error);
      },
    });
  }

  fillTable() {
    this.loading = true;
    const parametros = {
      ...this.params.getValue(),
      'filter.requestId': `$eq:${this.idContrato}`,
    };

    this.donationRequestService.getDonationData2(parametros).subscribe({
      next: data => {
        console.log('parametros enviados: ', parametros);
        console.log(data);
        console.error(data.data);

        this.datosParaTabla = data.data;

        console.log(this.datosParaTabla);

        this.data.load(this.datosParaTabla);

        this.totalItems = data.count;
        this.loading = false;
        this.data.refresh();
      },
      error: (error: any) => {
        this.loading = false;
        this.data.load([]);
        this.data.refresh();
      },
    });
  }

  async onInsertarParrafo() {
    if (this.contract) {
      const resp: number = await this.getDonacRequestGood(true);
      if (resp > 0) {
        let V_CONR: number = 0;
        let V_BAN: boolean = true;
        let V_REF: string = '';
        let V_FEC: string = '';
        let V_FEA: string = '';

        ///aqui empieza el for
        V_CONR = V_CONR + 1;
        /* if (V_BAN) {
          V_REF = RE_DAT_SOL.CVE_AUTORIZA;
          V_FEC = this.PUF_PREP_FECHA(RE_DAT_SOL.FEC_SOLICITUD);
          V_FEA = this.PUF_PREP_FECHA(RE_DAT_SOL.FEC_AUTORIZA);
          V_BAN = false;
        } else if (V_CONR === V_CONT) {
          V_REF = `${V_REF} y ${RE_DAT_SOL.CVE_AUTORIZA}`;
          if (V_FEC.indexOf(this.PUF_PREP_FECHA(RE_DAT_SOL.FEC_SOLICITUD)) === -1) {
            V_FEC = `${V_FEC} y ${this.PUF_PREP_FECHA(RE_DAT_SOL.FEC_SOLICITUD)}`;
          }
          if (V_FEA.indexOf(this.PUF_PREP_FECHA(RE_DAT_SOL.FEC_AUTORIZA)) === -1) {
            V_FEA = `${V_FEA} y ${this.PUF_PREP_FECHA(RE_DAT_SOL.FEC_AUTORIZA)}`;
          }
        } else {
          V_REF = `${V_REF}, ${RE_DAT_SOL.CVE_AUTORIZA}`;
          if (V_FEC.indexOf(this.PUF_PREP_FECHA(RE_DAT_SOL.FEC_SOLICITUD)) === -1) {
            V_FEC = `${V_FEC}, ${this.PUF_PREP_FECHA(RE_DAT_SOL.FEC_SOLICITUD)}`;
          }
          if (V_FEA.indexOf(this.PUF_PREP_FECHA(RE_DAT_SOL.FEC_AUTORIZA)) === -1) {
            V_FEA = `${V_FEA}, ${this.PUF_PREP_FECHA(RE_DAT_SOL.FEC_AUTORIZA)}`;
          }
        } */
        this.parrafos();
      }
    } else {
      this.alert(
        'warning',
        this.title,
        'No se tiene Id de Contrato o Convenio.'
      );
    }
  }

  parrafos() {
    if (this.parameterTypeDonation === 'SD') {
      if (this.contract.typeDonac === 1) {
        const paragraph1 = `CONVENIO DE ASIGNACIÓN QUE CELEBRAN POR UNA PARTE EL SERVICIO DE
                          ADMINISTRACIÓN Y ENAJENACIÓN DE BIENES, A QUIEN EN LO SUCESIVO SE LE
                          DENOMINARÁ "EL DONANTE" O "SAE", REPRESENTADO EN ESTE ACTO POR EL C.
                          ${this.contract.representativeSae},${this.contract.puetsosae} DEL
                          SERVICIO DE ADMINISTRACIÓN Y ENAJENACIÓN DE BIENES Y POR LA OTRA
                          <ESPECIFICAR EL NOMBRE DE LA DEPENDENCIA>, EN CALIDAD DE ASIGNATARIO
                          REPRESENTADA EN ESTE ACTO POR < ESPECIFICAR NOMBRE Y CARGO DEL
                          TITULAR O SERVIDOR PÚBLICO DESIGNADO COMO REPRESENTANTE ÚNICO DE LA
                          DEPENDENCIA>, A QUIEN EN LO SUCESIVO SE LE DENOMINARÁ "LA ASIGNATARIA",
                          AL TENOR DE LAS SIGUIENTES DECLARACIONES Y CLÁUSULAS.`;
        this.contract.paragraph1 = paragraph1;
        this.form.get('paragraph1').setValue(paragraph1);

        const paragraph2 = `1.1.- Que es un organismo descentralizado de la Administración Pública Federal creado
                          mediante el Decreto por el que se expide la Ley Federal para la Administración y Enajenación
                          de Bienes del Sector Público (LFAEBSP), publicado en el Diario Oficial de la Federación (DOF)
                          el 19 de diciembre de 2002, así como la reforma de la LFAEBSP publicada en el DOF el 23 de
                          febrero de 2005, el cual se encuentra facultado para dar destino a los bienes descritos en el
                          artículo 1 de la LFAEBSP que para tal efecto le hayan sido transferidos.\n\n1.2.- Que en su
                          carácter de Director ${this.contract.puetsosae}, el C. ${this.contract.representativeSae}, cuenta con las
                          facultades suficientes para representarlo legalmente y celebrar el presente Convenio, de conformidad con
                          <citar el fundamento según el Estatuto Orgánico o los datos del instrumento que le fue otorgado para
                          representar al SAE y los poderes que al efecto le fueron concedidos>.\n\n1.3.- Que los bienes materia
                          del presente convenio le fueron transferidos al SAE por <nombre de la(s) entidad(es) transferente(s)>,
                          de conformidad con lo establecido en los artículos 1, 3, 6 bis, 7 y 13 de la LFAEBSP así como 12, 13
                          y 14 de su Reglamento.\n\n1.4.- Que de acuerdo con la solicitud hecha por "LA ASIGNATARIA" se verificó
                          que la misma cumple con los requisitos de procedencia necesarios; de igual forma se identificó que la
                          naturaleza de los bienes solicitados es compatible con el objeto para el que serán empleados.\n\n1.5.- Que
                          los bienes objeto del presente convenio se encuentran contemplados en los artículos 1 fracción VI y 34 de
                          la Ley Federal para la Administración y Enajenación de Bienes del Sector Público.\n\n1.6.- Que el Director
                          General, con fundamento en la fracción X del artículo 15 del Estatuto Orgánico del Servicio de Administración
                          y Enajenación de Bienes, mediante oficio <número y fecha del oficio de autorización> autorizó la asignación
                          de bienes a favor de "LA ASIGNATARIA".\n\n1.7.- Que para los efectos del presente convenio señala como su
                          domicilio legal el ubicado en Avenida Insurgentes Sur No. 1931, Colonia Guadalupe Inn, C.P. 01020,
                          Deleg. Álvaro Obregón, México, Distrito Federal.`;
        this.contract.paragraph2 = paragraph2;
        this.form.get('paragraph2').setValue(paragraph2);

        const paragraph3 = `2.1.- Que es una dependencia de la Administración Pública Federal centralizada,
                          según lo dispuesto por los <citar artículos> de la Constitución Política de los Estados Unidos Mexicanos
                          y <citar artículos> de la Ley Orgánica de la Administración Pública Federal.\n\n2.2.- Que tiene a su cargo
                          el desempeño de las atribuciones y facultades de conformidad con <señalar el marco normativo de la entidad
                          en el que se fundamenta la actuación para el destino de los bienes>.\n\n2.3.- Que en su carácter de
                          ${this.contract.puetsosae}, el C. ${this.contract.representativeSae}, tiene facultades suficientes para recibir y
                          suscribir el presente instrumento, de conformidad con <citar el fundamento legal de las facultades>.\n\n2.4.- Que
                          mediante oficio <citar número, fecha y detalle del oficio de solicitud>, "EL DONANTE" solicitó a "LA ASIGNATARIA"
                          la asignación de los bienes detallados en la cláusula cuarta del presente convenio.\n\n2.5.- Que para los efectos del presente Convenio señala como domicilio legal el ubicado en
                          ${this.contract.home}\n\n Expuesto lo anterior, las partes se obligan en los siguientes términos:`;
        this.contract.paragraph3 = paragraph3;
        this.form.get('paragraph3').setValue(paragraph3);

        const paragraph4 = `PRIMERA.- "El SAE" asigna a "LA ASIGNATARIA" la propiedad de los bienes que le fueron 
                          transferidos por <nombre de la entidad (es) transferente (s)> a fin de que estos <describir el 
                          destino>, los cuales cuales se describen a continuación  y que se entregan <especificar condición de 
                          "nuevos" y/o "usados">,en el estado en que se encuentran:`;
        this.contract.paragraph4 = paragraph4;
        this.form.get('paragraph4').setValue(paragraph4);

        const paragraph5 = `SEGUNDA.- "LA ASIGNATARIA" manifiesta que recibe a satisfacción los bienes asignados en 
                          la CLÁUSULA PRIMERA del presente convenio y libera a "EL SAE" de cualquier 
                          responsabilidad por los defectos y/o vicios ocultos que pudieran tener dichos bienes.\n\n
                          TERCERA.- "LA ASIGNATARIA" designa a <nombre de la persona y cargo o instancia> 
                          responsable del seguimiento del objeto del presente Convenio, en virtud de lo cual deberá 
                          presentar a "EL SAE" el informe de utilización correspondiente en un plazo de 45 días naturales 
                          posteriores a la fecha de suscripción del presente instrumento, acompañado de la 
                          documentación comprobatoria a que haya lugar.\n\n			
                          CUARTA.- Todos los gastos de traslado de los bienes asignados y los que resulten de la 
                          entrega de los mismos a "LA ASIGNATARIA" correrán por cuenta de ésta.\n\n
                          QUINTA.- A partir de la suscripción del presente instrumento y la entrega física de los bienes 
                          objeto de asignación, "LA ASIGNATARIA" asume las obligaciones, derechos y 
                          responsabilidades civiles derivados de la tenencia y uso de los bienes asignados. \n\n
                          SEXTA.- El presente Convenio surtirá sus efectos a partir de la fecha de su firma y quedará sin 
                          efectos en caso de que los bienes asignados se utilicen para fines distintos a los señalados en 
                          la CLÁUSULA PRIMERA de este instrumento, por lo que "LA ASIGNATARIA" deberá devolver 
                          a "EL SAE" dichos bienes de manera inmediata.\n\n 
                          SÉPTIMA.- Para la interpretación y cumplimiento del presente contrato, así como para todo 
                          aquello que no esté estipulado en el mismo, las partes se someterán a la legislación aplicable 
                          en la materia y a la jurisdicción y competencia de los Tribunales Federales en la Ciudad de 
                          México, renunciando a la jurisdicción que pudiera corresponderles por razón de domicilio actual 
                          o futuro o por cualquier otra causa\n\n
                          El presente Convenio se suscribe en tres tantos en la <anotar Ciudad y Estado>, a los <anotar 
                          fecha de firma del convenio>.`;
        this.contract.paragraph5 = paragraph5;
        this.form.get('paragraph5').setValue(paragraph5);
      } else if (this.contract.typeDonac === 2) {
        const paragraph1 = `CONVENIO DE ASIGNACIÓN QUE CELEBRAN POR UNA PARTE EL SERVICIO DE
                          ADMINISTRACIÓN Y ENAJENACIÓN DE BIENES, A QUIEN EN LO SUCESIVO SE LE
                          DENOMINARÁ "EL DONANTE" O "SAE", REPRESENTADO EN ESTE ACTO POR EL C.
                          ${this.contract.representativeSae},${this.contract.puetsosae} DEL
                          SERVICIO DE ADMINISTRACIÓN Y ENAJENACIÓN DE BIENES Y POR LA OTRA
                          <ESPECIFICAR EL NOMBRE DE LA DEPENDENCIA>, EN CALIDAD DE ASIGNATARIO
                          REPRESENTADA EN ESTE ACTO POR < ESPECIFICAR NOMBRE Y CARGO DEL
                          TITULAR O SERVIDOR PÚBLICO DESIGNADO COMO REPRESENTANTE ÚNICO DE LA
                          DEPENDENCIA>, A QUIEN EN LO SUCESIVO SE LE DENOMINARÁ "LA ASIGNATARIA",
                          AL TENOR DE LAS SIGUIENTES DECLARACIONES Y CLÁUSULAS.`;
        this.contract.paragraph1 = paragraph1;
        this.form.get('paragraph1').setValue(paragraph1);

        const paragraph2 = `1.1.- Que es un organismo descentralizado de la Administración Pública Federal creado
                          mediante el Decreto por el que se expide la Ley Federal para la Administración y Enajenación
                          de Bienes del Sector Público (LFAEBSP), publicado en el Diario Oficial de la Federación (DOF)
                          el 19 de diciembre de 2002, así como la reforma de la LFAEBSP publicada en el DOF el 23 de
                          febrero de 2005, el cual se encuentra facultado para dar destino a los bienes descritos en el
                          artículo 1 de la LFAEBSP que para tal efecto le hayan sido transferidos.\n\n1.2.- Que en su
                          carácter de Director ${this.contract.representativeSae}, el C. ${this.contract.puetsosae}, cuenta con las
                          facultades suficientes para representarlo legalmente y celebrar el presente Convenio, de conformidad con
                          <citar el fundamento según el Estatuto Orgánico o los datos del instrumento que le fue otorgado para
                          representar al SAE y los poderes que al efecto le fueron concedidos>.\n\n1.3.- Que los bienes materia
                          del presente convenio le fueron transferidos al SAE por <nombre de la(s) entidad(es) transferente(s)>,
                          de conformidad con lo establecido en los artículos 1, 3, 6 bis, 7 y 13 de la LFAEBSP así como 12, 13
                          y 14 de su Reglamento.\n\n1.4.- Que de acuerdo con la solicitud hecha por "LA ASIGNATARIA" se verificó
                          que la misma cumple con los requisitos de procedencia necesarios; de igual forma se identificó que la
                          naturaleza de los bienes solicitados es compatible con el objeto para el que serán empleados.\n\n1.5.- Que
                          los bienes objeto del presente convenio se encuentran contemplados en los artículos 1 fracción VI y 34 de
                          la Ley Federal para la Administración y Enajenación de Bienes del Sector Público.\n\n1.6.- Que el Director
                          General, con fundamento en la fracción X del artículo 15 del Estatuto Orgánico del Servicio de Administración
                          y Enajenación de Bienes, mediante oficio <número y fecha del oficio de autorización> autorizó la asignación
                          de bienes a favor de "LA ASIGNATARIA".\n\n1.7.- Que para los efectos del presente convenio señala como su
                          domicilio legal el ubicado en Avenida Insurgentes Sur No. 1931, Colonia Guadalupe Inn, C.P. 01020,
                          Deleg. Álvaro Obregón, México, Distrito Federal.`;
        this.contract.paragraph2 = paragraph2;
        this.form.get('paragraph2').setValue(paragraph2);

        const paragraph3 = `2.1.- Que es una dependencia de la Administración Pública Federal centralizada,
                          según lo dispuesto por los <citar artículos> de la Constitución Política de los Estados Unidos Mexicanos
                          y <citar artículos> de la Ley Orgánica de la Administración Pública Federal.\n\n2.2.- Que tiene a su cargo
                          el desempeño de las atribuciones y facultades de conformidad con <señalar el marco normativo de la entidad
                          en el que se fundamenta la actuación para el destino de los bienes>.\n\n2.3.- Que en su carácter de
                          ${this.contract.puetsosae}, el C. ${this.contract.representativeSae}, tiene facultades suficientes para recibir y
                          suscribir el presente instrumento, de conformidad con <citar el fundamento legal de las facultades>.\n\n2.4.- Que
                          mediante oficio <citar número, fecha y detalle del oficio de solicitud>, "EL DONANTE" solicitó a "LA ASIGNATARIA"
                          la asignación de los bienes detallados en la cláusula cuarta del presente convenio.`;
        this.contract.paragraph3 = paragraph3;
        this.form.get('paragraph3').setValue(paragraph3);

        const paragraph4 = `3.1.- Que los bienes materia del presente convenio, fueron transferidos a "EL DONANTE"
        en términos de la Ley Federal para la Administración y Enajenación de Bienes del Sector Público, previo
        acuerdo de transferencia celebrado entre la Secretaría de la Función Pública y "EL DONANTE", de
        conformidad con lo establecido en los artículos 1 fracción VI, 3, 6 bis, 7 y 13 de la citada Ley, así
        como en su Reglamento.\n\n3.2.- Que "EL DONANTE" tiene pleno derecho para disponer de los bienes objeto
        de este convenio y que los mismos se encuentran libres de gravamen, así como de cualquier carga o
        limitación que restrinja su utilización o disposición.`;
        this.contract.paragraph4 = paragraph4;
        this.form.get('paragraph4').setValue(paragraph4);

        const paragraph5 = `SEGUNDA.- "LA ASIGNATARIA" manifiesta que recibe a satisfacción los bienes asignados en 
                          la CLÁUSULA PRIMERA del presente convenio y libera a "EL SAE" de cualquier 
                          responsabilidad por los defectos y/o vicios ocultos que pudieran tener dichos bienes.\n\n
                          TERCERA.- "LA ASIGNATARIA" designa a <nombre de la persona y cargo o instancia> 
                          responsable del seguimiento del objeto del presente Convenio, en virtud de lo cual deberá 
                          presentar a "EL SAE" el informe de utilización correspondiente en un plazo de 45 días naturales 
                          posteriores a la fecha de suscripción del presente instrumento, acompañado de la 
                          documentación comprobatoria a que haya lugar.\n\n												
                          CUARTA.- Todos los gastos de traslado de los bienes asignados y los que resulten de la 
                          entrega de los mismos a "LA ASIGNATARIA" correrán por cuenta de ésta.\n\n
                          QUINTA.- A partir de la suscripción del presente instrumento y la entrega física de los bienes 
                          objeto de asignación, "LA ASIGNATARIA" asume las obligaciones, derechos y 
                          responsabilidades civiles derivados de la tenencia y uso de los bienes asignados. \n\n
                          SEXTA.- El presente Convenio surtirá sus efectos a partir de la fecha de su firma y quedará sin 
                          efectos en caso de que los bienes asignados se utilicen para fines distintos a los señalados en 
                          la CLÁUSULA PRIMERA de este instrumento, por lo que "LA ASIGNATARIA" deberá devolver 
                          a "EL SAE" dichos bienes de manera inmediata.\n\n
                          SÉPTIMA.- Para la interpretación y cumplimiento del presente contrato, así como para todo 
                          aquello que no esté estipulado en el mismo, las partes se someterán a la legislación aplicable 
                          en la materia y a la jurisdicción y competencia de los Tribunales Federales en la Ciudad de 
                          México, renunciando a la jurisdicción que pudiera corresponderles por razón de domicilio actual 
                          o futuro o por cualquier otra causa\n\n
                          El presente Convenio se suscribe en tres tantos en la <anotar Ciudad y Estado>, a los <anotar 
                          fecha de firma del convenio>.`;
        this.contract.paragraph5 = paragraph5;
        this.form.get('paragraph5').setValue(paragraph5);
      } else if (this.contract.typeDonac === 3) {
        const paragraph1 = `CONVENIO DE ASIGNACIÓN QUE CELEBRAN POR UNA PARTE EL SERVICIO DE 
                            ADMINISTRACIÓN Y ENAJENACIÓN DE BIENES, A QUIEN EN LO SUCESIVO SE LE 
                            DENOMINARÁ "EL DONANTE" O "SAE", REPRESENTADO EN ESTE ACTO POR EL C. 
                            ${this.contract.representativeSae}', EN SU CARÁCTER DE ${this.contract.puetsosae}  DEL 
                            SERVICIO DE ADMINISTRACIÓN Y ENAJENACIÓN DE BIENES Y POR LA OTRA
                            <ESPECIFICAR EL NOMBRE DE LA DEPENDENCIA>, EN CALIDAD DE ASIGNATARIO 
                            REPRESENTADA EN ESTE ACTO POR < ESPECIFICAR NOMBRE Y CARGO DEL 
                            TITULAR O SERVIDOR PÚBLICO DESIGNADO COMO REPRESENTANTE ÚNICO DE LA 
                            DEPENDENCIA>, A QUIEN EN LO SUCESIVO SE LE DENOMINARÁ "LA ASIGNATARIA", 
                            AL TENOR DE LAS SIGUIENTES DECLARACIONES Y CLÁUSULAS.`;
        this.contract.paragraph1 = paragraph1;
        this.form.get('paragraph1').setValue(paragraph1);

        const paragraph2 = `1.1.- Que es un organismo descentralizado de la Administración Pública Federal creado 
                            mediante el Decreto por el que se expide la Ley Federal para la Administración y Enajenación 
                            de Bienes del Sector Público (LFAEBSP), publicado en el Diario Oficial de la Federación (DOF) 
                            el 19 de diciembre de 2002, así como la reforma de la LFAEBSP publicada en el DOF el 23 de 
                            febrero de 2005, el cual se encuentra facultado para dar destino a los bienes descritos en el 
                            artículo 1 de la LFAEBSP que para tal efecto le hayan sido transferidos.\n\n
                            1.2.- Que en su carácter de Director <anotar puesto del Servidor Público del SAE>, el C.
                            <anotar el nombre del Servidor Público del SAE>, cuenta con las facultades suficientes para 
                            representarlo legalmente y celebrar el presente Convenio, de conformidad con <citar el 
                            fundamento según el Estatuto Orgánico o los datos del instrumento que le fue otorgado para 
                            representar al SAE y los poderes que al efecto le fueron concedidos>.\n\n
                            1.3.- Que los bienes materia del presente convenio le fueron transferidos al SAE por <nombre
                            de la(s) entidad(es) transferente(s)>, de conformidad con lo establecido en los artículos 1, 3, 6 
                            bis, 7 y 13 de la LFAEBSP así como 12, 13 y 14 de su Reglamento.\n\n
                            1.4.- Que de acuerdo con la solicitud hecha por "LA ASIGNATARIA" se verificó que la misma 
                            cumple con los requisitos de procedencia necesarios; de igual forma se identificó que la 
                            naturaleza de los bienes solicitados es compatible con el objeto para el que serán empleados.\n\n
                            1.5.- Que los bienes objeto del presente convenio se encuentran contemplados en los 
                            artículos 1 fracción VI y 34 de la Ley Federal para la Administración y Enajenación de Bienes 
                            del Sector Público.\n\n
                            1.6.- Que el Director General, con fundamento en la fracción X del artículo 15 del Estatuto 
                            Orgánico del Servicio de Administración y Enajenación de Bienes, mediante oficio <número y 
                            fecha del oficio de autorización> autorizó la asignación de bienes a favor de "LA 
                            ASIGNATARIA".\n\n
                            1.7.- Que para los efectos del presente convenio señala como su domicilio legal el ubicado en 
                            Avenida Insurgentes Sur No. 1931, Colonia Guadalupe Inn, C.P. 01020, Deleg. Álvaro Obregón, 
                            México, Distrito Federal.`;
        this.contract.paragraph2 = paragraph2;
        this.form.get('paragraph2').setValue(paragraph2);

        const paragraph3 = `2.1.- Que es una dependencia de la Administración Pública Federal centralizada, según lo 
                            dispuesto por los <citar artículos> de la Constitución Política de los Estados Unidos Mexicanos 
                            y <citar artículos> de la Ley Orgánica de la Administración Pública Federal. \n\n
                            2.2.- Que tiene a su cargo el desempeño de las atribuciones y facultades de conformidad con 
                            <señalar el marco normativo de la entidad en el que se fundamenta la actuación para el destino 
                            de los bienes>.\n\n
                            2.3.- Que en su carácter de <anotar puesto del Servidor Público >, el C. <anotar el nombre del 
                            Servidor Público>, tiene facultades suficientes para recibir y suscribir el presente instrumento, 
                            de conformidad con <citar el fundamento legal de las facultades>.'\n\n
                            2.4.- Que mediante oficio <citar número, fecha y detalle del oficio de solicitud de la asignación  
                            de bienes>.\n\n
                            2.5.- Que para los efectos del presente Convenio señala como domicilio legal el ubicado en ${this.contract.home}\n\n
                            Expuesto lo anterior, las partes se obligan en los siguientes términos:`;
        this.contract.paragraph3 = paragraph3;
        this.form.get('paragraph3').setValue(paragraph3);

        const paragraph4 = `PRIMERA.- "El SAE" asigna a "LA ASIGNATARIA" la propiedad de los bienes que le fueron 
                            transferidos por <nombre de la entidad (es) transferente (s)> a fin de que estos <describir el 
                            destino>, los cuales cuales se describen a continuación  y que se entregan <especificar condición de 
                            "nuevos" y/o "usados">,en el estado en que se encuentran:`;
        this.contract.paragraph4 = paragraph4;
        this.form.get('paragraph4').setValue(paragraph4);

        const paragraph5 = `SEGUNDA.- "LA ASIGNATARIA" manifiesta que recibe a satisfacción los bienes asignados en 
                            la CLÁUSULA PRIMERA del presente convenio y libera a "EL SAE" de cualquier 
                            responsabilidad por los defectos y/o vicios ocultos que pudieran tener dichos bienes.\n\n
                            TERCERA.- "LA ASIGNATARIA" designa a <nombre de la persona y cargo o instancia> 
                            responsable del seguimiento del objeto del presente Convenio, en virtud de lo cual deberá 
                            presentar a "EL SAE" el informe de utilización correspondiente en un plazo de 45 días naturales 
                            posteriores a la fecha de suscripción del presente instrumento, acompañado de la 
                            documentación comprobatoria a que haya lugar.\n\n 												
                            CUARTA.- Todos los gastos de traslado de los bienes asignados y los que resulten de la 
                            entrega de los mismos a "LA ASIGNATARIA" correrán por cuenta de ésta.\n\n
                            QUINTA.- A partir de la suscripción del presente instrumento y la entrega física de los bienes 
                            objeto de asignación, "LA ASIGNATARIA" asume las obligaciones, derechos y 
                            responsabilidades civiles derivados de la tenencia y uso de los bienes asignados. \n\n
                            SEXTA.- El presente Convenio surtirá sus efectos a partir de la fecha de su firma y quedará sin 
                            efectos en caso de que los bienes asignados se utilicen para fines distintos a los señalados en 
                            la CLÁUSULA PRIMERA de este instrumento, por lo que "LA ASIGNATARIA" deberá devolver 
                            a "EL SAE" dichos bienes de manera inmediata.\n\n 
                            SÉPTIMA.- Para la interpretación y cumplimiento del presente contrato, así como para todo 
                            aquello que no esté estipulado en el mismo, las partes se someterán a la legislación aplicable 
                            en la materia y a la jurisdicción y competencia de los Tribunales Federales en la Ciudad de 
                            México, renunciando a la jurisdicción que pudiera corresponderles por razón de domicilio actual 
                            o futuro o por cualquier otra causa\n\n
                            El presente Convenio se suscribe en tres tantos en la <anotar Ciudad y Estado>, a los <anotar 
                            fecha de firma del convenio>.`;
        this.contract.paragraph5 = paragraph5;
        this.form.get('paragraph5').setValue(paragraph5);
      }
    }
    this.udateDonacContract();
  }

  PUF_PREP_FECHA(P_FECHA: Date): string {
    const day = P_FECHA.getDate();
    const monthNames = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ];
    const month = monthNames[P_FECHA.getMonth()];
    const year = P_FECHA.getFullYear();

    return `${day} de ${month} de ${year}`;
  }

  selectFila1(event: any) {
    this.bienSeleccionado = event.data.requestId;
    this.goodNumber = event.data.goodNumber;
  }

  onQuitarBienesSeleccionados() {
    if (this.goodNumber) {
      this.goodService.updateStatus(this.goodNumber, 'ADA').subscribe({
        next: data => {
          this.donationService
            .updateSolicitudDonacion(Number(this.bienSeleccionado))
            .subscribe({
              next: data => {
                this.alert(
                  'success',
                  'El contrato seleccionado han sido retirado',
                  ''
                );
              },
              error: err => {
                console.log(err);
                this.alert(
                  'error',
                  '',
                  'Hubo un error actualizando el bien. Verifique'
                );
              },
            });
        },
        error: err => {
          console.log(err);
        },
      });
    } else {
      this.alert('warning', '', 'Primero debe seleccionar un contrato');
    }
  }

  configInputsDate() {
    this.bsConfigFromYear = Object.assign(
      {},
      {
        minMode: this.minModeFromYear,
        dateInputFormat: 'YYYY',
      }
    );
    this.bsConfigFromMonth = Object.assign(
      {},
      {
        minMode: this.minModeFromMonth,
        dateInputFormat: 'MMMM',
      }
    );
  }

  openModal() {
    let config: ModalOptions = {
      initialState: {
        op: this.op,
        contract: this.contract,
        formContract: this.form,
        typeRequest: this.parameterTypeDonation,
        callback: async (next: any[]) => {
          if (next) {
            console.error(next);
            this.loading = true;
            const data: any[] = await this.data.getAll();
            const newData: any[] = data.concat(next);
            this.data.load(newData);
            this.data.refresh();
            this.loading = false;
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ModalSelectRequestsComponent, config);
  }

  clean() {
    this.form.reset();
    this.idContrato = undefined;
    this.form.enable();
    this.data.load([]);
    this.totalItems = 0;
  }

  onImprimir() {
    const params = {};
    this.downloadReport('blank', params);
  }

  async onBloquearFirma() {
    if (this.form.get('idContract').value === null) {
      this.alert(
        'warning',
        this.title,
        'El contrato o convenio no ha sido generado.'
      );
      return;
    }

    if (this.form.get('contractKey').value === null) {
      this.alert(
        'warning',
        this.title,
        'El contrato o convenio no tiene clave armada.'
      );
      return;
    }

    if (this.form.get('donee').value === null) {
      this.alert(
        'warning',
        this.title,
        'El contrato o convenio no tiene un donatario válido asociado.'
      );
      return;
    }

    if (this.form.get('subscribeDate').value === null) {
      this.alert(
        'warning',
        this.title,
        'No se tiene fecha en la que se suscribe, favor de ponerla.'
      );
      return;
    }

    if (this.form.get('job').value === null) {
      this.alert(
        'warning',
        this.title,
        'No se tiene el oficio, favor de ponerla.'
      );
      return;
    }

    if (this.form.get('paragraph1').value === null) {
      this.alert(
        'warning',
        this.title,
        'Al menos el primer párrafo no debe ser nulo.'
      );
      return;
    }

    const V_NUM: number = await this.getDonacRequestGood();

    if (V_NUM === 0) {
      this.alert('warning', this.title, 'No se tienen bienes integrados.');
      return;
    }

    // Esto lo Hace el BACK o back
    //PUP_OBTIENE_FOLIO();
    const resp: any = await this.pupObtieneFolio();
    await this.pupArmaClave();

    if (this.pupVerificaClave()) {
      this.alert('warning', this.title, 'La clave armada no es consistente.');
      return;
    }

    this.contract.contractStatus = 'P';
    this.form.get('contractStatus').setValue('P');
    this.udateDonacContract();
    this.desaHabForms();
  }

  async postQueryContract() {
    const dataRequest: any[] = await this.getDonacRequest(
      this.contract.requestId,
      true
    );
    console.error(dataRequest);
    if (dataRequest.length > 0) {
      this.contract.don = dataRequest[0].requestTypeId;
      this.form.get('don').setValue(dataRequest[0].requestTypeId);
      this.contract.requestDate = dataRequest[0].requestDate;
      this.form.get('requestDate').setValue(dataRequest[0].requestDate);
      this.contract.authorizeDate = dataRequest[0].authorizeDate;
      this.form.get('authorizeDate').setValue(dataRequest[0].authorizeDate);
      this.contract.justification = dataRequest[0].justification;
      this.form.get('justification').setValue(dataRequest[0].justification);
    }
    const dataCatalog: any = await this.granteeByContract(
      this.contract.donee ?? null
    );
    if (dataCatalog) {
      this.contract.razonSocial = dataCatalog.razonSocial;
      this.form.get('razonSocial').setValue(dataCatalog.razonSocial);
      this.contract.descDonatario = dataCatalog.description;
      this.form.get('descDonatario').setValue(dataCatalog.description);
      this.contract.estado = dataCatalog.nomedo;
      this.form.get('estado').setValue(dataCatalog.nomedo);
      this.contract.municipio = dataCatalog.nommun;
      this.form.get('municipio').setValue(dataCatalog.nommun);
      this.contract.typeDonac = dataCatalog.type;
      this.form.get('typeDonac').setValue(dataCatalog.type);
    }
  }

  granteeByContract(id: number | string) {
    return new Promise<any>((res, _rej) => {
      this.granteeService.getById2(id).subscribe({
        next: (response: any) => {
          console.log(response);
          res(response.data);
        },
        error: err => {
          res(null);
        },
      });
    });
  }

  udateDonacContract() {
    //this.contract.paragraph1 = this.form.value;
    const contract: any = this.contract;
    contract['ContractKey'] = this.contract.contractKey;
    delete contract['donee'];
    delete contract['typeDonac'];
    delete contract['justification'];
    delete contract['requestDate'];
    delete contract['authorizeKey'];
    delete contract['authorizeDate'];
    delete contract['don'];
    delete contract['razonSocial'];
    delete contract['razonSocial'];
    delete contract['descDonatario'];
    delete contract['estado'];
    delete contract['municipio'];
    delete contract['contractKey'];
    delete contract['nbOrigin'];
    this.donationRequestService.udateDonacContract(contract).subscribe({
      next: resp => {
        this.alert(
          'success',
          this.title,
          'Se ha actualizado el contrato correctamente.'
        );
      },
      error: err => {
        this.alert(
          'error',
          this.title,
          'No se ha podido actualizar el contrato.'
        );
      },
    });
  }

  pupObtieneFolio() {
    return new Promise<any>((res, rej) => {
      const model = {
        proceeding: this.form.get('cto').value,
        year: this.form.get('year').value,
      };
      this.donationRequestService.pupGetFolio(model).subscribe({
        next: (response: any) => {
          console.error(response.consec);
          if (response) {
            this.form.get('don').setValue(response.consec);
          }
          res(response);
        },
        error: err => {
          this.alert(
            'error',
            this.title,
            'Error en la localización del folio.'
          );
          res(null);
        },
      });
    });
  }

  pupVerificaClave(cveContrato: string = this.contract.contractKey) {
    let vret: boolean = false;
    const parts: string[] = cveContrato.split('/');
    if (parts.length !== 8) {
      vret = true;
    } else {
      for (let vi = 0; vi < 8; vi++) {
        if (!parts[vi]) {
          vret = true;
          break;
        }
      }
    }
    return vret;
  }

  getDonacRequestGood(advanceProp: boolean = false) {
    return new Promise<number>((res, rej) => {
      const params: ListParams = {};
      params['filter.contractId'] = `$eq:${this.contract.id}`;
      if (advanceProp) params['filter.advanceProp'] = `$eq:P`;
      this.donationRequestService.getDonacRequestGood(params).subscribe({
        next: response => {
          res(response.count);
        },
        error: err => {
          res(0);
        },
      });
    });
  }

  onCerrarContrato() {
    if (this.contract.contractStatus === 'P') {
      if (this.contract.id === null) {
        this.alert(
          'error',
          this.title,
          'No se ha podido cerrar el contrato, el contrato no existe.'
        );
        return;
      }

      if (this.form.get('contractKey').value === null) {
        this.alert(
          'error',
          this.title,
          'El contrato o convenio no tiene clave armada.'
        );
        return;
      }

      if (this.form.get('donee').value === null) {
        this.alert(
          'error',
          this.title,
          'El contrato o convenio no tiene un donatario válido asociado.'
        );
        return;
      }

      if (this.form.get('folioScan').value === null) {
        this.alert(
          'error',
          this.title,
          'No se ha solicitado el folio de escaneo.'
        );
        return;
      }

      const model = {
        vScreen: 'FDONAC_DOCUM',
        contractId: this.contract.id,
        scannerFolio: this.form.get('folioScan').value,
        deliveryDate: this.form.get('deliveryDate').value,
      };
      this.donationRequestService.closeContract(model).subscribe({
        next: response => {
          console.log(response);
          this.alert(
            'success',
            this.title,
            'Se ha cerrado el contrato correctamente.'
          );
          this.getDonacContract();
        },
        error: err => {
          this.alert(
            'error',
            this.title,
            'No se ha podido cerrar el contrato.'
          );
        },
      });
    }
  }

  downloadReport(reportName: string, params: any) {
    // this.loadingText = 'Generando reporte ...';
    this.siabService.fetchReport(reportName, params).subscribe({
      next: response => {
        this.loading = false;
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
      },
    });
  }
}
