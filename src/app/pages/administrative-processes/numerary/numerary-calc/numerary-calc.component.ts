import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { format } from 'date-fns';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import {
  IProccesNum,
  IRequesNumeraryDet,
  IRequestNumeraryEnc,
} from 'src/app/core/models/ms-numerary/numerary.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { NumeraryService } from 'src/app/core/services/ms-numerary/numerary.service';
import { SurvillanceService } from 'src/app/core/services/ms-survillance/survillance.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ModalRequestComponent } from './modal-request/modal-request.component';
import {
  GOODS_COLUMNS,
  REQUESTS_COLUMNS,
  TOTALS_COLUMNS,
} from './numerary-calc-columns';
import { ProcessService } from './process.service';

interface IGloval {
  process: string;
}

interface ICurrencyRes {
  data: {
    ind_moneda: string;
  };
  registers: number;
}

@Component({
  selector: 'app-numerary-calc',
  templateUrl: './numerary-calc.component.html',
  styleUrls: ['./numerary-calc.component.scss'],
})
export class NumeraryCalcComponent extends BasePage implements OnInit {
  //Habilitar
  fillNewData = false; //Datos para un nuevo proceso
  searchedData = false; //Datos ya buscados
  calcButton = false; //Boton de calcular y eliminar

  //Get form Process Num
  get idProcess() {
    return this.formProcessNum.get('idProcess');
  }

  get date() {
    return this.formProcessNum.get('date');
  }

  get description() {
    return this.formProcessNum.get('description');
  }

  get type() {
    return this.formProcessNum.get('type');
  }

  get totalInterest() {
    return this.formProcessNum.get('totalInterest');
  }

  get totalImport() {
    return this.formProcessNum.get('totalImport');
  }

  get currency() {
    return this.formProcessNum.get('currency');
  }

  get bankCommision() {
    return this.formProcessNum.get('bankCommision');
  }

  form = new FormGroup({
    idProcess: new FormControl(null), // [null],
    date: new FormControl(null), // [null],
    type: new FormControl(null), // [null],
    concept: new FormControl(null, [Validators.pattern(STRING_PATTERN)]), // [null, ],
    totalInterests: new FormControl(null), // [null],
    totalImport: new FormControl(null, [Validators.required]), // ,
    user: new FormControl(null, [Validators.required]), // ,
  });
  formBlkControl: FormGroup;
  formProcessNum: FormGroup;

  loading1 = this.loading;
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  loading2 = this.loading;
  settings1 = { ...this.settings, actions: false };
  data2: LocalDataSource = new LocalDataSource();
  params1 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems1: number = 0;

  loading3 = this.loading;
  settings2 = { ...this.settings, actions: false };
  data3: LocalDataSource = new LocalDataSource();
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems2: number = 0;

  global: IGloval = {
    process: 'C',
  };

  DATA: any[] = [
    {
      label: 'PESOS',
      value: 'P',
    },
    {
      label: 'DOLARES',
      value: 'D',
    },
    {
      label: 'EUROS',
      value: 'E',
    },
    {
      label: 'CONV/PESOS',
      value: 'C',
    },
    {
      label: 'CONV/DOLARES',
      value: 'CD',
    },
  ];

  dataSelect = new DefaultSelect<any>();
  procesosNums = new DefaultSelect<IProccesNum[]>();
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  textButton: string = 'Calcula Intereses';

  blkSolicitudesNumeDe: any = {};
  requestNumeEnc: IRequestNumeraryEnc;
  process: IProccesNum;
  valido: string = null;
  disableButton: boolean = false;
  requestNumeDet: IRequesNumeraryDet;
  get userAuth() {
    return this.authService.decodeToken().preferred_username;
  }
  constructor(
    private fb: FormBuilder,
    private numeraryService: NumeraryService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private siabService: SiabService,
    private survillanceService: SurvillanceService,
    private excelService: ExcelService,
    private goodProcessService: GoodProcessService,
    private authService: AuthService,
    private readonly processService: ProcessService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: REQUESTS_COLUMNS,
    };
    this.settings1.columns = GOODS_COLUMNS;
    this.settings2.columns = TOTALS_COLUMNS;
    this.settings.hideSubHeader = false;
    this.settings1.hideSubHeader = false;
    this.settings2.hideSubHeader = false;
  }

  ngOnInit(): void {
    this.dataSelect = new DefaultSelect(this.DATA, this.DATA.length);
    this.prepareFormProcessNum();
    this.form.disable();
    this.form.get('type').enable();
    this.form.get('idProcess').enable();
    /* this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getRequestNumeEnc()); */

    /* this.params1
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getRequestNumeDet()); */

    this.params2.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (this.requestNumeDet) {
        this.getRequestNumeCal(
          this.requestNumeDet.solnumId,
          this.requestNumeDet.good.id
        );
      }
    });

    this.processService.getProcess().subscribe(data => {
      this.form.reset();
      this.process = data;
      console.log(this.process);
      this.form.get('idProcess').patchValue(this.process.procnumId);
      this.form
        .get('date')
        .patchValue(this.formatDate(this.process.procnumDate));
      this.form.get('type').patchValue(this.process.procnumType);
      this.form.get('concept').patchValue(this.process.description);
      this.form.get('totalInterests').patchValue(this.process.interestAll);
      this.form.get('totalImport').patchValue(this.process.numeraryAll);
      console.log('Consumiendo observable Desde el PADRE', this.process);
    });
  }

  getProcesosNum(params: ListParams) {
    const field = `filter.name`;
    if (params.text !== '' && params.text !== null) {
      this.columnFilters[field] = `${SearchFilter.ILIKE}:${params.text}`;
    } else {
      delete this.columnFilters[field];
    }
    let paramsValue = { ...params, ...this.columnFilters };
    this.numeraryService.getAllProccesNum(paramsValue).subscribe({
      next: resp =>
        (this.procesosNums = new DefaultSelect(resp.data, resp.count)),
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        //this.onLoadToast('error', 'Error', error);
      },
    });
  }

  onProcesosNum(event: IProccesNum) {
    if (event) {
      this.clean();
      this.processService.process(event);
      this.process = event;
      this.date.setValue(
        event.procnumDate.split('T')[0].split('-').reverse().join('/')
      );
      this.description.setValue(event.description);
      this.totalInterest.setValue(event.interestAll);
      this.totalImport.setValue(event.numeraryAll);
      this.type.setValue(event.procnumType);
      this.tCurrency();
    } else {
      this.clean();
    }
  }

  clearAll() {
    this.idProcess.reset();
    this.clean();
  }

  clean() {
    this.date.reset();
    this.description.reset();
    this.type.reset();
    this.totalInterest.reset();
    this.totalImport.reset();
    this.currency.reset();
    this.bankCommision.reset();
    // this.formBlkControl.reset();
    this.data.load([]);
    this.data3.load([]);
    this.data2.load([]);
  }

  private prepareFormProcessNum() {
    this.formProcessNum = this.fb.group({
      idProcess: [null],
      date: [null],
      description: [null],
      type: [null],
      totalInterest: [null],
      totalImport: [null],
      currency: [null],
      bankCommision: [null],
    });
    // this.form = this.fb.group({
    //   idProcess: [null],
    //   date: [null],
    //   type: [null],
    //   concept: [null, [Validators.pattern(STRING_PATTERN)]],
    //   totalInterests: [null],
    //   totalImport: [null, Validators.required],
    //   user: [null, Validators.required],
    // });
    /* this.formBlkControl = this.fb.group({
      tMoneda: [null, Validators.required],
      commisionBanc: [null, Validators.required],
      sumCommision: [null, Validators.required],
    }); */
  }

  getRequestNumeEnc(listParams: FilterParams) {
    this.loading1 = true;
    console.log(listParams);
    this.numeraryService
      .getNumeraryRequestNumeEncFilter(listParams.getParams())
      .subscribe({
        next: resp => {
          console.log(resp.data);
          this.data1 = resp.data;
          this.data.load(resp.data);
          this.totalItems = resp.count;
          this.loading1 = false;
        },
        error: err => {
          console.log(err);
          this.loading1 = false;
        },
      });
  }

  getRequestNumeDet(idProcess?: number | string) {
    this.loading2 = true;
    this.params1.getValue()['filter.solnumId'] = `$eq:${idProcess}`;
    this.numeraryService
      .getNumeraryRequestNumeDet(this.params1.getValue())
      .subscribe({
        next: resp => {
          console.log('DET....', resp.data);
          const data2 = resp.data.map(item => {
            return {
              ...item,
              description: item.good ? item.good.description : '',
            };
          });
          this.data2.load(data2);
          this.data2.refresh();
          this.totalItems1 = resp.count;
          this.loading2 = false;
        },
        error: err => {
          this.loading2 = false;
        },
      });
  }

  getRequestNumeCal(solnumId: number, goodNumber: number) {
    this.loading3 = true;
    this.params2.getValue()['filter.solnumId'] = `$eq:${solnumId}`;
    this.params2.getValue()['filter.goodNumber'] = `$eq:${goodNumber}`;
    this.numeraryService
      .getNumeraryRequestNumeCal(this.params2.getValue())
      .subscribe({
        next: resp => {
          console.log('CAL....', resp.data);
          const data3 = resp.data.map(item => {
            return {
              ...item,
              total: Number(item.amount) + Number(item.interest),
            };
          });
          this.data3.load(data3);
          this.data3.refresh();
          this.totalItems2 = resp.count;
          this.loading3 = false;
          this.postQuery();
        },
        error: err => {
          this.data3.load([]);
          this.postQuery();
          this.data3.refresh();
          this.loading3 = false;
        },
      });
  }

  async selectRequest() {
    if (this.type.value === null) {
      this.alert(
        'warning',
        'Cálculo de Numerario',
        'Debe Especificar el Tipo de Proceso.'
      );
      return;
    }
    console.log(this.currency.value);
    if (this.currency.value === null) {
      this.alert(
        'warning',
        'Cálculo de Numerario',
        'Debe Especificar el Tipo de Moneda.'
      );
      return;
    }
    const response = await this.alertQuestion(
      'question',
      '¿Desea Continuar?',
      ''
    );
    if (response.isConfirmed) {
      this.openModal();
    }
  }

  isLoadingStatusAccount = false;
  printStatusAccount() {
    this.isLoadingStatusAccount = true;
    const params = {
      P_PROCNUM: this.idProcess.value,
      P_FEC_PROCNUM: this.cambiarFormatoFecha(this.date.value),
    };
    console.log({
      params1: params,
      date: this.date.value,
      dateValid: new Date('20-08-2023'),
    });
    this.downloadReport('RRELBIENESPROC', params, () => {
      this.isLoadingStatusAccount = false;
    });
  }

  isLoadingDetailMovi = false;
  printDetailMovi() {
    this.isLoadingDetailMovi = true;
    const params = {
      // this.idProcess.value
      P_PROCNUM: this.idProcess.value,
      P_FEC_PROCNUM: this.cambiarFormatoFecha(this.date.value),
    };
    console.log('params111', params);
    this.downloadReport('RCONBIENESPROC', params, () => {
      this.isLoadingDetailMovi = false;
    });
  }

  cambiarFormatoFecha(fechaOriginal: any) {
    if (!fechaOriginal) return null;

    let partesFecha = fechaOriginal.split('/');
    let dia = partesFecha[0];
    let mes = partesFecha[1];
    let anio = partesFecha[2];

    let fechaNueva = new Date(mes + '/' + dia + '/' + anio);

    let nuevoAnio: any = fechaNueva.getFullYear();
    let nuevoMes: any = fechaNueva.getMonth() + 1;
    let nuevoDia: any = fechaNueva.getDate();

    if (nuevoMes < 10) {
      nuevoMes = '0' + nuevoMes;
    }
    if (nuevoDia < 10) {
      nuevoDia = '0' + nuevoDia;
    }

    let fechaFormateada = nuevoAnio + '-' + nuevoMes + '-' + nuevoDia;
    return fechaFormateada;
  }

  isLoadingProrraComission = false;
  printProrraComission() {
    if (this.currency.value != 'P') {
      const params = {
        P_PROCNUM: this.idProcess.value,
        P_FEC_PROCNUM: this.cambiarFormatoFecha(this.date.value),
        // P_FEC_PROCNUM: new Date(this.date.value),
      };
      this.downloadReport('RCONBIENESPROC_COMIS', params, () => {
        this.isLoadingProrraComission = false;
      });
    } else {
      this.alert(
        'warning',
        'Cálculo de Numerario',
        'El proceso no presenta ninguna comisión bancaria.'
      );
    }
  }

  downloadReport(reportName: string, params: any, cb: () => void = null) {
    //this.loadingText = 'Generando reporte ...';
    console.log('params', params);
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
        cb && cb();
      },
    });
  }

  calculInteres() {
    if (this.global.process === 'D') {
      console.log('Descalcula....');
      this.PUP_DESCALCULA();
    } else if (this.global.process === 'C') {
      console.log('Calcula....');
      this.PUP_CALCULA();
    }
  }

  async deleteRequest() {
    const response = await this.alertQuestion(
      'question',
      'Cálculo de Numerario',
      'Se eliminará proceso de numerario. ¿Deseas continuar?'
    );
    if (response.isConfirmed) {
      const deleteExi: boolean = await this.deleteSoli(
        Number(this.process.procnumId)
      );
      if (deleteExi) {
        this.clearAll();
        this.alert(
          'success',
          'Cálculo de Numerario',
          'El cálculo solicitado fue eliminado'
        );
      } else {
        this.alert(
          'error',
          'Ha ocurrido un error',
          'No fue posible eliminar el cálculo colicitado'
        );
      }
    }
  }

  /*   clean() {
    this.form.reset();
    this.formBlkControl.reset();
    this.data.load([]);
    this.data.refresh();
    this.data2.load([]);
    this.data2.refresh();
    this.data3.load([]);
    this.data3.refresh();
  } */

  deleteSoli(proceNum: number) {
    return new Promise<boolean>((res, rej) => {
      this.numeraryService.deleteProccess(proceNum).subscribe({
        next: response => {
          res(true);
        },
        error: err => {
          console.error(err);
          res(false);
        },
      });
    });
  }

  openModal() {
    let config: ModalOptions = {
      initialState: {
        process: this.idProcess.value,
        userAuth: this.userAuth,
        type: this.type.value,
        typeMoney: this.currency.value,
        callback: (next: any) => {
          if (next) {
            console.log(next);
            this.idProcess.setValue(next);
            this.searchProcess();
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ModalRequestComponent, config);
  }

  searchProcess() {
    console.log(this.idProcess.value);
    if (this.idProcess.value == null) {
      return this.alert('warning', 'Debe especificar un proceso.', '');
    }
    this.numeraryService.getProcessNumById(this.idProcess.value).subscribe({
      next: response => {
        console.log(response);
        this.onProcesosNum(response);
        const params = new FilterParams();
        params.addFilter('procnumId', this.idProcess.value);
        console.log(params);
        this.getRequestNumeEnc(params);
        this.searchedData = true;
      },
      error: () => {
        this.clean();
        this.searchedData = false;
        this.alert('error', 'No se encontró el proceso.', '');
      },
    });
  }

  async onChangeProcces(event: IRequestNumeraryEnc) {
    console.log(event);
    this.getRequestNumeDet(event.solnumId);
    //const proce: IProccesNum = await this.getProccesNum(event.procnumId);
    this.global.process = 'C';
  }

  getProccesNum(procnumId: number) {
    return new Promise<IProccesNum>((res, rej) => {
      const params: ListParams = {};
      params['filter.procnumId'] = `$eq:${procnumId}`;
      this.numeraryService.getProccesNum(params).subscribe({
        next: response => res(response.data[0]),
        error: err => res(null),
      });
    });
  }

  async PUP_DESCALCULA() {
    if (this.currency.value === 'P') {
      this.bankCommision.reset();
    }
    await this.pupSonDelDate(
      this.requestNumeDet.solnumId,
      this.idProcess.value
    );
    if (this.idProcess.value !== null) {
      if (this.requestNumeDet.solnumId !== null) {
        const response = await this.alertQuestion(
          'question',
          '¿Desea Ejecutar el Cálculo?',
          '',
          'Ejecutar'
        );
        if (response.isConfirmed) {
          const vResul = await this.pupElimCalculNume(this.idProcess.value);
          const process = await this.getProccesNum(this.idProcess.value);
          this.processService.process(process);
          if (vResul === 'Error') {
            this.alert('error', 'Ha ocurrido un error', '');
          } else {
            this.alert('success', 'Se eliminó el Cálculo de Numerario', '');
            this.searchProcess();
          }
        }
      } else {
        this.alert(
          'warning',
          'Cálculo de Numerario',
          'No se encontró la solicitud.'
        );
      }
    } else {
      this.alert(
        'warning',
        'Cálculo de Numerario',
        'No se especificó el proceso a calcular.'
      );
    }
  }

  pupElimCalculNume(pIdProcNum: number) {
    return new Promise((res, rej) => {
      const model = {
        pIdProcNum,
      };
      this.numeraryService.pupElimCalculNume(model).subscribe({
        next: resp => {
          console.log(resp);
          res(res);
        },
        error: err => {
          console.log(err);
          res('Error');
        },
      });
    });
  }

  fCalculaNume(pIdProcNum: number | string, commisionBanc: number) {
    commisionBanc == null ? 0 : commisionBanc;

    return new Promise((res, rej) => {
      this.survillanceService
        .fCalculaNume(pIdProcNum, commisionBanc)
        .subscribe({
          next: resp => {
            console.log(resp);
            res(res);
          },
          error: err => {
            console.log(err);
            res('Error');
          },
        });
    });
  }

  pupSonDate(
    lvIdSolnum: string | number,
    lvIdProcnum: string,
    lvBpParcializado: string | number
  ) {
    return new Promise<boolean>((res, rej) => {
      const model = {
        lvIdSolnum,
        lvIdProcnum,
        lvBpParcializado,
      };
      this.numeraryService.pupSonDate(model).subscribe({
        next: resp => {
          console.log(resp);
          res(true);
        },
        error: err => {
          console.log(err);
          res(false);
        },
      });
    });
  }

  pupSonDelDate(lvIdSolnum: string | number, lvIdProcnum: string) {
    return new Promise<boolean>((res, rej) => {
      const model = {
        lvIdSolnum,
        lvIdProcnum,
      };
      this.numeraryService.pupSonDelDate(model).subscribe({
        next: resp => {
          console.log(resp);
          res(true);
        },
        error: err => {
          console.log(err);
          res(false);
        },
      });
    });
  }

  async PUP_CALCULA() {
    if (!['CN', 'CD'].includes(this.currency.value)) {
      await this.pupSonDate(
        this.requestNumeDet.solnumId,
        this.idProcess.value,
        this.requestNumeDet.goodNumber
      );
    }

    if (this.idProcess.value != null) {
      if (this.requestNumeDet.solnumId != null) {
        const response = await this.alertQuestion(
          'question',
          '¿Desea Ejecutar el Cálculo?',
          ''
        );

        if (response.isConfirmed) {
          const vResul = await this.fCalculaNume(
            this.idProcess.value,
            this.bankCommision.value
          );
          console.log(vResul);
          if (vResul === 'Error') {
            this.alert('error', 'Ha Ocurrido un Error', '');
          } else {
            this.alert('success', 'Se Realizó el Cálculo de Numerario', '');
            this.searchProcess();
          }
        }
      } else {
        this.alert('error', 'No se Encontró la Solicitud', '');
      }
    } else {
      this.alert('error', 'No se especificó el proceso a calcular', '');
    }
  }

  onChangeTable2(event: any) {
    console.log(event);
    this.requestNumeDet = event;
    this.getRequestNumeCal(event.solnumId, event.goodNumber);
  }

  async tCurrency() {
    if (this.idProcess.value !== null) {
      const res: ICurrencyRes = await this.getIndMoneda(this.idProcess.value);
      console.log(res);
      if (res.registers === 0) {
        this.alert(
          'warning',
          'Cálculo de Numerario',
          'No se encontro el tipo de moneda en este proceso. \n Debe seleccionar uno para continuar con el proceso'
        );
        this.currency.enable();
        return;
      }
      if (res.registers > 1) {
        this.alert(
          'warning',
          'Cálculo de Numerario',
          'Se encontraron más tipos de moneda.'
        );
        return;
      }
      if (res.data.ind_moneda) {
        this.currency.setValue(res.data.ind_moneda);
      }
      this.currency.disable();
    }
  }

  getIndMoneda(idProcnum: number | string) {
    return new Promise<ICurrencyRes>((res, _rej) => {
      this.survillanceService.getIndMoneda(idProcnum).subscribe({
        next: resp => {
          console.log(resp);
          const data: ICurrencyRes = {
            data: resp.data[0],
            registers: resp.data.length,
          };
          res(data);
        },
        error: err => {
          const data: ICurrencyRes = {
            data: {
              ind_moneda: '',
            },
            registers: 0,
          };
          res(data);
        },
      });
    });
  }

  async exportar() {
    if (this.currency.value === 'P') {
      this.alert(
        'warning',
        'Cálculo de numerario',
        'El proceso no presenta ninguna comisión bancaria'
      );
      return;
    }
    const filename: string = 'Numerario Prorraneo';
    const jsonToCsv = await this.returnJsonToCsv(Number(this.idProcess.value));
    console.log('jsonToCsv', jsonToCsv);
    if (jsonToCsv.length === 0) {
      this.alert(
        'warning',
        'Cálculo de numerario',
        'No hay información para descargar'
      );
      return;
    }
    this.excelService.export(jsonToCsv, { type: 'csv', filename });
  }

  async returnJsonToCsv(idProcnum: number) {
    return new Promise<any[]>((res, rej) => {
      this.goodProcessService.getNumeProrraCsv(idProcnum).subscribe({
        next: resp => {
          console.log(resp);
          res(resp.data);
        },
        error: err => {
          console.log(err);
          res([]);
        },
      });
    });
  }

  async exportarTotal() {
    const filename: string = 'Numerario Total';
    const jsonToCsv = await this.returnJsonToTotalCsv(
      Number(this.idProcess.value)
    );
    console.log('jsonToCsv', jsonToCsv);
    if (jsonToCsv.length === 0) {
      this.alert(
        'warning',
        'Cálculo de numerario',
        'No hay información para descargar'
      );
      return;
    }
    this.excelService.export(jsonToCsv, { type: 'csv', filename });
  }

  async returnJsonToTotalCsv(idProcnum: number) {
    return new Promise<any[]>((res, rej) => {
      this.goodProcessService
        .getFproSolNumerarioProdnumCsv(idProcnum, 10000)
        .subscribe({
          next: resp => {
            console.log(resp);
            res(resp.data);
          },
          error: err => {
            res([]);
          },
        });
    });
  }

  preInsert() {
    this.form.get('date').setValue(new Date());
    this.form.get('totalInterests').setValue(0);
    this.form.get('totalImport').setValue(0);
    this.form.get('user').setValue(this.userAuth);
  }

  formatDate(fecha: string) {
    return fecha.split('T')[0].split('-').reverse().join('/');
  }

  async postQuery() {
    if (this.data3['data'].length > 0) {
      this.valido = await this.vValido(
        this.process.procnumId,
        this.process.procnumDate
      );
      if (this.valido === 'N') {
        this.textButton = 'Elimina Cálculo';
        this.calcButton = false;
      } else if (this.valido === 'S') {
        this.calcButton = true;
        this.textButton = 'Elimina Cálculo';
        this.global.process = 'D';
      }
    } else {
      this.textButton = 'Calcula Intereses';
      this.calcButton = true;
      this.global.process = 'C';
    }
  }

  subtractTwoDaysAndFormatDate() {
    const currentDate = new Date(); // Obtener la fecha actual
    currentDate.setDate(currentDate.getDate() - 2); // Restar dos días
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = String(currentDate.getFullYear());
    return `${day}-${month}-${year}`; // Formato DD/MM/YYYY
  }

  vValido(procnumId: number | string, fechaProce: string) {
    return new Promise<string>((res, rej) => {
      const params: ListParams = {};
      params['filter.procnumId'] = `$eq:${procnumId}`;
      params[
        'filter.procnumDate'
      ] = `$gte:${this.subtractTwoDaysAndFormatDate()}`;
      this.numeraryService.getProccesNum(params).subscribe({
        next: response => {
          res('S');
        },
        error: err => res('N'),
      });
    });
  }

  //Funciones agregadas por Grigork
  cancelNewProcess() {
    this.fillNewData = false;
    this.currency.enable();
    this.clean();
  }

  newProcess() {
    this.fillNewData = true;
    this.searchedData = false;
    this.currency.enable();
    this.clearAll();
  }

  newProcessFn() {
    if (this.type.value == null) {
      this.alert('warning', 'Debe seleccionar un tipo', '');
    } else if (this.currency.value == null) {
      this.alert('warning', 'Debe seleccionar un tipo de moneda', '');
    } else {
      const model: IProccesNum = {
        procnumDate: format(new Date(), 'yyyy-MM-dd'),
        description: this.description.value,
        user:
          localStorage.getItem('username') == 'sigebiadmon'
            ? localStorage.getItem('username')
            : localStorage.getItem('username').toLocaleUpperCase(),
        procnumType: this.type.value,
        interestAll: 0,
        numeraryAll: 0,
      };

      this.numeraryService.createProccesNum(model).subscribe(
        res => {
          this.alert('success', 'Proceso creado', '');
          this.fillNewData = false;
          this.searchedData = true;
          this.currency.disable();
          this.idProcess.setValue(JSON.parse(JSON.stringify(res)).procnumId);
          this.date.setValue(new Date());
        },
        err => {
          this.alert(
            'error',
            'Se presentó un Error Inesperado',
            'No se creó el Proceso, intentelo nuevamente'
          );
        }
      );
    }
  }

  validateComissionBank() {
    if (['P', 'C'].includes(this.currency.value)) {
      this.bankCommision.reset();
    }
  }
}
