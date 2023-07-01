import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { NumeraryService } from 'src/app/core/services/ms-numerary/numerary.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import {
  GOODS_COLUMNS,
  REQUESTS_COLUMNS,
  TOTALS_COLUMNS,
} from './numerary-calc-columns';

interface IGloval {
  process: string;
}

@Component({
  selector: 'app-numerary-calc',
  templateUrl: './numerary-calc.component.html',
  styles: [],
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
  data2: any[] = [];
  params1 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems1: number = 0;

  loading3 = this.loading;
  settings2 = { ...this.settings, actions: false };
  data3: any[] = [];
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems2: number = 0;

  global: IGloval = {
    process: '',
  };

  constructor(
    private fb: FormBuilder,
    private readonly numeraryService: NumeraryService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private siabService: SiabService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: REQUESTS_COLUMNS,
    };
    this.settings1.columns = GOODS_COLUMNS;
    this.settings2.columns = TOTALS_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getRequestNumeEnc());

    this.params1
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getRequestNumeDet());

    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getRequestNumeCal());
  }

  prepareForm() {
    this.form = this.fb.group({
      idProcess: [null, Validators.required],
      date: [null, Validators.required],
      type: [null, Validators.required],
      concept: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      devolution: [null, Validators.required],
      decomiso: [null, Validators.required],
      abandono: [null, Validators.required],
      totalInterests: [null, Validators.required],
      currency: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      bankComision: [null, Validators.required],
      totalImport: [null, Validators.required],
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

  getRequestNumeDet() {
    this.loading2 = true;
    this.numeraryService
      .getNumeraryRequestNumeDet(this.params1.getValue())
      .subscribe({
        next: resp => {
          console.log('DET....', resp.data[0].good.description);
          this.data2 = resp.data.map(item => {
            return {
              ...item,
              description: item.good ? item.good.description : '',
            };
          });
          this.totalItems1 = resp.count;
          this.loading2 = false;
        },
        error: err => {
          this.loading2 = false;
        },
      });
  }

  getRequestNumeCal() {
    this.loading3 = true;
    this.numeraryService
      .getNumeraryRequestNumeCal(this.params2.getValue())
      .subscribe({
        next: resp => {
          console.log('CAL....', resp.data);
          this.data3 = resp.data.map(item => {
            return {
              ...item,
              total: Number(item.amount) + Number(item.interest),
            };
          });
          this.totalItems2 = resp.count;
          this.loading3 = false;
        },
        error: err => {
          this.loading3 = false;
        },
      });
  }

  async selectRequest() {
    if (
      this.form.get('type').value === null &&
      this.form.get('type').value === 'v'
    ) {
      this.alert(
        'warning',
        'Cálculo de numerario',
        'Debe especificar el tipo de proceso.'
      );
      return;
    }
    if (this.form.get('currency').value === null) {
      this.alert(
        'warning',
        'Cálculo de numerario',
        'Debe especificar el tipo de proceso.'
      );
      return;
    }
    const response = await this.alertQuestion(
      'question',
      '¿Desea continuar?',
      '¿Se continua con la selección?'
    );
    if (response.isConfirmed) {
      //// abrir el modal
    }
  }

  printStatusAccount() {
    const params = {
      pn_folio: '',
    };
    this.downloadReport('blank', params);
  }
  printDetailMovi() {
    const params = {
      pn_folio: '',
    };
    this.downloadReport('blank', params);
  }
  printProrraComission() {
    if (this.formBlkControl.get('tMoneda').value === 'P') {
      const params = {
        pn_folio: '',
      };
      this.downloadReport('blank', params);
    } else {
      this.alert(
        'warning',
        'Cálculo de numerario',
        'El proceso no presenta ninguna comisión bancaria.'
      );
    }
  }

  downloadReport(reportName: string, params: any) {
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
      },
    });
  }

  calculInteres() {
    if (this.global.process === 'D') {
      this.PUP_DESCALCULA();
    } else if (this.global.process === 'C') {
      this.PUP_CALCULA();
    }
  }

  async deleteRequest() {
    const response = await this.alertQuestion(
      'question',
      'Cálculo de numerario',
      'Se eliminara proceso de numerario. ¿Deseas continuar?'
    );
    if (response.isConfirmed) {
      //// abrir el modal
      const deleteExi: boolean = await this.deleteSoli(0);
      if (deleteExi) {
        this.alert(
          'success',
          'Cálculo de numerario',
          'Fue eliminado el calculo solicitado'
        );
      } else {
        this.alert(
          'error',
          'Ha ocurrido un error',
          'No fue posible eliminar el calculo colicitado'
        );
      }
    }
  }

  deleteSoli(proceNum: number) {
    return new Promise<boolean>((res, rej) => {
      this.numeraryService.deleteProccess({ proceNum }).subscribe({
        next: response => {
          res(true);
        },
        error: err => {
          res(false);
        },
      });
    });
  }

  PUP_DESCALCULA() {}
  PUP_CALCULA() {}
}
