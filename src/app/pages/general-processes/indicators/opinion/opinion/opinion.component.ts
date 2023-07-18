import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  GENERAL_PROCESSES_OPINION_COLUNNS,
  GENERAL_PROCESSES_OPINION_DATA,
} from './opinion-columns';

interface IBlkcontrol {
  totalcumplido: number;
  totalNocumplido: number;
  porcentajeCunplido: number;
}
@Component({
  selector: 'app-opinion',
  templateUrl: './opinion.component.html',
  styles: [],
})
export class OpinionComponent extends BasePage implements OnInit {
  //data = GENERAL_PROCESSES_OPINION_DATA;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  blkcontrol: IBlkcontrol = {
    totalcumplido: 20,
    totalNocumplido: 10,
    porcentajeCunplido: 70,
  };
  data: LocalDataSource = new LocalDataSource();
  constructor(
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private documentsService: DocumentsService,
    private excelService: ExcelService,
    private dictationService: DictationService
  ) {
    super();
    this.settings.columns = GENERAL_PROCESSES_OPINION_COLUNNS;
    this.settings.actions = false;
    this.settings.hideSubHeader = false;
  }

  ngOnInit(): void {
    this.data.load(GENERAL_PROCESSES_OPINION_DATA);
    this.data.refresh();
  }

  vIndDictaminacion(params?: ListParams) {
    this.dictationService.vIndDictaminacion(params).subscribe({
      next: resp => {
        this.data.load(resp.data);
        this.data.refresh();
      },
      error: err => {
        console.log(err);
      },
    });
  }

  vIndDictaminacion1(params?: ListParams) {
    this.dictationService.vIndDictaminacion1(params).subscribe({
      next: resp => {
        this.data.load(resp.data);
        this.data.refresh();
      },
      error: err => {
        console.log(err);
      },
    });
  }

  async consult(form: FormGroup) {
    console.log(form.value);
    const vEtapa: number = await this.vEtapa();
    if (vEtapa === 1) {
    } else {
    }
  }

  vEtapa() {
    return new Promise<number>((res, _rej) => {});
  }

  report(form: FormGroup) {
    console.log(form.value);
    if (this.data.count() === 0) {
      this.alert(
        'warning',
        'Indicador de Dictaminación',
        'El reprote no se generá, porque no hay registros consultados'
      );
    } else {
      this.data.getAll().then(data => {
        data.forEach((element: any) => {
          const model: any = {};
          this.documentsService.createCatDigitalizationTmp(model).subscribe({
            next: resp => console.log(resp),
            error: err => console.log(err),
          });
        });
      });
      const params: any = {
        /* P_T_CUMP: this.form.get('year').value,
        P_T_NO_CUMP: this.form.get('month').value,
        P_CUMP: null,
        P_USR: 
         */
      };
      this.downloadReport('blank', params);
    }
  }

  downloadReport(reportName: string, params: any) {
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

  async export(event: FormGroup) {
    console.log(event.value);
    const filename: string = 'Numerario Prorraneo';
    const jsonToCsv = await this.data.getAll();
    if (jsonToCsv.length === 0) {
      this.alert(
        'warning',
        'Indicador de Dictaminación',
        'No hay información para descargar'
      );
      return;
    }
    this.excelService.export(jsonToCsv, { type: 'csv', filename });
  }
}
