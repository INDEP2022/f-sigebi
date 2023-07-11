import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import {
  IProccesNum,
  IRequesNumeraryCal,
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
  form: FormGroup;
  formBlkControl: FormGroup;

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
    private readonly numeraryService: NumeraryService,
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
    this.prepareForm();
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
      this.processService.process(event);
      this.process = event;
      this.form
        .get('date')
        .patchValue(
          event.procnumDate.split('T')[0].split('-').reverse().join('/')
        );
      this.form.get('concept').patchValue(event.description);
      this.form.get('totalInterests').patchValue(event.interestAll);
      this.form.get('totalImport').patchValue(event.numeraryAll);
      this.tCurrency();
    } else {
      this.form.reset();
      this.formBlkControl.reset();
    }
  }

  prepareForm() {
    this.form = this.fb.group({
      idProcess: [null],
      date: [null],
      type: [null],
      concept: [null, [Validators.pattern(STRING_PATTERN)]],
      totalInterests: [null],
      totalImport: [null, Validators.required],
      user: [null, Validators.required],
    });
    this.formBlkControl = this.fb.group({
      tMoneda: [null, Validators.required],
      commisionBanc: [null, Validators.required],
      sumCommision: [null, Validators.required],
    });
  }

  getRequestNumeEnc() {
    this.loading1 = true;
    this.numeraryService
      .getNumeraryRequestNumeEnc(this.params.getValue())
      .subscribe({
        next: resp => {
          console.log(resp.data);
          this.data1 = resp.data;
          this.totalItems = resp.count;
          this.loading1 = false;
        },
        error: err => {
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
        },
        error: err => {
          this.data3.load([]);
          this.data3.refresh();
          this.loading3 = false;
        },
      });
  }

  async selectRequest() {
    if (this.form.get('type').value === null) {
      this.alert(
        'warning',
        'Cálculo de numerario',
        'Debe especificar el tipo de proceso.'
      );
      return;
    }
    console.log(this.formBlkControl.get('tMoneda').value);
    if (this.formBlkControl.get('tMoneda').value === null) {
      this.alert(
        'warning',
        'Cálculo de numerario',
        'Debe especificar el tipo de moneda.'
      );
      return;
    }
    const response = await this.alertQuestion(
      'question',
      '¿Desea continuar?',
      '¿Se continua con la selección?'
    );
    if (response.isConfirmed) {
      this.openModal();
    }
  }

  isLoadingStatusAccount = false;
  printStatusAccount() {
    this.isLoadingStatusAccount = true;
    const params = {
      pn_folio: '',
    };
    this.downloadReport('blank', params, () => {
      this.isLoadingStatusAccount = false;
    });
  }

  isLoadingDetailMovi = false;
  printDetailMovi() {
    this.isLoadingDetailMovi = true;
    const params = {
      pn_folio: '',
    };
    this.downloadReport('blank', params, () => {
      this.isLoadingDetailMovi = false;
    });
  }

  isLoadingProrraComission = false;
  printProrraComission() {
    if (this.formBlkControl.get('tMoneda').value === 'P') {
      const params = {
        pn_folio: '',
      };
      this.downloadReport('blank', params, () => {
        this.isLoadingProrraComission = false;
      });
    } else {
      this.alert(
        'warning',
        'Cálculo de numerario',
        'El proceso no presenta ninguna comisión bancaria.'
      );
    }
  }

  downloadReport(reportName: string, params: any, cb: () => void = null) {
    //this.loadingText = 'Generando reporte ...';
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
      'Cálculo de numerario',
      'Se eliminará proceso de numerario. ¿Deseas continuar?'
    );
    if (response.isConfirmed) {
      const deleteExi: boolean = await this.deleteSoli(
        Number(this.process.procnumId)
      );
      if (deleteExi) {
        this.form.reset();
        this.formBlkControl.reset();
        this.data.load([]);
        this.data.refresh();
        this.data2.load([]);
        this.data2.refresh();
        this.data3.load([]);
        this.data3.refresh();
        this.alert(
          'success',
          'Cálculo de numerario',
          'Fue eliminado el cálculo solicitado correctamente'
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
        process: this.process,
        userAuth: this.userAuth,
        type: this.form.get('type').value,
        typeMoney: this.formBlkControl.get('tMoneda').value,
        callback: (next: any) => {
          if (next) {
            this.requestNumeEnc = next[0];
            this.totalItems = next.length;
            this.data.load(next);
            this.data.refresh();
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ModalRequestComponent, config);
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
    if (this.formBlkControl.get('tMoneda').value === 'P') {
      this.formBlkControl.get('commisionBanc').reset();
    }
    const res = await this.pupSonDelDate(
      this.requestNumeEnc.solnumId,
      this.form.get('idProcess').value
    );
    if (this.form.get('idProcess').value !== null) {
      if (this.requestNumeEnc.solnumId !== null) {
        const response = await this.alertQuestion(
          'question',
          '¿Se ejecuta el cálculo?',
          '¿Desea continuar?'
        );
        if (response.isConfirmed) {
          const vResul = await this.pupElimCalculNume(
            this.form.get('idProcess').value
          );
          const process = await this.getProccesNum(
            this.form.get('idProcess').value
          );
          this.processService.process(process);
          if (vResul === 'Error') {
            this.alert('error', 'Ha ocurrido un error', '');
          } else {
            this.alert(
              'success',
              'Cálculo de numerario',
              'El proceso se realizó correctamente.'
            );
          }
        }
      } else {
        this.alert(
          'warning',
          'Cálculo de numerario',
          'No se encontró la solicitud.'
        );
      }
    } else {
      this.alert(
        'warning',
        'Cálculo de numerario',
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
          res('Error');
        },
      });
    });
  }

  fCalculaNume(pIdProcNum: number | string, commisionBanc: number) {
    return new Promise((res, rej) => {
      this.survillanceService
        .fCalculaNume(pIdProcNum, commisionBanc)
        .subscribe({
          next: resp => {
            console.log(resp);
            res(res);
          },
          error: err => {
            res('Error');
          },
        });
    });
  }

  pupSonDelDate(lvIdSolnum: number | string, lvIdProcnum: number | string) {
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
          res(false);
        },
      });
    });
  }

  async PUP_CALCULA() {
    if (this.formBlkControl.get('tMoneda').value === 'P') {
      this.formBlkControl.get('commisionBanc').reset();
    }

    if (!['CN', 'CD'].includes(this.formBlkControl.get('tMoneda').value)) {
      const res = await this.pupSonDelDate(
        this.requestNumeEnc.solnumId,
        this.form.get('idProcess').value
      );
    }

    if (this.form.get('idProcess').value !== null) {
      if (this.requestNumeEnc.solnumId !== null) {
        const response = await this.alertQuestion(
          'question',
          '¿Se ejecuta el cálculo?',
          '¿Desea continuar?'
        );
        if (response.isConfirmed) {
          const vResul = await this.fCalculaNume(
            this.form.get('idProcess').value,
            this.formBlkControl.get('commisionBanc').value
          );
          const process = await this.getProccesNum(
            this.form.get('idProcess').value
          );
          this.processService.process(process);
          if (vResul === 'Error') {
            this.alert(
              'error',
              'Ha ocurrido un error',
              'No se calculó el numerario'
            );
          } else {
            this.alert(
              'success',
              'Cálculo de numerario',
              'Se calculó el numerario correctamente'
            );
          }
        }
      } else {
        this.alert(
          'warning',
          'Cálculo de numerario',
          'No se encontró la solicitud.'
        );
      }
    } else {
      this.alert(
        'warning',
        'Cálculo de numerario',
        'No se especificó el proceso a calcular.'
      );
    }
  }

  onChangeTable2(event: any) {
    console.log(event);
    this.requestNumeDet = event;
    this.getRequestNumeCal(event.solnumId, event.goodNumber);
  }

  async tCurrency() {
    if (this.form.get('idProcess').value !== null) {
      const res: ICurrencyRes = await this.getIndMoneda(
        this.form.get('idProcess').value
      );
      if (res.registers === 0) {
        this.alert(
          'warning',
          'Cálculo de numerario',
          'No se encontro el tipo de moneda en este proceso.'
        );
        return;
      }
      if (res.registers > 1) {
        this.alert(
          'warning',
          'Cálculo de numerario',
          'Se encontraron mas tipos de moneda.'
        );
        return;
      }
      if (res.data.ind_moneda) {
        this.formBlkControl.get('tMoneda').patchValue(res.data.ind_moneda);
      }
      this.formBlkControl.get('tMoneda').disable();
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
    if (this.formBlkControl.get('tMoneda').value === 'P') {
      this.alert(
        'warning',
        'Cálculo de numerario',
        'El proceso no presenta ninguna comisión bancaria'
      );
      return;
    }
    const filename: string = 'Numerario Prorraneo';
    const jsonToCsv = await this.returnJsonToCsv(
      Number(this.process.procnumId)
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

  async returnJsonToCsv(idProcnum: number) {
    return new Promise<any[]>((res, rej) => {
      this.goodProcessService.getNumeProrraCsv(idProcnum).subscribe({
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

  async exportarTotal() {
    const filename: string = 'Numerario Total';
    const jsonToCsv = await this.returnJsonToTotalCsv(
      Number(this.process.procnumId)
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

  async postQuery(event: IRequesNumeraryCal) {
    console.log(event);
    this.valido = await this.vValido(
      this.process.procnumId,
      this.process.procnumDate
    );
    if ((event.amount !== null || event.amount !== '') && this.valido === 'N') {
      this.textButton = 'Elimina Cálculo';
      this.disableButton = true;
    } else if (
      (event.amount !== null || event.amount !== '') &&
      this.valido === 'S'
    ) {
      this.textButton = 'Elimina Cálculo';
      this.disableButton = false;
      this.global.process = 'D';
    } else if (event.amount === null || event.amount === '') {
      this.textButton = 'Calcula Intereses';
      this.disableButton = false;
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
}
