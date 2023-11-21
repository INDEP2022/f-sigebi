import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, forkJoin, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { CapturelineService } from 'src/app/core/services/ms-capture-line/captureline.service';
import { ComerGoodsXLotService } from 'src/app/core/services/ms-comersale/comer-goods-x-lot.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { WINNERS_REPORT_COLUMNS } from './winners-report-columns';

@Component({
  selector: 'app-winners-report',
  templateUrl: './winners-report.component.html',
  styles: [],
})
export class winnersReportComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup([]);
  showWinners = false;
  showNotWinners = false;
  showReport = false;
  pdfurl = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  jsonToCsv: any[] = [];
  columns: any[] = [];
  totalItems: number = 0;
  totalItems1: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  params1 = new BehaviorSubject<ListParams>(new ListParams());
  evento = new DefaultSelect();
  loserr: any[] = [];
  winnerr: any[] = [];
  data: LocalDataSource = new LocalDataSource();
  data1: LocalDataSource = new LocalDataSource();
  @Output() selectEvent = new EventEmitter();
  private isFirstLoad = true;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private event: CapturelineService,
    private loser: ComerGoodsXLotService,
    private winner: LotService,
    private excelService: ExcelService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...WINNERS_REPORT_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getEvent(new ListParams());

    this.params1.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (!this.isFirstLoad) {
        this.getLoser();
      }
    });
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (!this.isFirstLoad) {
        this.getWinner();
      }
    });
    this.isFirstLoad = false;
  }

  private prepareForm() {
    this.form = this.fb.group({
      event: [null, []],
    });
  }

  openPrevCSV() {
    const event = this.form.get('event').value;

    if (!event) {
      this.alert('info', 'Es necesario contar con el Evento', '');
    } else {
      const params = {};
    }

    let config: ModalOptions = {
      initialState: {
        documento: {
          urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfurl),
          type: 'pdf',
        },
        callback: (data: any) => {},
      }, //pasar datos por aca
      class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    this.modalService.show(PreviewDocumentsComponent, config);
  }

  getEvent(params: ListParams) {
    const val = this.form.get('event').value;
    console.log(val);
    if (val === null) {
      if (params['search']) {
        params['eventId'] = params['search'];
      } else {
        delete params['eventId'];
      }
    } else {
      params['eventId'] = val;
    }
    console.log(params);

    this.event.getAllAdminCaptureLine(params).subscribe({
      next: resp => {
        this.evento = new DefaultSelect(resp.data, resp.count);
        console.log(this.evento);
      },
    });
  }

  getLoser() {
    if (this.form.get('event').value) {
      this.loading = true;
      this.loserr = [];
      let params = {
        ...this.params1.getValue(),
      };
      let body = {
        idEventIn: Number(this.form.get('event').value),
      };

      this.loser.getpaREportLoser(body, params).subscribe({
        next: resp => {
          console.log(resp);
          this.loserr = resp.data;
          this.data1.load(resp.data);
          this.data1.refresh();
          this.loading = false;
          this.totalItems1 = resp.count;
          console.log(this.totalItems1);
          this.showReport = true;
        },
        error: err => {
          console.log(err);
          this.alert(
            'error',
            'No existe reporte con el evento seleccionado',
            ''
          );
        },
      });
    } else {
      this.alert('warning', 'Debe llenar el campo evento', '');
    }
  }

  getWinner() {
    if (this.form.get('event').value) {
      this.loading = true;
      this.winnerr = [];
      let params = {
        ...this.params.getValue(),
      };
      this.winner.lotApp(this.form.get('event').value, params).subscribe({
        next: resp => {
          console.log(resp);
          this.winnerr = resp.data;
          this.data.load(resp.data);
          this.data.refresh();
          this.totalItems = resp.count;
          this.loading = false;
          this.showWinners = true;
        },
        error: err => {
          console.log(err);
          this.alert(
            'error',
            'No existe Reporte con el evento seleccionado',
            ''
          );
        },
      });
    } else {
      this.alert('warning', 'Debe llenar el campo evento', '');
    }
  }

  exportarLoser() {
    if (this.data1.count() == 0) {
      this.alert('warning', 'No hay Bienes en la Tabla', '');
      return;
    }

    const filename = 'Reporte No Ganadores';

    let params = {
      ...this.params1.getValue(),
    };
    let body = {
      idEventIn: Number(this.form.get('event').value),
    };

    this.loser.getpaREportLoser(body, params).subscribe({
      next: resp => {
        const allData = resp.data;

        // Si hay más páginas de datos, recuperarlas
        const totalPages = Math.ceil(resp.count / params.pageSize);
        const additionalRequests = [];

        for (let page = 2; page <= totalPages; page++) {
          params.page = page;
          additionalRequests.push(this.loser.getpaREportLoser(body, params));
        }

        // Combinar todos los registros en this.line
        forkJoin(additionalRequests).subscribe({
          next: additionalResponses => {
            for (const additionalResp of additionalResponses) {
              allData.push(...additionalResp.data);
            }

            this.excelService.export(allData, { type: 'csv', filename });
            this.alert(
              'success',
              'Reporte No Ganardores',
              'Exportado Correctamente'
            );
          },
          error: err => {
            console.log(err);
          },
        });
      },
      error: err => {
        console.log(err);
      },
    });
  }

  exportarWinner() {
    if (this.data.count() == 0) {
      this.alert('warning', 'No hay Bienes en la Tabla', '');
      return;
    }

    const filename = 'Reporte Ganadores';

    let params = {
      ...this.params.getValue(),
    };
    this.winner.lotApp(this.form.get('event').value, params).subscribe({
      next: resp => {
        const allData = resp.data;

        // Si hay más páginas de datos, recuperarlas
        const totalPages = Math.ceil(resp.count / params.pageSize);
        const additionalRequests: any[] = [];

        for (let page = 2; page <= totalPages; page++) {
          params.page = page;
          console.log(this.form.get('event').value, params);
          additionalRequests.push(
            this.winner.lotApp(this.form.get('event').value, params)
          );
        }
        setTimeout(() => {
          console.log(additionalRequests);
        }, 1000);

        // Combinar todos los registros en this.line
        forkJoin(additionalRequests).subscribe({
          next: additionalResponses => {
            for (const additionalResp of additionalResponses) {
              allData.push(...additionalResp.data);
            }

            this.excelService.export(allData, { type: 'csv', filename });
            this.alert(
              'success',
              'Reporte Ganardores',
              'Exportado Correctamente'
            );
          },
          error: err => {
            console.log(err);
          },
        });
      },
      error: err => {
        console.log(err);
      },
    });
  }

  clean() {
    this.showReport = false;
    this.showWinners = false;
    this.data.load([]);
    this.data1.load([]);
    this.form.get('event').setValue(null);

    // Llamar a getEvent sin el filtro
    this.getEvent({});
  }
}
