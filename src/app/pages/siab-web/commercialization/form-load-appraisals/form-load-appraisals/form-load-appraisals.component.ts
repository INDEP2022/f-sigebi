import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { FormLoadAppraisalsService } from 'src/app/core/services/catalogs/form-load-appraisals.service';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  APPRAISALS_COLUMNS,
  DETAIL_APPRAISALS_COLUMNS,
  GOODS_COLUMNS,
} from './table-form';

@Component({
  selector: 'app-form-load-appraisals',
  templateUrl: './form-load-appraisals.component.html',
  styles: [],
})
export class FormLoadAppraisalsComponent extends BasePage implements OnInit {
  form: FormGroup;
  maxDate = new Date();
  totalItems: number = 0;
  requested: boolean;
  apraisalLength: number;
  estatusLotes: any;
  bottonDesible: boolean;
  ///
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  selectedTipo = new DefaultSelect();
  dataApraisals: LocalDataSource = new LocalDataSource();
  dataGood: LocalDataSource = new LocalDataSource();
  dataDetailApraisal: LocalDataSource = new LocalDataSource();

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
  constructor(private formLoadAppraisalsService: FormLoadAppraisalsService) {
    super();
    this.apraisalsSettings.columns = APPRAISALS_COLUMNS;
    this.goodSettings.columns = GOODS_COLUMNS;
    this.detailApraisalsSettings.columns = DETAIL_APPRAISALS_COLUMNS;
  }

  ngOnInit(): void {
    this.createForm();
    this.CargaGrids();
    this.inicialize();
  }
  async inicialize() {
    if (!this.requested) {
      this.cargaDDLEvento();
      this.controlBotnoes('', '');
    } else {
      this.cargarEvento(
        await this.obtenerEvento(
          1,
          this.form.value.numeroEvento,
          'A',
          '',
          'E  '
        )
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
  }
  async cargaDDLEvento() {
    this.estatusLotes = await this.CargaDDLDrop();
    if (this.estatusLotes.length > 0) {
      this.onLoadToast('warning', 'Advertencia', 'Selecciona oficio');
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
    this.cargarEvento(
      await this.obtenerEvento(1, this.form.value.numeroEvento, 'I', '', 'E')
    );
    //this.cargarBienes(await this.obtenerEvento( 2, this.form.value.numeroEvento,"A", "", "B"));
    this.cargarAvaluos(await this.obtenerEvento(3, 0, ' ', '', 'A'));
    console.log('apraisalLength', this.apraisalLength);
    if (this.apraisalLength > 0) {
      console.log('llegamos manito');
      this.cargarDetAvaluos(await this.obtenerEvento(6, 0, ' ', 2097, 'DA'));
    }
  }
  lnkBuscar_Click() {
    if (this.form.value.numeroEvento != '') {
      this.CargaGrids();
    } else {
      this.onLoadToast('warning', 'Advertencia', 'Dijite el No. Evento');
    }
  }

  cargarEvento(evento: any) {
    console.log(evento);
    this.form.controls['numeroEvento'].setValue(evento.id_evento);
    this.form.controls['claveProceso'].setValue(evento.cve_proceso);
    this.form.controls['fechaEvento'].setValue(evento.fec_evento);
    this.form.controls['Observaciones'].setValue(evento.observaciones);
    this.form.controls['FecSolicitud'].setValue(evento.fecha_notificacion);
    this.form.controls['Tipo'].setValue(evento.id_tpevento);
    this.form.controls['Estatus'].setValue(evento.estatus);
    this.form.controls['Referencia'].setValue(evento.descripcion);

    if (
      evento.item_tipo_proceso == 'SOLICITUD' ||
      evento.item_tipo_proceso == 'DESCUENTO'
    ) {
      this.controlBotnoes(evento.item_tipo_proceso, 'V');
    } else {
      this.controlBotnoes('1', 'I');
    }
  }

  cargarBienes(evento: any) {
    console.log('bienes', evento);
    if (evento.length > 0) {
      //mostrar data en la tabla
    } else {
    }
  }
  cargarAvaluos(evento: any) {
    console.log('Avaluos', evento);

    if (evento.length > 0) {
      //mostrar data en la tabla
    } else {
    }
  }
  cargarDetAvaluos(evento: any) {
    if (evento.length > 0) {
      //mostrar data en la tabla
    } else {
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
    ).then(question => {
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
            ////////////////////// esperar al despliegue
            this.formLoadAppraisalsService.validarEvento(body).subscribe({
              next: data => {},
              error: err => {},
            });
            if (V_CAUSA_INVALIDO == null || V_CAUSA_INVALIDO == '') {
            }
          }
        } catch {}
      }
    });
  }

  async obtenerEvento(
    pOption: number,
    pEvent: number | string,
    pAddress: number | string,
    pIdAppraisal: number | string,
    type: string
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
          const info = data.data;
          this.totalItems = 1;
          if (type == 'E') {
            console.log('evento', data.data);
            //
            //
            //Llenar el form
            resolve(data.data[0]);
            console.log(this.form);
            //
            //
          }
          if (type == 'DA') {
            console.log('aguanile', data);
            this.dataDetailApraisal.load(data.data);
            this.dataDetailApraisal.refresh();
            resolve(data.data);
          }
          if (type == 'B') {
            this.dataGood.load(data.data);
            this.dataGood.refresh();
          }
          if (type == 'A') {
            let datos = [];
            datos.push(data.data[0]);
            datos.push(data.data[0]);
            this.dataApraisals.load(datos);
            this.apraisalLength = datos.length;
            resolve(datos);
            console.log(datos, datos.length, this.dataApraisals);
            this.dataApraisals.refresh();
          }
          console.log(info);
        },
        error: err => {
          console.log(err);
        },
      });
    });
  }

  ocultaDivNoti() {
    //
    // Invalidar los botones
    //
  }
  ExportaExcel() {}

  search() {}
  controlBotnoes(tipoProceso: string, estado: string) {
    if (tipoProceso == '1') {
      if (estado == 'V') {
      } else {
        if (estado == 'I') {
          //
          //
          this.bottonDesible = true;
          //
          //
        }
      }
    } else {
      if (tipoProceso == 'SOLICITUD') {
        if (estado == 'V') {
          //
          //
          this.bottonDesible = false;
          //
          //
        } else {
          if (estado == 'I') {
            //
            //
            this.bottonDesible = true;
            // y boton generar oficio
            //
          }
        }
      } else {
        if (tipoProceso == 'DESCUENTO') {
          if (estado == 'V') {
            //
            //
            this.bottonDesible = true;
            // y boton generar oficio
            //
            //
          } else {
            if (estado == 'I') {
              //
              //
              this.bottonDesible = true;
              // y boton generar oficio
              //
              //
            }
          }
        } else {
          if (tipoProceso == '' && estado == '') {
            //
            //
            this.bottonDesible = true;
            // y boton generar oficio
            this.form.disabled;
            //
          }
        }
      }
    }
  }
  editDetailApraisal(e: any) {}
  deleteDetailApraisal(e: any) {}
  downloadDocument() {}
  validateDocument() {}
  apraisalReyect() {}
  insertAvaluo() {}
  addAvaluo() {}
  updateAvaluo() {}
}
