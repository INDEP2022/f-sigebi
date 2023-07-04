/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { INotification } from 'src/app/core/models/ms-notification/notification.model';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { GoodsProcessValidationExtdomService } from '../services/goods-process-validation-extdom.service';
import { COLUMNS_GOODS_LIST_EXTDOM } from './process-extdoom-columns';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-goods-process-validation-extdom',
  templateUrl: './goods-process-validation-extdom.component.html',
  styleUrls: ['./goods-process-validation-extdom.component.scss'],
})
export class GoodsProcessValidationExtdomComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  // TABLA DATA
  tableSettings = {
    ...this.settings,
  };
  dataTable = new BehaviorSubject<ListParams>(new ListParams());
  tableSettings2 = {
    ...this.settings,
  };
  dataTable2 = new BehaviorSubject<ListParams>(new ListParams());
  // SELECTS
  selectAsunto = new DefaultSelect();

  tableSettingsHistorico = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true, //oculta subheaader de filtro
    mode: 'external', // ventana externa

    columns: {
      noBien: { title: 'No. Bien' }, //*
      fechaCambio: { title: 'Fecha Cambio' },
      usuarioCambio: { title: 'Usuario Cambio' },
      folioUnivCambio: { title: 'Folio Univ Cambio' },
      fechaLibera: { title: 'Fecha Libera' },
      usuarioLibera: { title: 'Usuario Libera' },
      folioUnivLibera: { title: 'Folio Univ Libera' },
    },
  };
  // Data table
  dataTableHistorico = [
    {
      noBien: 'No. Bien',
      fechaCambio: 'Fecha Cambio',
      usuarioCambio: 'Usuario Cambio',
      folioUnivCambio: 'Folio Univ Cambio',
      fechaLibera: 'Fecha Libera',
      usuarioLibera: 'Usuario Libera',
      folioUnivLibera: 'Folio Univ Libera',
    },
  ];
  public listadoHistorico: boolean = false;
  // Data
  notificationData: INotification;
  // Forms
  public form: FormGroup;
  public formEscaneo: FormGroup;
  // Params
  origin: string = '';
  P_NO_TRAMITE: number = null;
  P_GEST_OK: number = null;

  constructor(
    private fb: FormBuilder,
    private svGoodsProcessValidationExtdomService: GoodsProcessValidationExtdomService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
    this.tableSettings = {
      ...this.settings,
      columns: COLUMNS_GOODS_LIST_EXTDOM,
    };
    this.tableSettings2 = {
      ...this.settings,
      columns: COLUMNS_GOODS_LIST_EXTDOM,
    };
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe((params: any) => {
        this.origin = params['origin'] ?? null;
        this.P_NO_TRAMITE = params['P_NO_TRAMITE'] ?? null;
        this.P_GEST_OK = params['P_GEST_OK'] ?? null;
      });
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      expedientNumber: ['', [Validators.required]], //* EXPEDIENTE
      wheelNumber: ['', [Validators.required]], //* VOLANTE
      receiptDate: '', //* FECHA DE RECEPCION
      expedientTransferenceNumber: '', //* NO EXPEDIENTES TRANSFERENTES
      officeExternalKey: ['', [Validators.pattern(KEYGENERATION_PATTERN)]], //* CLAVE OFICIO EXTERNO
      externalOfficeDate: '', //* FCHA OFICIO EXTERNO
      externalRemitter: ['', [Validators.pattern(STRING_PATTERN)]], //* REMITENTE EXTERNO
      protectionKey: ['', [Validators.pattern(KEYGENERATION_PATTERN)]], //* CVE AMPARO
      touchPenaltyKey: ['', [Validators.pattern(KEYGENERATION_PATTERN)]], //* CVE TOCA PENAL
      circumstantialRecord: ['', [Validators.pattern(KEYGENERATION_PATTERN)]], //* ACTA CIRCUNSTANCIADA
      preliminaryInquiry: ['', [Validators.pattern(STRING_PATTERN)]], //* AVERIGUACION PREVIA
      criminalCase: ['', [Validators.pattern(STRING_PATTERN)]], //* CAUSA PENAL
      affairKey: [null, [Validators.pattern(STRING_PATTERN)]], // extenso ASUNTO SELECT
      indiciadoNumber: ['', [Validators.pattern(STRING_PATTERN)]], // extenso INDICIADO
      minpubNumber: ['', [Validators.pattern(STRING_PATTERN)]], // extenso MINISTERIO PUBLICO
      courtNumber: ['', [Validators.pattern(STRING_PATTERN)]], // extenso JUZGADO
      delegationNumber: ['', [Validators.pattern(STRING_PATTERN)]], // extenso DELEGACION
      entFedKey: ['', [Validators.pattern(STRING_PATTERN)]], // extenso ENTIDAD FEDERATIVA
      cityNumber: ['', [Validators.pattern(STRING_PATTERN)]], // extenso CIUDAD
      transference: ['', [Validators.pattern(STRING_PATTERN)]], // extenso TRANSFERENTE
      stationNumber: ['', [Validators.pattern(STRING_PATTERN)]], // extenso EMISORA
      authority: ['', [Validators.pattern(STRING_PATTERN)]], // extenso AUROTIDAD
    });
    this.formEscaneo = this.fb.group({
      folioEscaneo: ['', [Validators.pattern(KEYGENERATION_PATTERN)]],
    });
  }

  initForm() {
    if (this.P_GEST_OK == 1) {
      // GESTION TRAMITE UPDATE
      // CONDICION DE VOLANTE O EXPEDIENTE
    }
  }

  getNotificationData() {
    this.loading = true;
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('fileNumber', this.form.get('noExpediente').value);
    params.addFilter('wheelNumber', this.form.get('noVolante').value);
    this.svGoodsProcessValidationExtdomService
      .getNotificationByFilters(params.getParams())
      .subscribe({
        next: data => {
          console.log('NOTIFICACION DATA ', data);
          this.notificationData = data.data[0];
          this.loading = false;
        },
        error: error => {
          console.log(error);
          this.loading = false;
        },
      });
  }

  btnAgregar() {
    console.log('Agregar');
  }

  btnEliminar() {
    console.log('Eliminar');
  }
  btnEjecutarCambios() {
    console.log('EjecutarCambios');
  }

  btnConsultarHistorico() {
    console.log('ConsultarHistorico');
    this.listadoHistorico = true;
  }

  btnSalir() {
    console.log('Salir');
    this.listadoHistorico = false;
  }
  /**
   * SELECTS PANTALLA
   */

  getAffair(paramsData: ListParams, getByValue: boolean = false) {}
}
