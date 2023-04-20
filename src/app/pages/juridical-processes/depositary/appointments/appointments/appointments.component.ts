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
import { BehaviorSubject } from 'rxjs';
import { IDescriptionByNoGoodBody } from 'src/app/core/models/good/good.model';
import { IAppointmentDepositary } from 'src/app/core/models/ms-depositary/ms-depositary.interface';
import { IGood } from 'src/app/core/models/ms-good/good';
import {
  CURP_PATTERN,
  KEYGENERATION_PATTERN,
  PHONE_PATTERN,
  RFC_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { AppointmentsService } from '../services/appointments.service';

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
  public checked = false;
  globalVars: any = {
    noExiste: 0,
    depositaria: '',
    no_dep: '',
    folescaneo: '',
    procgenimg: null,
    folsoldigt: null,
    folescaneo2: null,
  };
  public good: IGood;
  noBien: number = null;
  depositaryAppointment: IAppointmentDepositary;
  // Loadings
  loadingGood: boolean = false;
  loadingAppointment: boolean = false;
  // Selects
  delegations = new DefaultSelect();
  delegationSelectValue: string = '';
  locality = new DefaultSelect();
  localitySelectValue: string = '';
  state = new DefaultSelect();
  stateSelectValue: string = '';
  postalCode = new DefaultSelect();
  postalCodeSelectValue: string = '';

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private exampleService: ExampleService,
    private appointmentsService: AppointmentsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loading = true;
  }
  private prepareForm() {
    this.form = this.fb.group({
      noBien: ['', Validators.required], //*
      descriptionGood: { value: '', disabled: true }, //*
      noExpedient: { value: '', disabled: true }, //*
      averiguacionPrevia: [{ value: '', disabled: true }], //*
      causaPenal: [{ value: '', disabled: true }],
      estatusBien: [{ value: '', disabled: true }], //*
      fechaAcuerdoAsegurado: { value: '', disabled: true }, //*
      fechaRecepcion: { value: '', disabled: true }, //*
      fechaDecomiso: { value: '', disabled: true }, //*

      tipoNombramiento: '', //*
      ///*"Administrador, Depositaría, Interventor, Comodatarío,Bien en uso del SAE"
      tipoDepositaria: ['', [Validators.pattern(STRING_PATTERN)]], //*
      estatus: '', //* Provisional, Definitiva
      representanteSAE: ['', [Validators.pattern(STRING_PATTERN)]], //*
      nombre: ['', [Validators.pattern(STRING_PATTERN)]], //*
      bienesMenaje: '', //* Sin Menaje, Con Menaje

      depositaria: ['', [Validators.pattern(STRING_PATTERN)]], //*
      representante: ['', [Validators.pattern(STRING_PATTERN)]], //*
      calle: [
        { value: '', disabled: false },
        [Validators.pattern(STRING_PATTERN)],
      ], //*
      noExterno: [
        { value: '', disabled: false },
        [Validators.pattern(STRING_PATTERN)],
      ], //*
      noInterno: [
        { value: '', disabled: false },
        [Validators.pattern(STRING_PATTERN)],
      ], //*
      colonia: { value: null, disabled: false }, //*
      delegacionMunicipio: { value: null, disabled: false }, //*
      codigoPostal: { value: null, disabled: false }, //*
      entidadFederativa: { value: null, disabled: false }, //*
      telefono: [
        { value: '', disabled: false },
        [Validators.pattern(PHONE_PATTERN)],
      ], //*
      rfc: [{ value: '', disabled: false }, [Validators.pattern(RFC_PATTERN)]], //*
      curp: [
        { value: '', disabled: false },
        [Validators.pattern(CURP_PATTERN)],
      ], //*
      tipoPersona: [
        { value: '', disabled: false },
        [Validators.pattern(STRING_PATTERN)],
      ], //*
      tipoPersona2: [
        { value: '', disabled: false },
        [Validators.pattern(STRING_PATTERN)],
      ], //*
      giro: [
        { value: '', disabled: false },
        [Validators.pattern(STRING_PATTERN)],
      ],
      referencia: [
        { value: '', disabled: false },
        [Validators.pattern(STRING_PATTERN)],
      ],

      remocion: '',
      fecha: '',
      noOficio: '',

      // Acuerdo Junta de Gobierno
      fechaAcuerdo: '',
      noAcuerdo: '',

      contraprestacion: '',
      honorarios: ['', [Validators.pattern(STRING_PATTERN)]],
      iva: '',
      noNombramiento: '',
      fechapage: '',

      anexo: ['', [Validators.pattern(STRING_PATTERN)]],
      observaciones: ['', [Validators.pattern(STRING_PATTERN)]],

      folioRemocion: ['', [Validators.pattern(KEYGENERATION_PATTERN)]],
      folioActaDepositaria: ['', [Validators.pattern(KEYGENERATION_PATTERN)]],
    });
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

  btnDetallesPago() {
    console.log('Detalle Pagos');
  }

  btnReportesJuridicos() {
    console.log('Reportes Juridicos');
  }

  btnReportesAdministrativos() {
    console.log('Reportes Administrativos');
  }

  btnIngresoMasivoPagos() {
    console.log('Ingresos Masivos Pagos');
  }

  btnCatalogoConceptosPagos() {
    console.log('Conceptos de Pagos');
  }

  btnCatalogoDepositariasPersona() {
    console.log('Cátalogo Depositarias');
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
    this.form
      .get('depositaria')
      .setValue(this.depositaryAppointment.responsible);
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
  }

  setDataPerson() {
    this.form
      .get('calle')
      .setValue(this.depositaryAppointment.personNumber.calle);
    this.form
      .get('noExterno')
      .setValue(this.depositaryAppointment.personNumber.no_exterior);
    this.form
      .get('noInterno')
      .setValue(this.depositaryAppointment.personNumber.no_interior);
    // this.form
    //   .get('colonia')
    //   .setValue(this.depositaryAppointment.personNumber.colonia);
    // this.form
    //   .get('delegacion_municipio')
    //   .setValue(this.depositaryAppointment.personNumber.deleg_munic);
    this.form
      .get('codigoPostal')
      .setValue(this.depositaryAppointment.personNumber.codigo_postal);
    // this.form
    //   .get('entidadFederativa')
    //   .setValue(this.depositaryAppointment.personNumber.cve_entfed);
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
            'dd-MM-yyyy'
          );
        }
        let dateReception: any;
        if (this.good.expediente.receptionDate) {
          dateReception = this.datePipe.transform(
            this.good.expediente.receptionDate,
            'dd-MM-yyyy'
          );
        }
        this.form.get('fechaRecepcion').setValue(dateReception);
        let dateConfiscate: any;
        if (this.good.expediente.confiscateDictamineDate) {
          dateConfiscate = this.datePipe.transform(
            this.good.expediente.confiscateDictamineDate,
            'dd-MM-yyyy'
          );
        }
        this.form.get('fechaDecomiso').setValue(dateConfiscate);
      }
    }
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
        this.postalCodeSelectValue = event.postalCode;
        if (event.stateKey) {
          this.delegationSelectValue = event.stateKey;
          // call function
        }
        if (event.municipalityKey) {
          this.delegationSelectValue = event.municipalityKey;
          // CALL FUNCTION
        }
        if (event.townshipKey) {
          this.delegationSelectValue = event.townshipKey;
          // call function
        }
      }
    } else {
      this.postalCodeSelectValue = '';
    }
  }
  getPostalCodeByDetail(
    paramsData: ListParams,
    onlyPostalCode: boolean = false
  ) {
    console.log(
      this.stateSelectValue,
      paramsData,
      this.delegationSelectValue,
      onlyPostalCode
    );
    // if (
    //   !this.stateSelectValue &&
    //   !this.delegationSelectValue &&
    //   !this.localitySelectValue
    // ) {
    //   return;
    // }
    const params: any = new FilterParams();
    params.removeAllFilters();
    // params['sortBy'] = 'township:DESC';
    if (this.delegationSelectValue) {
      params.addFilter('municipalityKey', this.delegationSelectValue);
    }
    if (this.stateSelectValue) {
      params.addFilter('stateKey', this.stateSelectValue);
    }
    if (this.localitySelectValue) {
      params.addFilter('township', this.localitySelectValue);
    }
    params.addFilter('postalCode', paramsData['search'], SearchFilter.LIKE);
    console.log(params, paramsData, onlyPostalCode);
    let subscription = this.appointmentsService
      .getPostalCodeByFilter(params.getFilterParams())
      .subscribe({
        next: data => {
          console.log(data.data);
          this.postalCode = new DefaultSelect(
            data.data.map((i: any) => {
              i.description = '#' + i.postalCode + ' -- ' + i.township;
              return i;
            }),
            data.count
          );
          if (this.postalCodeSelectValue) {
            this.form.get('colonia').setValue(this.postalCodeSelectValue);
            this.form.get('colonia').updateValueAndValidity();
          }
          subscription.unsubscribe();
        },
        error: error => {
          this.postalCode = new DefaultSelect();
          this.onLoadToast('error', 'Error', error.error.message);
          subscription.unsubscribe();
        },
      });
  }

  changeLocalityDetail(event: any) {
    if (event) {
      if (event.townshipKey) {
        this.localitySelectValue = event.townshipKey;
      }
    } else {
      this.localitySelectValue = '';
    }
  }
  getLocalityByDetail(paramsData: ListParams) {
    console.log(this.stateSelectValue, paramsData, this.delegationSelectValue);
    if (!this.stateSelectValue && !this.delegationSelectValue) {
      return;
    }
    const params: any = new FilterParams();
    params.removeAllFilters();
    params['sortBy'] = 'township:DESC';
    params.addFilter('municipalityKey', this.delegationSelectValue);
    params.addFilter('stateKey', this.stateSelectValue);
    params.addFilter('township', paramsData['search'], SearchFilter.LIKE);
    console.log(params, paramsData);
    let subscription = this.appointmentsService
      .getLocalityByFilter(params.getFilterParams())
      .subscribe({
        next: data => {
          console.log(data.data);
          this.locality = new DefaultSelect(
            data.data.map((i: any) => {
              i.description = '#' + i.townshipKey + ' -- ' + i.township;
              return i;
            }),
            data.count
          );
          if (this.localitySelectValue) {
            this.form.get('colonia').setValue(this.localitySelectValue);
            this.form.get('colonia').updateValueAndValidity();
          }
          subscription.unsubscribe();
        },
        error: error => {
          this.locality = new DefaultSelect();
          this.onLoadToast('error', 'Error', error.error.message);
          subscription.unsubscribe();
        },
      });
  }

  changeDelegationDetail(event: any) {
    if (event) {
      if (event.stateKey) {
        this.delegationSelectValue = event.stateKey;
      }
    } else {
      this.delegationSelectValue = '';
    }
  }
  getDelegationByDetail(paramsData: ListParams) {
    console.log(this.stateSelectValue, paramsData);
    if (!this.stateSelectValue) {
      return;
    }
    const params: any = new FilterParams();
    params.removeAllFilters();
    params['sortBy'] = 'municipality:DESC';
    params.addFilter('stateKey', this.stateSelectValue);
    params.addFilter('municipality', paramsData['search'], SearchFilter.LIKE);
    console.log(params, paramsData);
    let subscription = this.appointmentsService
      .getDelegationsByFilter(params.getFilterParams())
      .subscribe({
        next: data => {
          console.log(data.data);
          this.delegations = new DefaultSelect(
            data.data.map((i: any) => {
              i.municipality =
                '#' + i.municipalityKey + ' -- ' + i.municipality;
              return i;
            }),
            data.count
          );
          if (this.delegationSelectValue) {
            this.form
              .get('delegacionMunicipio')
              .setValue(this.delegationSelectValue);
            this.form.get('delegacionMunicipio').updateValueAndValidity();
          }
          subscription.unsubscribe();
        },
        error: error => {
          this.delegations = new DefaultSelect();
          this.onLoadToast('error', 'Error', error.error.message);
          subscription.unsubscribe();
        },
      });
  }

  changeStateDetail(event: any) {
    if (event) {
      if (event.id) {
        this.stateSelectValue = event.id;
      }
    } else {
      this.stateSelectValue = '';
    }
  }
  getStateByDetail(paramsData: ListParams) {
    console.log(this.stateSelectValue, paramsData);
    console.log(paramsData, this.stateSelectValue);
    if (this.stateSelectValue) {
      let subscription = this.appointmentsService
        .getStateOfRepublicById(this.stateSelectValue)
        .subscribe({
          next: data => {
            console.log(data);
            this.state = new DefaultSelect(
              [data].map(i => {
                i.descCondition = '#' + i.id + ' -- ' + i.descCondition;
                return i;
              }),
              1
            );
            this.form.get('entidadFederativa').setValue(this.stateSelectValue);
            this.form.get('entidadFederativa').updateValueAndValidity();
            subscription.unsubscribe();
          },
          error: error => {
            this.state = new DefaultSelect();
            this.onLoadToast('error', 'Error', error.error.message);
            subscription.unsubscribe();
          },
        });
    } else {
      paramsData['sortBy'] = 'id:DESC';
      let subscription = this.appointmentsService
        .getStateOfRepublicByAll(paramsData)
        .subscribe({
          next: data => {
            console.log(data);
            this.state = new DefaultSelect(
              data.data.map(i => {
                i.descCondition = '#' + i.id + ' -- ' + i.descCondition;
                return i;
              }),
              data.count
            );
            subscription.unsubscribe();
          },
          error: error => {
            this.state = new DefaultSelect();
            this.onLoadToast('error', 'Error', error.error.message);
            subscription.unsubscribe();
          },
        });
    }
  }
}
