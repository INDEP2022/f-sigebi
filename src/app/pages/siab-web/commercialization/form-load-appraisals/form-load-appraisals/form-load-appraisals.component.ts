import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { FormLoadAppraisalsService } from 'src/app/core/services/catalogs/form-load-appraisals.service';
import { AppraiseService } from 'src/app/core/services/ms-appraise/appraise.service';
import { ComerEventosServiceTwo } from 'src/app/core/services/ms-event/comer-eventos-ms-new.service';
import { MsMassiveappraiseService } from 'src/app/core/services/ms-massiveappraise/ms-massiveappraise.service';
import { MassiveGoodService } from 'src/app/core/services/ms-massivegood/massive-good.service';
import { OfficeManagementService } from 'src/app/core/services/office-management/officeManagement.service';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { FlatFileNotificationsService } from 'src/app/pages/documents-reception/flat-file-notifications/flat-file-notifications.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { FormLoadAppraisalsModalComponent } from '../form-load-appraisals-modal/form-load-appraisals-modal/form-load-appraisals-modal.component';
import {
  APPRAISALS_COLUMNS,
  DETAIL_APPRAISALS_COLUMNS,
  DT_RECHAZADOS_COLUMNS,
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
  form1: FormGroup;
  maxDate = new Date();

  requested: boolean = false;
  apraisalLength: number;
  estatusLotes: any;
  propertyValues: string[] = [];
  result: any = [];
  dataExcel: any = [];
  rejected: any = [];
  dtRejecteds: any = [];
  bottonDesible: boolean = false;
  commaSeparatedString: string = '';
  columnFilters: any = [];
  columnFilters1: any = [];
  paramExcel: string;
  carEvento: any;
  carBienes: any;
  carAvaluos: any;
  carDetAvaluos: any;
  direccion: string;
  tipoEvent: number;
  avaluo: string;
  idEvento: number;
  tipoOficio: number;
  ///
  params = new BehaviorSubject<ListParams>(new ListParams());
  params1 = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  totalItems1: number = 0;
  totalItems2: number = 0;
  totalItems3: number = 0;
  fileReader = new FileReader();
  selectedTipo = new DefaultSelect();
  dataApraisals: LocalDataSource = new LocalDataSource();
  dataGood: LocalDataSource = new LocalDataSource();
  dataDetailApraisal: LocalDataSource = new LocalDataSource();
  dtRejected: LocalDataSource = new LocalDataSource();

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
  dtRejectedSettings = {
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
    private fileNotificationServices: FlatFileNotificationsService,
    private massiveAppraise: MsMassiveappraiseService,
    private modalService: BsModalService,
    private massiveGoodService: MassiveGoodService,
    private appraiseService: AppraiseService,
    private comerEventosServiceTwo: ComerEventosServiceTwo,
    private officeManagementService: OfficeManagementService
  ) {
    super();
    this.apraisalsSettings.columns = APPRAISALS_COLUMNS;
    this.goodSettings.columns = GOODS_COLUMNS;
    this.detailApraisalsSettings.columns = DETAIL_APPRAISALS_COLUMNS;
    this.dtRejectedSettings.columns = DT_RECHAZADOS_COLUMNS;
  }

  ngOnInit(): void {
    this.createForm();
  }
  async inicialize() {
    this.cargaDDLEvento();

    if (!this.requested) {
      console.log('cargarEvento');
      this.cargaDDLEvento();
      this.controlBotnoes('', '');
    } else {
      this.cargarEvento(
        await this.obtenerEvento0(1, this.form.value.numeroEvento, 'A', '')
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
    this.form1 = new FormGroup({
      TipoOficio: new FormControl('', [Validators.required]),
    });
    this.form.disable();
    this.form.controls['numeroEvento'].enable();
    //this.inicialize();
  }
  async cargaDDLEvento() {
    this.estatusLotes = await this.CargaDDLDrop();
    console.log(this.estatusLotes);
    if (this.estatusLotes.length == 0) {
      // this.onLoadToast('warning', 'Advertencia', 'Selecciona oficio');
      this.onLoadToast('warning', 'Advertencia', 'No exixte ningun evento');
      this.form1.controls['TipoOficio'].setValue('0');
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
      this.formLoadAppraisalsService.obtenerEstatusLotes(body).subscribe({
        next: data => {
          console.log(data);
          this.result = data.data.map(async (item: any) => {
            item['valueDescription'] = item.valor + ' - ' + item.descripcion;
          });
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
    //this.ocultaDivNoti();
    this.carEvento = await this.obtenerEvento0(
      1,
      this.form.value.numeroEvento,
      'A',
      ''
    );
    let dataCarEvent: any = this.carEvento;
    this.cargarEvento(dataCarEvent);
    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() =>
        this.cargarBienes(2, this.form.value.numeroEvento, 'A', '')
      );
    this.carAvaluos = await this.obtenerEvento1(
      3,
      this.form.value.numeroEvento,
      'A',
      ''
    );
    let dataCarAvaluos: any = this.carAvaluos;
    console.log(this.carEvento, this.carBienes, this.carAvaluos);
    this.cargarAvaluos(dataCarAvaluos);
  }

  lnkBuscar_Click() {
    if (this.form.value.numeroEvento != '') {
      this.CargaGrids();
      this.lnkDesFormato = true;
      this.lnkValArchivo = true;
    } else {
      this.onLoadToast('warning', 'Advertencia', 'Debe capturar el No. Evento');
    }
  }

  async cargarEvento(evento: any) {
    // this.form.controls['numeroEvento'].setValue(evento.id_evento);
    this.form.controls['claveProceso'].setValue(evento.data[0].cve_proceso);
    this.form.controls['fechaEvento'].setValue(evento.data[0].fec_evento);
    this.form.controls['Observaciones'].setValue(evento.data[0].observaciones);
    this.form.controls['FecSolicitud'].setValue(
      evento.data[0].fecha_notificacion
    );
    this.form.controls['Tipo'].setValue(evento.data[0].item_desc_tipo);
    this.form.controls['Estatus'].setValue(evento.data[0].estatus);
    this.form.controls['Referencia'].setValue(
      evento.data[0].item_desc_tpsolaval
    );

    let avaluo = await this.obtenerEvento2(
      4,
      this.form.value.numeroEvento,
      'A',
      ''
    );
    console.log(avaluo);
    let dataAva: any = avaluo;
    if (avaluo != null) {
      this.avaluo = dataAva.data;
    } else {
      this.avaluo = '';
    }
    console.log(this.avaluo);

    console.log(evento.data);
    this.tipoEvent = evento.data[0].id_tpevento;
    this.idEvento = evento.data[0].id_evento;
    this.direccion = evento.data[0].direccion;

    if (
      evento.data[0].item_tipo_proceso == 'SOLICITUD' ||
      evento.data[0].item_tipo_proceso == 'DESCUENTO'
    ) {
      this.controlBotnoes(evento.data[0].item_tipo_proceso, 'V');
    } else {
      //this.controlBotnoes('1', 'I');
    }
  }

  cargarBienes(
    pOption: number,
    pEvent: number | string,
    pAddress: number | string,
    pIdAppraisal: number | string
  ) {
    console.log('bienes<>>>>>>>>');
    this.loading = true;
    let params2 = {
      ...this.params2.getValue(),
      ...this.columnFilters,
    };
    let body: any = {};
    body['pOption'] = pOption;
    body['pEvent'] = pEvent;
    body['pAddress'] = pAddress;
    body['pIdAppraisal'] = pIdAppraisal;
    console.log(body);
    this.formLoadAppraisalsService.obtenerEvento(body, params2).subscribe({
      next: data => {
        this.totalItems = data.count;
        this.dataGood.load(data.data);
        this.dataGood.refresh();
        this.loading = false;
      },
      error: err => {
        this.dataGood.load([]);
        this.dataGood.refresh();
        this.totalItems = 0;
        this.loading = false;
      },
    });
  }

  async cargarAvaluos(evento: any) {
    console.log('Avaluos', evento);
    if (evento.count > 0) {
      this.dataApraisals.load(evento.data);
      this.dataApraisals.refresh();
      this.totalItems1 = evento.count;
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

  async avaluosRowSelect(event: any) {
    if (event) {
      console.log(event.data.id_avaluo);
      //this.cargarDetAvaluos(await this.obtenerEvento1(6, 0, '', event.data.id_avaluo));
      this.cargarDetAvaluos(await this.obtenerEvento1(6, 0, '', '24176'));
    }
  }

  async btnGenoficio_Click() {
    ///////////////////////generar oficio
    //this.ocultaDivNoti(); /////////////////////////// inhabilitar los botones
    try {
      if (this.form.value.Tipo != '0') {
        //////////////////////
        let body2: any = {};
        body2['option'] = 2;
        body2['event'] = this.form.value.numeroEvento;
        body2['idtpooficio'] = this.form1.value.TipoOficio;

        let V_CAUSA_INVALIDO = await this.PC_VAL_EVENTO(
          'GO',
          this.form.value.numeroEvento,
          this.tipoEvent,
          this.direccion,
          this.avaluo,
          this.form1.value.TipoOficio,
          ''
        );
        let dataVCausa: any = V_CAUSA_INVALIDO;
        console.log(dataVCausa);
        if (dataVCausa != null) {
          if (dataVCausa.dual == '' || dataVCausa.dual == null) {
            //PUP_GEN_OFICIO
            let vDescOficio = await this.generarOficio(body2);
            let vDescData: any = vDescOficio;
            console.log(vDescData);
            this.alertQuestion(
              'question',
              `¿Generar el ${vDescData[0].vcadenaweb} de ${this.avaluo} del evento ${this.form.value.numeroEvento}?`,
              '',
              'Continuar',
              'Cancelar'
            ).then(async question => {
              if (question.isConfirmed) {
                //Redirecciona a la vista RespuestaAvaluo.aspx
              }
            });
          } else {
            this.onLoadToast('error', `${dataVCausa.dual}`, '');
          }
        }
      } else {
        this.onLoadToast('warning', `Debe Seleccionar un tipo de Oficio`);
      }
    } catch {
      this.onLoadToast(
        'warning',
        `Lo Sentimos al Parecer ha Ocurrido un Error`
      );
    }
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
    try {
      console.log(this.dataExcel);
      this.loader.load = true;
      for (let i = 0; i < this.dataExcel.length; i++) {
        if (proceso == 'V') {
          let dataExcel1 = await this.validArchivo(
            '0.16',
            this.dataExcel[i].CVE_AVALUO,
            this.dataExcel[i].FECHA_AVALUO,
            this.dataExcel[i].VIGENCIA_AVALUO,
            this.dataExcel[i].NO_BIEN,
            this.dataExcel[i].VRI_IVA,
            this.dataExcel[i].VRI_IVA_REDONDEADO,
            this.dataExcel[i].VC,
            this.dataExcel[i].VC_IVA,
            this.dataExcel[i].NOMBRE_VALUADOR,
            this.dataExcel[i].NOMENCLATURA_OFICIO,
            this.dataExcel[i].APTO
          );
          let err = dataExcel1[0].V_ERROR_JUSTIF;
          console.log(dataExcel1);
          if (err != null) {
            let rechazados = {
              noBien: this.dataExcel[i].NO_BIEN,
              descripcion: '',
              status: '',
              causa: err,
            };
            //console.log(err);
            this.rejected.push(rechazados);
            console.log(this.rejected);
          }
        } else if (proceso == 'I' || proceso == 'U' || proceso == 'A') {
          let dataAvaluo = await this.insertTmpComerAvaluo(
            '0.16',
            this.dataExcel[i].CVE_AVALUO,
            this.dataExcel[i].FECHA_AVALUO,
            this.dataExcel[i].VIGENCIA_AVALUO,
            this.dataExcel[i].NO_BIEN,
            this.dataExcel[i].VRI_IVA,
            this.dataExcel[i].VRI_IVA_REDONDEADO,
            this.dataExcel[i].VC,
            this.dataExcel[i].VC_IVA,
            this.dataExcel[i].NOMBRE_VALUADOR,
            this.dataExcel[i].NOMENCLATURA_OFICIO,
            this.dataExcel[i].APTO,
            ''
          );
          let errAvaluo = dataAvaluo[0].V_ERROR_JUSTIF;
          if (errAvaluo != '') {
            let rechazadosAvaluo = {
              noBien: this.dataExcel[i].NO_BIEN,
              descripcion: '',
              status: '',
              causa: errAvaluo,
            };
            //console.log(err);
            this.rejected.push(rechazadosAvaluo);
          }
        }
        if (this.dataExcel.length == i + 1) {
          this.cargaTabla(proceso);
        }
      }
      /*const promises = this.dataExcel.forEach(async element => {
        console.log(proceso);
        if (proceso == 'V') {
          let dataExcel1 = await this.validArchivo('0.16', element.CVE_AVALUO, element.FECHA_AVALUO, element.VIGENCIA_AVALUO, element.NO_BIEN, element.VRI_IVA, element.VRI_IVA_REDONDEADO, element.VC, element.VC_IVA, element.NOMBRE_VALUADOR, element.NOMENCLATURA_OFICIO, element.APTO);
          let err = dataExcel1[0].V_ERROR_JUSTIF;
          console.log(dataExcel1);
          if (err != null) {
            let rechazados = {
              noBien: element.NO_BIEN,
              descripcion: '',
              status: '',
              causa: err
            }
            //console.log(err);
            this.rejected.push(rechazados);
            console.log(this.rejected);
          }
        } else if (proceso == 'I' || proceso == 'U' || proceso == 'A') {

          let dataAvaluo = await this.insertTmpComerAvaluo('0.16', element.CVE_AVALUO, element.FECHA_AVALUO, element.VIGENCIA_AVALUO, element.NO_BIEN, element.VRI_IVA, element.VRI_IVA_REDONDEADO, element.VC, element.VC_IVA, element.NOMBRE_VALUADOR, element.NOMENCLATURA_OFICIO, element.APTO, '');
          let errAvaluo = dataAvaluo[0].V_ERROR_JUSTIF;
          if (errAvaluo != '') {
            let rechazadosAvaluo = {
              noBien: element.NO_BIEN,
              descripcion: '',
              status: '',
              causa: errAvaluo
            }
            //console.log(err);
            this.rejected.push(rechazadosAvaluo);
          }
        }
      });
      let vari = await Promise.all(promises)
      console.log(vari);
      
      if (proceso == 'V') {
        this.openModalAppraisals(proceso, this.rejected);
        console.log(this.rejected);
      } else if (proceso == 'I' || proceso == 'U' || proceso == 'A') {
        if (this.rejected.length > 0) {
          this.openModalAppraisals(proceso, this.rejected);
        } else {
          let avaluoRe = await this.pupInsertAvaluo(proceso, this.form.get('numeroEvento').value, 'A', 'FCOMERREGAVALUO', '');
          let dataAvaluo: any = avaluoRe;
          let bienesRec = await this.pupConsult(8, 0, '', '');
          let dataBienesRec: any = bienesRec;
          let avaluosRec = await this.pupConsult(9, 0, '', '');
          console.log(dataAvaluo.data[0].P_DATA);
          if (dataAvaluo.length > 0 && dataAvaluo.data[0].P_DATA != 0) {
            if (dataBienesRec.count > 0) {
              if (proceso == 'I') {
                this.onLoadToast('success', 'Se insertaron los Avalúos correctamente, pero hay bienes con error no procesados.', ``);
              } else {
                this.onLoadToast('success', 'Se actualizarón los Avalúos correctamente, pero hay bienes con error no procesados.', ``);
              }
            } else {
              if (proceso == 'I') {
                this.onLoadToast('success', 'Se insertaron los Avalúos correctamente.', ``);
              } else {
                this.onLoadToast('success', 'Se actualizarón los Avalúos correctamente.', ``);
              }
            }
          }
        }
        //this.rejected
      }*/
    } catch {}
  }

  async cargaTabla(proceso: string) {
    if (proceso == 'V') {
      this.openModalAppraisals(proceso, this.rejected);
      console.log(this.rejected);
    } else if (proceso == 'I' || proceso == 'U' || proceso == 'A') {
      if (this.rejected.length > 0) {
        this.openModalAppraisals(proceso, this.rejected);
      } else {
        let avaluoRe = await this.pupInsertAvaluo(
          proceso,
          this.form.get('numeroEvento').value,
          'A',
          'FCOMERREGAVALUO',
          ''
        );
        let dataAvaluo: any = avaluoRe;
        let bienesRec = await this.pupConsult(8, 0, '', '');
        let dataBienesRec: any = bienesRec;
        let avaluosRec = await this.pupConsult(9, 0, '', '');
        console.log(dataAvaluo.data[0].P_DATA);
        if (dataAvaluo.length > 0 && dataAvaluo.data[0].P_DATA != 0) {
          if (dataBienesRec.count > 0) {
            if (proceso == 'I') {
              this.onLoadToast(
                'success',
                'Se insertaron los Avalúos correctamente, pero hay bienes con error no procesados.',
                ``
              );
            } else {
              this.onLoadToast(
                'success',
                'Se actualizarón los Avalúos correctamente, pero hay bienes con error no procesados.',
                ``
              );
            }
          } else {
            if (proceso == 'I') {
              this.onLoadToast(
                'success',
                'Se insertaron los Avalúos correctamente.',
                ``
              );
            } else {
              this.onLoadToast(
                'success',
                'Se actualizarón los Avalúos correctamente.',
                ``
              );
            }
          }
        }
      }
      //this.rejected
    }
  }

  /*rechazos(bienes: any, avaluos: any){
    if(bienes && avaluos){

    }
  }*/

  async pupConsult(
    pOption: number,
    pEvent: number,
    pAddress: string,
    pIdAppraisal: string
  ) {
    let body = {
      pOption: pOption,
      pEvent: pEvent,
      pAddress: pAddress,
      pIdAppraisal: pIdAppraisal,
    };
    return new Promise((resolve, reject) => {
      this.comerEventosServiceTwo.getPupConsult(body).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  async pupInsertAvaluo(
    pProcess: string,
    pEvent: number,
    pAddress: string,
    pNomScreen: string,
    user: string
  ) {
    let body = {
      pProcess: pProcess,
      pEvent: pEvent,
      pAddress: pAddress,
      pNomScreen: pNomScreen,
      user: user,
    };
    return new Promise((resolve, reject) => {
      this.appraiseService.postPupInseertAppraisal(body).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: err => {
          console.log(err);
          resolve(null);
        },
      });
    });
  }

  openModalAppraisals(proceso: string, dataBienes: any) {
    console.log(dataBienes);
    let dataBien1: boolean = true;
    if (dataBienes && proceso) {
      let config: ModalOptions = {
        initialState: {
          proceso: proceso,
          rechazadosBienes: dataBienes,
          dataBien: dataBien1,
          callback: (next: boolean) => {
            if (next) this.lnkBuscar_Click();
          },
        },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      };
      this.modalService.show(FormLoadAppraisalsModalComponent, config);
    }
  }

  openModalRejections(rechazo: boolean, dataBienes?: any, dataAvaluos?: any) {
    if (rechazo && dataBienes && dataAvaluos) {
      let config: ModalOptions = {
        initialState: {
          rechazo: rechazo,
          reBienes: dataBienes,
          reAvaluos: dataAvaluos,
          callback: (next: boolean) => {
            if (next) this.lnkBuscar_Click();
          },
        },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      };
      this.modalService.show(FormLoadAppraisalsModalComponent, config);
    } else if (rechazo) {
      let config: ModalOptions = {
        initialState: {
          rechazo: rechazo,
          callback: (next: boolean) => {
            if (next) this.lnkBuscar_Click();
          },
        },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      };
      this.modalService.show(FormLoadAppraisalsModalComponent, config);
    }
  }

  async validArchivo(
    pIva: string,
    pAppraiseKey: string,
    pAppraiseDate: string,
    pValidityAppraise: string,
    pGoodNumber: string,
    pVriIva: string,
    pVriIvaRounding: string,
    pVc: string,
    pVcIva: string,
    pNameAppraiser: string,
    pNomenclatureJob: string,
    pAct: string
  ) {
    let body = {
      pIva: pIva,
      pAppraiseKey: pAppraiseKey,
      pAppraiseDate: pAppraiseDate,
      pValidityAppraise: pValidityAppraise,
      pGoodNumber: pGoodNumber,
      pVriIva: pVriIva,
      pVriIvaRounding: pVriIvaRounding,
      pVc: pVc,
      pVcIva: pVcIva,
      pNameAppraiser: pNameAppraiser,
      pNomenclatureJob: pNomenclatureJob,
      pAct: pAct,
    };
    return new Promise((resolve, reject) => {
      this.massiveAppraise.pupValidFile(body).subscribe({
        next: data => {
          resolve(data.data);
        },
        error: err => {
          console.log(err);
          resolve(null);
        },
      });
    });
  }

  async insertTmpComerAvaluo(
    pIva: string,
    pAppraiseKey: string,
    pAppraiseDate: string,
    pValidityAppraise: string,
    pGoodNumber: string,
    pVriIva: string,
    pVriIvaRounding: string,
    pVc: string,
    pVcIva: string,
    pNameAppraiser: string,
    pNomenclatureJob: string,
    pAct: string,
    pTypeAppraiser: string
  ) {
    let body = {
      pIva: pIva,
      pAppraiseKey: pAppraiseKey,
      pAppraiseDate: pAppraiseDate,
      pValidityAppraise: pValidityAppraise,
      pGoodNumber: pGoodNumber,
      pVriIva: pVriIva,
      pVriIvaRounding: pVriIvaRounding,
      pVc: pVc,
      pVcIva: pVcIva,
      pNameAppraiser: pNameAppraiser,
      pJobKey: pNomenclatureJob,
      ptypeAppraise: pTypeAppraiser,
    };
    return new Promise((resolve, reject) => {
      this.massiveGoodService.getPupInsertTmpComer(body).subscribe({
        next: data => {
          resolve(data.data);
        },
        error: err => {
          console.log(err);
          resolve(null);
        },
      });
    });
  }

  async lnkInsAvaluos_Click() {
    if (this.lnkInsAvaluos) {
      if (this.form1.controls['TipoOficio'].value != 0) {
        try {
          let V_CAUSA_INVALIDO = await this.PC_VAL_EVENTO(
            'I',
            this.form.value.numeroEvento,
            this.tipoEvent,
            this.direccion,
            this.avaluo,
            this.form1.value.TipoOficio,
            ''
          );
          let dataVCausa: any = V_CAUSA_INVALIDO;
          console.log(dataVCausa);
          if (dataVCausa != null) {
            console.log(dataVCausa);
            if (dataVCausa.dual != '') {
              this.onLoadToast('error', `${dataVCausa.dual}`, '');
            } else {
              console.log(dataVCausa.dual);
              this.alertQuestion(
                'question',
                `${dataVCausa.dual} ¿Ingresar Avalúos del evento ${this.form.value.numeroEvento}, referencia ${this.form.value.Referencia}?`,
                '',
                'Continuar',
                'Cancelar'
              ).then(async question => {
                if (question.isConfirmed) {
                  this.rejected = [];
                  this.lnkInsAvaluos = false;
                  this.leerExcel('I');
                }
              });
            }
          }
        } catch {}
      } else {
        this.onLoadToast('warning', 'Debe seleccionar un tipo de oficio.', '');
      }
    }
  }

  async lnkAddAvaluo_Click() {
    if (this.lnkAddAvaluo) {
      if (this.form1.controls['TipoOficio'].value != 0) {
        try {
          let V_CAUSA_INVALIDO = await this.PC_VAL_EVENTO(
            'A',
            this.form.value.numeroEvento,
            this.tipoEvent,
            this.direccion,
            this.avaluo,
            this.form1.value.TipoOficio,
            ''
          );
          let dataVCausa: any = V_CAUSA_INVALIDO;
          console.log(dataVCausa);
          if (dataVCausa != null) {
            if (dataVCausa.dual != '') {
              this.onLoadToast('error', `${dataVCausa.dual}`, '');
            } else {
              this.alertQuestion(
                'question',
                `${dataVCausa.dual} ¿Agregar bienes a los Avalúos del evento ${this.form.value.numeroEvento}, referencia ${this.form.value.Referencia}?`,
                '',
                'Continuar',
                'Cancelar'
              ).then(async question => {
                if (question.isConfirmed) {
                  this.rejected = [];
                  this.lnkAddAvaluo = false;
                  this.leerExcel('A');
                }
              });
            }
          }
        } catch {}
      } else {
        this.onLoadToast('warning', 'Debe seleccionar un tipo de oficio.', '');
      }
    }
  }

  async lnkUpdAvaluo_Click() {
    if (this.form1.controls['TipoOficio'].value != 0) {
      try {
        let V_CAUSA_INVALIDO = await this.PC_VAL_EVENTO(
          'U',
          this.form.value.numeroEvento,
          this.tipoEvent,
          this.direccion,
          this.avaluo,
          this.form1.value.TipoOficio,
          ''
        );
        let dataVCausa: any = V_CAUSA_INVALIDO;
        console.log(dataVCausa);
        if (dataVCausa != null) {
          if (dataVCausa.dual != '') {
            this.onLoadToast('error', `${dataVCausa.dual}`, '');
          } else {
            this.alertQuestion(
              'question',
              `${dataVCausa.dual} ¿Actualizar los Avalúos del evento ${this.form.value.numeroEvento}, referencia ${this.form.value.Referencia}?`,
              '',
              'Continuar',
              'Cancelar'
            ).then(async question => {
              if (question.isConfirmed) {
                this.rejected = [];
                this.lnkInsAvaluos = false;
                this.leerExcel('U');
              }
            });
          }
        }
      } catch {}
    } else {
      this.onLoadToast('warning', 'Debe seleccionar un tipo de oficio.', '');
    }
  }

  /* btnInsertaArchivo_Click() {
     this.leerExcel('I');
   }
   btnUpdArchivo_Click() {
     this.leerExcel('U');
   }
   btnAgrArchivo_Click() {
     this.leerExcel('A');
   }*/

  onFileChange(event: Event, value?: string) {
    try {
      this.alertQuestion(
        'question',
        `¿Desea validar el archivo? `,
        '',
        'Continuar',
        'Cancelar'
      ).then(async question => {
        if (question.isConfirmed) {
          console.log(value);
          //this.rejected = [];
          //this.dataExcel = [];
          const files = (event.target as HTMLInputElement).files;
          if (!files || files.length !== 1) {
            throw new Error('Please select one file.');
          }
          this.fileReader.onload = null;
          this.fileReader.onload = loadEvent => {
            if (loadEvent.target && loadEvent.target.result) {
              this.readExcel(loadEvent.target.result, value);
              (event.target as HTMLInputElement).value = '';
            }
            console.log(this.fileReader.onload);
          };

          this.fileReader.readAsBinaryString(files[0]);
        }
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }

  readExcel(binaryExcel: string | ArrayBuffer, value?: string) {
    try {
      let validExcel = this.excelService.getData<IExcelToJson>(binaryExcel);
      let validate = this.requiredfields(validExcel[0]);
      console.log(validate);
      console.log(validExcel[0]);
      if (validate) {
        this.dataExcel = validExcel;
        this.leerExcel(value);
        this.lnkValArchivo = false;
        this.lnkAvaRechazados = true;
        this.lnkInsAvaluos = true;
        this.lnkAddAvaluo = true;
        this.lnkUpdAvaluo = true;
        //this.leerExcel(value);
      } else {
        this.onLoadToast('warning', 'No tiene el formato correcto', ``);
        return;
      }
      console.log(this.dataExcel);
    } catch (error) {
      this.onLoadToast('error', 'Error al Validar el Archivo.', '');
    }
  }

  requiredfields(array: any) {
    const camposRequeridos = [
      'CVE_AVALUO',
      'FECHA_AVALUO',
      'VIGENCIA_AVALUO',
      'NO_BIEN',
      'VRI_IVA',
      'VC',
      'VC_IVA',
      'NOMBRE_VALUADOR',
      'NOMENCLATURA_OFICIO',
      'APTO/NOAPTO',
    ];
    const todosCamposPresentes = camposRequeridos.every(campo =>
      array.hasOwnProperty(campo)
    );

    if (todosCamposPresentes) {
      console.log('Todos los campos requeridos están presentes en el arreglo.');
    } else {
      console.log(
        'Al menos uno de los campos requeridos no está presente en el arreglo.'
      );
    }
    return todosCamposPresentes;
  }

  async PC_VAL_EVENTO(
    pProcess: string,
    pEvent: number,
    pTpevent: number,
    pAddress: string,
    pTpappraisal: string,
    pTpoofficiates: string,
    pEstevent: string
  ) {
    let body = {
      pProcess: pProcess,
      pEvent: pEvent,
      pTpevent: pTpevent,
      pAddress: pAddress,
      pTpappraisal: pTpappraisal,
      pTpoofficiates: pTpoofficiates,
      pEstevent: pEstevent,
    };
    return new Promise((resolve, reject) => {
      this.formLoadAppraisalsService.validarEvento(body).subscribe({
        next: data => {
          resolve(data);
        },
        error: err => {
          console.log(err);
          resolve(null);
        },
      });
    });
  }
  async generarOficio(body: any) {
    return new Promise((resolve, reject) => {
      this.officeManagementService.pupGenOficio(body).subscribe({
        next: data => {
          resolve(data.dual);
        },
        error: err => {
          console.log(err);
        },
      });
    });
  }
  async obtenerEvento0(
    pOption: number,
    pEvent: number | string,
    pAddress: number | string,
    pIdAppraisal: number | string
  ) {
    return new Promise((resolve, reject) => {
      /*let params2 = {
        ...this.params2.getValue(),
        ...this.columnFilters,
      };*/
      let body: any = {};
      body['pOption'] = pOption;
      body['pEvent'] = pEvent;
      body['pAddress'] = pAddress;
      body['pIdAppraisal'] = pIdAppraisal;
      console.log(body);
      this.formLoadAppraisalsService.obtenerEvento(body).subscribe({
        next: data => {
          resolve(data);
        },
        error: err => {
          console.log(err);
        },
      });
    });
  }

  async obtenerEvento1(
    pOption: number,
    pEvent: number | string,
    pAddress: number | string,
    pIdAppraisal: number | string
  ) {
    return new Promise((resolve, reject) => {
      let params1 = {
        ...this.params1.getValue(),
        ...this.columnFilters1,
      };
      let body: any = {};
      body['pOption'] = pOption;
      body['pEvent'] = pEvent;
      body['pAddress'] = pAddress;
      body['pIdAppraisal'] = pIdAppraisal;
      console.log(body);
      this.formLoadAppraisalsService.obtenerEvento(body, params1).subscribe({
        next: data => {
          resolve(data);
        },
        error: err => {
          console.log(err);
        },
      });
    });
  }

  async obtenerEvento2(
    pOption: number,
    pEvent: number | string,
    pAddress: number | string,
    pIdAppraisal: number | string
  ) {
    return new Promise((resolve, reject) => {
      /*let params2 = {
        ...this.params2.getValue(),
        ...this.columnFilters,
      };*/
      let body: any = {};
      body['pOption'] = pOption;
      body['pEvent'] = pEvent;
      body['pAddress'] = pAddress;
      body['pIdAppraisal'] = pIdAppraisal;
      console.log(body);
      this.formLoadAppraisalsService.obtenerEvento(body).subscribe({
        next: data => {
          resolve(data);
        },
        error: err => {
          console.log(err);
          resolve(null);
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
    /*this.lnkValArchivo = true;
    this.lnkAvaRechazados = true;
    this.lnkInsAvaluos = true;*/
  }

  apraisalReyect() {
    if (this.lnkAvaRechazados) {
      this.openModalRejections(true);
      this.lnkInsAvaluos = true;
    }
  }

  /*validateDocument() {
    if (this.lnkValArchivo) {
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
  }
  
  insertAvaluo() {
    if (this.lnkInsAvaluos) {
      this.leerExcel('I');
    }
  }
  async addAvaluo() {
    if (this.lnkAddAvaluo) {
      if (this.form1.controls['TipoOficio'].value != 0) {
        try {
          let V_CAUSA_INVALIDO = await this.PC_VAL_EVENTO('A', this.form.value.numeroEvento, this.tipoEvent, this.direccion, this.avaluo, this.form1.value.TipoOficio,'');
          let dataVCausa: any = V_CAUSA_INVALIDO;
          console.log(dataVCausa);
          if (dataVCausa != null) {
            if (dataVCausa[0].dual != '') {
              this.onLoadToast('error', `${dataVCausa[0].dual}`, '');
            } else {
              this.alertQuestion(
                'question',
                `${dataVCausa[0].dual} ¿Agregar bienes a los Avalúos del evento ${this.form.value.numeroEvento}, referencia ${this.form.value.Referencia}?`,
                '',
                'Continuar',
                'Cancelar'
              ).then(async question => {
                if (question.isConfirmed) {
                  this.rejected = [];
                  this.lnkAddAvaluo = false;
                  this.leerExcel('A');
                }
              });
            }
          }
        } catch { }
      } else {
        this.onLoadToast('warning', 'Debe seleccionar un tipo de oficio.', '');
      }
    }
  }
  updateAvaluo() {
    if (this.lnkUpdAvaluo) {
    }
  }*/
}
