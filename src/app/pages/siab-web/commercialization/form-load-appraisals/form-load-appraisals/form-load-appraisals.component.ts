import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { FormLoadAppraisalsService } from 'src/app/core/services/catalogs/form-load-appraisals.service';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { FlatFileNotificationsService } from 'src/app/pages/documents-reception/flat-file-notifications/flat-file-notifications.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  APPRAISALS_COLUMNS,
  DETAIL_APPRAISALS_COLUMNS,
  GOODS_COLUMNS,
} from './table-form';

interface IExcelToJson {
  NO_BIEN: number;
}

@Component({
  selector: 'app-form-load-appraisals',
  templateUrl: './form-load-appraisals.component.html',
  styles: [],
})
export class FormLoadAppraisalsComponent extends BasePage implements OnInit {
  form: FormGroup;
  maxDate = new Date();

  requested: boolean = false;
  apraisalLength: number;
  estatusLotes: any;
  propertyValues: string[] = [];
  dataExcel: any = [];
  bottonDesible: boolean = false;
  commaSeparatedString: string = '';

  ///
  params = new BehaviorSubject<ListParams>(new ListParams());
  params1 = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  totalItems1: number = 0;
  totalItems2: number = 0;
  fileReader = new FileReader();
  selectedTipo = new DefaultSelect();
  dataApraisals: LocalDataSource = new LocalDataSource();
  dataGood: LocalDataSource = new LocalDataSource();
  dataDetailApraisal: LocalDataSource = new LocalDataSource();

  btnContinuarOficio: boolean = false;
  btnValidaArchivo: boolean = false;
  btnInsertaArchivo: boolean = false;
  btnValidarArc: boolean = false;
  btnUpdArchivo: boolean = false;
  btnAgrArchivo: boolean = false;

  lnkDesFormato: boolean = false;
  lnkValArchivo: boolean = false;
  lnkAvaRechazados: boolean = false;
  lnkInsAvaluos: boolean = false;
  lnkAddAvaluo: boolean = false;
  lnkUpdAvaluo: boolean = false;

  Divreg: boolean = false;

  gvAvaluosRechazados: boolean = false;
  gvBienesRecahazados: boolean = false;

  apraisalsSettings = {
    ...TABLE_SETTINGS,
    actions: {
      columnTitle: 'Acciones',
      position: 'right',
      add: false,
      edit: false,
      delete: false,
    },
  };
  goodSettings = {
    ...TABLE_SETTINGS,
    actions: {
      columnTitle: 'Acciones',
      position: 'right',
      add: false,
      edit: false,
      delete: false,
    },
  };
  detailApraisalsSettings = {
    ...TABLE_SETTINGS,
    actions: {
      columnTitle: 'Acciones',
      position: 'right',
      add: false,
      edit: false,
      delete: false,
    },
  };
  jsonToCsv: any[] = [
    {
      CVE_AVALUO: '',
      FECHA_AVALUO: '',
      VIGENCIA_AVALUO: '',
      NO_BIEN: '',
      VRI_IVA: '',
      VRI_IVA_REDONDEADO: '',
      VC: '',
      VC_IVA: '',
      NOMBRE_VALUADOR: '',
      NOMENCLATURA_OFICIO: '',
      APTO_NO_APTO: '',
    },
  ];
  constructor(
    private formLoadAppraisalsService: FormLoadAppraisalsService,
    private router: Router,
    private excelService: ExcelService,
    private fileNotificationServices: FlatFileNotificationsService
  ) {
    super();
    this.apraisalsSettings.columns = APPRAISALS_COLUMNS;
    this.goodSettings.columns = GOODS_COLUMNS;
    this.detailApraisalsSettings.columns = DETAIL_APPRAISALS_COLUMNS;
  }

  ngOnInit(): void {
    this.createForm();
  }
  async inicialize() {
    if (!this.requested) {
      console.log('cargarEvento');
      this.cargaDDLEvento();
      this.controlBotnoes('', '');
    } else {
      this.cargarEvento(
        await this.obtenerEvento(1, this.form.value.numeroEvento, 'A', '')
      );
    }
  }
  createForm() {
    this.form = new FormGroup({
      numeroEvento: new FormControl(1471, [Validators.pattern(STRING_PATTERN)]),
      claveProceso: new FormControl('', [Validators.pattern(STRING_PATTERN)]),
      fechaEvento: new FormControl('', [Validators.pattern(STRING_PATTERN)]),
      Observaciones: new FormControl('', [Validators.pattern(STRING_PATTERN)]),
      FecSolicitud: new FormControl('', [Validators.pattern(STRING_PATTERN)]),
      Tipo: new FormControl('', [Validators.pattern(STRING_PATTERN)]),
      Estatus: new FormControl('', [Validators.pattern(STRING_PATTERN)]),
      Referencia: new FormControl('', [Validators.pattern(STRING_PATTERN)]),
    });
    this.inicialize();
  }
  async cargaDDLEvento() {
    this.estatusLotes = await this.CargaDDLDrop();
    console.log(this.estatusLotes);
    if (this.estatusLotes.length > 0) {
      // this.onLoadToast('warning', 'Advertencia', 'Selecciona oficio');
    } else {
      this.onLoadToast('warning', 'Advertencia', 'No exixte ningun evento');
      this.form.controls['Tipo'].setValue('NO EXISTE NINGUN EVENTO');
    }
  }
  async CargaDDLDrop() {
    return new Promise((resolve, reject) => {
      let idTipoOficio = 0;
      let body: any = {};
      body['pOption'] = 9;
      body['pEvent'] = ''; //this.form.value.numeroEvento;
      body['pLot'] = 0;
      body['pTypeGood'] = '';
      body['pEventKey'] = 0;
      body['pTrans'] = 0;
      if (this.form.value.Tipo != '') {
        if (JSON.parse(this.form.value.Tipo) > 0) {
          idTipoOficio = JSON.parse(this.form.value.Tipo);
        }
      }
      this.formLoadAppraisalsService.obtenerEstatusLotes(body).subscribe({
        next: data => {
          this.selectedTipo = new DefaultSelect(data.data, data.count);
          resolve(data.data);
        },
        error: err => {
          console.log(err);
        },
      });
    });
  }

  async CargaGrids() {
    this.ocultaDivNoti();
    this.cargarEvento(
      await this.obtenerEvento(1, this.form.value.numeroEvento, 'I', '')
    );
    this.cargarBienes(
      await this.obtenerEvento(2, this.form.value.numeroEvento, 'I', '')
    );
    this.cargarAvaluos(
      await this.obtenerEvento(3, this.form.value.numeroEvento, 'I', '')
    );
  }
  lnkBuscar_Click() {
    if (this.form.value.numeroEvento != '') {
      this.CargaGrids();
    } else {
      this.onLoadToast('warning', 'Advertencia', 'Debe capturar el No. Evento');
    }
  }

  cargarEvento(evento: any) {
    console.log(evento.data);
    // this.form.controls['numeroEvento'].setValue(evento.id_evento);
    this.form.controls['claveProceso'].setValue(evento.data[0].cve_proceso);
    this.form.controls['fechaEvento'].setValue(evento.data[0].fec_evento);
    this.form.controls['Observaciones'].setValue(evento.data[0].observaciones);
    this.form.controls['FecSolicitud'].setValue(
      evento.data[0].fecha_notificacion
    );
    this.form.controls['Tipo'].setValue(evento.data[0].id_tpevento);
    this.form.controls['Estatus'].setValue(evento.data[0].estatus);
    this.form.controls['Referencia'].setValue(evento.data[0].descripcion);

    if (
      evento.data[0].item_tipo_proceso == 'SOLICITUD' ||
      evento.data[0].item_tipo_proceso == 'DESCUENTO'
    ) {
      this.controlBotnoes(evento.data[0].item_tipo_proceso, 'V');
    } else {
      this.controlBotnoes('1', 'I');
    }
  }

  cargarBienes(evento: any) {
    console.log('bienes<>>>>>>>>', evento);
    if (evento.count > 0) {
      this.dataGood.load(evento.data);
      this.dataGood.refresh();
      this.totalItems = evento.count;
    } else {
      this.dataGood.load([]);
      this.dataGood.refresh();
      this.totalItems = 0;
    }
  }
  async cargarAvaluos(evento: any) {
    console.log('Avaluos', evento);
    if (evento.count > 0) {
      this.dataApraisals.load(evento.data);
      this.dataApraisals.refresh();
      this.totalItems1 = evento.count;
      if (evento.count > 0) {
        console.log('llegamos manito' + evento);
        this.cargarDetAvaluos(await this.obtenerEvento(6, 0, '', evento[0]));
      }
    } else {
      this.dataApraisals.load([]);
      this.dataApraisals.refresh();
      this.totalItems1 = 0;
    }
  }
  cargarDetAvaluos(evento: any) {
    console.log('DetAvaluos', evento);
    if (evento.count > 0) {
      this.dataDetailApraisal.load(evento.data);
      this.dataDetailApraisal.refresh();
      this.totalItems2 = evento.count;
      this.Divreg = true;
    } else {
      this.dataDetailApraisal.load([]);
      this.dataDetailApraisal.refresh();
      this.totalItems2 = 0;
      this.Divreg = true;
    }
  }

  btnGenoficio_Click(data: any) {
    ///////////////////////generar oficio
    this.alertQuestion(
      'question',
      `¿Desea Generar Oficio para este Avaluo ${data}? `,
      '',
      'Continuar',
      'Cancelar'
    ).then(async question => {
      if (question.isConfirmed) {
        this.ocultaDivNoti(); /////////////////////////// inhabilitar los botones
        try {
          let V_CAUSA_INVALIDO = '';
          let V_DESC_OFICIO = '';
          if (this.form.value.Tipo != '0') {
            let body: any = {};
            body['pProcess'] = 'GO';
            body['pEvent'] = this.form.value.numeroEvento;
            body['pTpevent'] = this.form.value.Tipo;
            body['pAddress'] = this.form.value.Direccio;
            body['pTpappraisal'] = '';
            body['pTpoofficiates'] = '';
            body['pEstevent'] = 'pIdAppraisal';
            //////////////////////
            let body2: any = {};
            body2['option'] = 2;
            body2['event'] = this.form.value.numeroEvento;
            body2['idtpooficio'] = this.form.value.Tipo;

            V_CAUSA_INVALIDO = JSON.stringify(await this.PC_VAL_EVENTO(body));
            if (V_CAUSA_INVALIDO == null || V_CAUSA_INVALIDO == '') {
              V_DESC_OFICIO = JSON.stringify(await this.generarOficio(body2));
              this.onLoadToast(
                'warning',
                `¿Generar el ${V_DESC_OFICIO} de ${data} del evento ${this.form.value.numeroEvento}?`
              );
            } else {
              this.onLoadToast(
                'warning',
                `Ha ocurrido un Error con ${V_CAUSA_INVALIDO}`,
                'verifique correctamente la información'
              );
            }
            this.onLoadToast('warning', `Debe Seleccionar un tipo de Oficio`);
          }
        } catch {
          this.onLoadToast(
            'warning',
            `Lo Sentimos al Parecer ha Ocurrido un Error`
          );
        }
      }
    });
  }

  async btnContinuarOficio_Click() {
    try {
      let body2: any = {};
      body2['option'] = 2;
      body2['event'] = this.form.value.numeroEvento;
      body2['idtpooficio'] = this.form.value.Tipo;
      let urlOficio = JSON.stringify(await this.generarOficio(body2));
      if (urlOficio != '') {
        this.router.navigate([`siab-web/appraisals/res-cancel-valuation`]);
      }
    } catch {
      this.onLoadToast(
        'warning',
        `Lo Sentimos al Parecer ha Ocurrido un Error`
      );
    }
  }

  ExportaExcel() {
    let EsNumero = 0;
    let NombreArchivo: string;
    let NombreHoja;

    NombreHoja = 'Comer_Avaluos';

    /*
    this.fileNotificationServices.getFileNotification( )
      .subscribe({
        next: (resp: any) => {
          if (resp.file.base64 !== '') {
            this.downloadExcel(resp.file.base64);
          } else {
            this.onLoadToast(
              'warning',
              'Advertencia',
              'Sin Datos Para los Rangos de Fechas Suministrados'
            );
          }
          return;
        },
      });*/
  }

  downloadExcel(pdf: any) {
    const linkSource = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${pdf}`;
    const downloadLink = document.createElement('a');
    downloadLink.download = `Comer_Avaluos_${new Date().toDateString()}.xlsx`;
    downloadLink.href = linkSource;
    downloadLink.target = '_blank';
    downloadLink.click();
    this.onLoadToast(
      'success',
      'Archivo de Notificaciones',
      'Generado Correctamente'
    );
  }

  async leerExcel(proceso: string) {
    let error = '';
    try {
      if (proceso == 'V') {
      } else {
        if (proceso == 'I' || proceso == 'U' || proceso == 'A') {
          error = '';
        }
      }
    } catch {}
  }

  async() {}

  async lnkInsAvaluos_Click() {
    let V_CAUSA_INVALIDO = '';
    let body: any = {};
    body['pProcess'] = 'I';
    body['pEvent'] = this.form.value.numeroEvento;
    body['pTpevent'] = this.form.value.Tipo;
    body['pAddress'] = this.form.value.Direccio;
    body['pTpappraisal'] = '';
    body['pTpoofficiates'] = '';
    body['pEstevent'] = 'pIdAppraisal';
    try {
      V_CAUSA_INVALIDO = JSON.stringify(await this.PC_VAL_EVENTO(body));

      if (V_CAUSA_INVALIDO != '') {
        this.onLoadToast('error', 'Error', 'No se ha Podido Insertar Avaluos');
      } else {
        this.onLoadToast(
          'error',
          'Error',
          `${V_CAUSA_INVALIDO} ¿Ingresar Avalúos del evento ${this.form.value.numeroEvento}, referencia ${this.form.value.Referencia}?`
        );
      }
    } catch {}
  }
  btnInsertaArchivo_Click() {
    this.leerExcel('I');
  }
  async lnkUpdAvaluo_Click() {
    let body: any = {};
    body['pProcess'] = 'U';
    body['pEvent'] = this.form.value.numeroEvento;
    body['pTpevent'] = this.form.value.Tipo;
    body['pAddress'] = this.form.value.Direccio;
    body['pTpappraisal'] = '';
    body['pTpoofficiates'] = '';
    body['pEstevent'] = 'pIdAppraisal';
    let V_CAUSA_INVALIDO = JSON.stringify(await this.PC_VAL_EVENTO(body));
    if (V_CAUSA_INVALIDO != '') {
      this.onLoadToast('error', `${V_CAUSA_INVALIDO}`);
    } else {
      this.onLoadToast(
        'error',
        'Error',
        `¿Actualizar los Avalúos del evento ${this.form.value.numeroEvento}, referencia ${this.form.value.referencia}?`
      );
    }
  }
  btnUpdArchivo_Click() {
    this.leerExcel('U');
  }
  async lnkAddAvaluo_Click() {
    let V_CAUSA_INVALIDO = '';
    let body: any = {};
    body['pProcess'] = 'A';
    body['pEvent'] = this.form.value.numeroEvento;
    body['pTpevent'] = this.form.value.Tipo;
    body['pAddress'] = this.form.value.Direccio;
    body['pTpappraisal'] = '';
    body['pTpoofficiates'] = '';
    body['pEstevent'] = 'pIdAppraisal';
    V_CAUSA_INVALIDO = JSON.stringify(await this.PC_VAL_EVENTO(body));
    if (V_CAUSA_INVALIDO != '') {
      this.onLoadToast('error', `${V_CAUSA_INVALIDO}`);
    } else {
      this.onLoadToast(
        'error',
        `¿Agregar bienes a los Avalúos del evento ${this.form.value.numeroEvento}, referencia ${this.form.value.referencia}?`
      );
    }
  }
  btnAgrArchivo_Click() {
    this.leerExcel('A');
  }

  onFileChange(event: Event) {
    try {
      const files = (event.target as HTMLInputElement).files;
      if (!files || files.length !== 1) {
        throw new Error('Please select one file.');
      }

      // Limpia cualquier evento onload anterior
      this.fileReader.onload = null;

      // Asigna el evento onload para manejar la lectura del archivo
      this.fileReader.onload = loadEvent => {
        if (loadEvent.target && loadEvent.target.result) {
          // Llama a la función para procesar el archivo
          this.readExcel(loadEvent.target.result);

          // Limpia el input de archivo para permitir cargar el mismo archivo nuevamente
          (event.target as HTMLInputElement).value = '';
        }
        console.log(this.fileReader.onload);
      };

      // Lee el contenido binario del archivo
      this.fileReader.readAsBinaryString(files[0]);
    } catch (error) {
      console.error('Error:', error);
      // Maneja el error de acuerdo a tus necesidades
    }
  }

  readExcel(binaryExcel: string | ArrayBuffer) {
    try {
      this.dataExcel = this.excelService.getData<IExcelToJson>(binaryExcel);
      this.propertyValues = this.dataExcel.map(
        (item: any) => item.no_bien,
        (item2: any) => item2.another_day
      );

      // Unir las cadenas con comas para obtener una cadena separada por comas
      this.commaSeparatedString = this.propertyValues.join('}');

      console.log(this.commaSeparatedString);
      console.log(this.dataExcel);
    } catch (error) {
      this.onLoadToast('error', 'Ocurrio un error al leer el archivo', 'Error');
    }
  }

  async PC_VAL_EVENTO(body: any) {
    return new Promise((resolve, reject) => {
      this.formLoadAppraisalsService.validarEvento(body).subscribe({
        next: data => {
          resolve(data.data.vcadenaweb);
        },
        error: err => {
          console.log(err);
        },
      });
    });
  }
  async generarOficio(body: any) {
    return new Promise((resolve, reject) => {
      this.formLoadAppraisalsService.generarOficio(body).subscribe({
        next: data => {
          resolve(data.dual);
        },
        error: err => {
          console.log(err);
        },
      });
    });
  }
  async obtenerEvento(
    pOption: number,
    pEvent: number | string,
    pAddress: number | string,
    pIdAppraisal: number | string
  ) {
    return new Promise((resolve, reject) => {
      let body: any = {};
      body['pOption'] = pOption;
      body['pEvent'] = pEvent;
      body['pAddress'] = pAddress;
      body['pIdAppraisal'] = pIdAppraisal;
      console.log(body);
      this.formLoadAppraisalsService.obtenerEvento(body).subscribe({
        next: data => {
          resolve(data);
          // const info = data.data;
          // this.totalItems = 1;
          // if (type == 'E') {
          //   console.log('evento', data.data);
          //   //
          //   //
          //   //Llenar el form
          //   resolve(data.data[0]);
          //   console.log(this.form);
          //   //
          //   //
          // }
          // if (type == 'DA') {
          //   console.log('aguanile', data);
          //   this.dataDetailApraisal.load(data.data);
          //   this.dataDetailApraisal.refresh();
          //   resolve(data.data);
          // }
          // if (type == 'B') {
          //   this.dataGood.load(data.data);
          //   this.dataGood.refresh();
          //   resolve(data.data);
          // }
          // if (type == 'A') {
          //   let datos = [];
          //   datos.push(data.data[0]);
          //   datos.push(data.data[0]);
          //   this.dataApraisals.load(datos);
          //   this.apraisalLength = datos.length;
          //   console.log(datos, datos.length, this.dataApraisals);
          //   this.dataApraisals.refresh();
          //   resolve(datos);
          // }
          // console.log(info, pOption);
        },
        error: err => {
          console.log(err);
        },
      });
    });
  }

  ocultaDivNoti() {
    this.btnContinuarOficio = false;
    this.btnValidaArchivo = false;
    this.btnInsertaArchivo = false;
    this.btnValidarArc = false;
    this.btnUpdArchivo = false;
    this.btnAgrArchivo = false;
    this.gvAvaluosRechazados = false;
    this.gvBienesRecahazados = false;
  }

  search() {
    this.CargaGrids();
    this.inicialize();
  }
  controlBotnoes(tipoProceso: string, estado: string) {
    if (tipoProceso == '1') {
      if (estado == 'V') {
        /**********************   BOTONES AVALUOS   **********************/
        //NULL;
        /**********************   BOTONES DESCUENTO   **********************/
      } else if (estado == 'I') {
        this.lnkDesFormato = false;
        this.lnkValArchivo = false;
        this.lnkAvaRechazados = false;
        this.lnkInsAvaluos = false;
        this.lnkAddAvaluo = false;
        this.lnkUpdAvaluo = false;
        this.bottonDesible = false;
      }
    } else {
      if (tipoProceso == 'SOLICITUD') {
        if (estado == 'V') {
          this.lnkDesFormato = true;
          this.lnkValArchivo = true;
          this.lnkAvaRechazados = true;
          this.lnkInsAvaluos = true;
          this.lnkAddAvaluo = true;
          this.lnkUpdAvaluo = true;
          this.bottonDesible = true;
        } else if (estado == 'I') {
          this.lnkDesFormato = false;
          this.lnkValArchivo = false;
          this.lnkAvaRechazados = false;
          this.lnkInsAvaluos = false;
          this.lnkAddAvaluo = false;
          this.lnkUpdAvaluo = false;
          this.bottonDesible = false;
        }
      } else {
        if (tipoProceso == 'DESCUENTO') {
          if (estado == 'V') {
            this.lnkDesFormato = false;
            this.lnkValArchivo = false;
            this.lnkAvaRechazados = false;
            this.lnkInsAvaluos = false;
            this.lnkAddAvaluo = false;
            this.lnkUpdAvaluo = false;
            this.bottonDesible = false;
          } else {
            if (estado == 'I') {
              this.lnkDesFormato = false;
              this.lnkValArchivo = false;
              this.lnkAvaRechazados = false;
              this.lnkInsAvaluos = false;
              this.lnkAddAvaluo = false;
              this.lnkUpdAvaluo = false;
              this.bottonDesible = false;
            }
          }
        } else {
          if (tipoProceso == '' && estado == '') {
            this.lnkDesFormato = false;
            this.lnkValArchivo = false;
            this.lnkAvaRechazados = false;
            this.lnkInsAvaluos = false;
            this.lnkAddAvaluo = false;
            this.lnkUpdAvaluo = false;
            this.bottonDesible = false;
            this.form.disable();
            this.form.controls['numeroEvento'].enable();
            //
          }
        }
      }
    }
  }
  editDetailApraisal(e: any) {}
  deleteDetailApraisal(e: any) {}
  downloadDocument() {
    if (this.lnkDesFormato) {
      this.ocultaDivNoti();
      if (this.dataGood.count() > 0) {
        const filename: string = `Comer_Avaluos_${new Date().toDateString()}`;
        this.excelService.export(this.jsonToCsv, { type: 'xlsx', filename });
      } else {
        this.onLoadToast(
          'warning',
          `El avaluo no contiene bienes para generar el Layout. Verifiquelo por favor.`
        );
      }
    }
  }
  validateDocument() {
    if (this.lnkValArchivo) {
    }
    this.alertQuestion(
      'question',
      `¿Desea validar el archivo? `,
      '',
      'Continuar',
      'Cancelar'
    ).then(async question => {
      if (question.isConfirmed) {
      }
    });
  }
  apraisalReyect() {
    if (this.lnkAvaRechazados) {
    }
  }
  insertAvaluo() {
    if (this.lnkInsAvaluos) {
    }
  }
  addAvaluo() {
    if (this.lnkAddAvaluo) {
    }
  }
  updateAvaluo() {
    if (this.lnkUpdAvaluo) {
    }
  }
}
