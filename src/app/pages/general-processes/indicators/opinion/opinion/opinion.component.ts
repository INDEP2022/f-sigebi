import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { GENERAL_PROCESSES_OPINION_COLUNNS } from './opinion-columns';

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
  columnFilters: any = [];
  consulto: boolean = false;
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
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'coordinacion_regional':
                searchFilter = SearchFilter.EQ;
                break;
              case 'cve_dictamen':
                searchFilter = SearchFilter.EQ;
                break;
              case 'finiind':
                if (filter.search != null) {
                  filter.search = this.returnParseDate(filter.search);
                  searchFilter = SearchFilter.EQ;
                } else {
                  filter.search = '';
                }
                break;
              case 'ffinaliza':
                if (filter.search != null) {
                  filter.search = this.returnParseDate(filter.search);
                  searchFilter = SearchFilter.EQ;
                } else {
                  filter.search = '';
                }
                break;
              case 'fmaxima':
                if (filter.search != null) {
                  filter.search = this.returnParseDate(filter.search);
                  searchFilter = SearchFilter.EQ;
                } else {
                  filter.search = '';
                }
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              this.columnFilters[field] = `${filter.search}`;
              this.params.value.page = 1;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          console.error(this.params.getValue());
          this.consult();
        }
      });
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      /* if (this.consulto)  */ this.consult();
    });
  }

  vIndDictaminacion(params?: ListParams) {
    this.loading = true;
    let params1 = {
      ...params,
      ...this.columnFilters,
    };
    this.dictationService.vIndDictaminacion(params1).subscribe({
      next: resp => {
        this.data.load(resp.data);
        this.data.refresh();
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        console.log(err);
      },
    });
  }

  vIndDictaminacion1(params?: ListParams) {
    this.loading = true;
    let params1 = {
      ...params,
      ...this.columnFilters,
    };
    this.dictationService.vIndDictaminacion1(params1).subscribe({
      next: resp => {
        this.data.load(resp.data);
        this.data.refresh();
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        console.log(err);
      },
    });
  }

  async consult(form?: FormGroup) {
    this.consulto = true;
    this.params.getValue()['filter.no_gestion'] = `2`;
    this.params.getValue()['filter.desalojo_diadia'] = `0`;
    if (form) {
      if (form.get('fechaInicio').value === '') {
        form.get('fechaInicio').setValue(null);
      }

      if (form.get('fechaFin').value === '') {
        form.get('fechaFin').setValue(null);
      }

      if (form.get('cordinador').value === '') {
        form.get('cordinador').setValue(null);
      }

      if (form.get('usuario').value === '') {
        form.get('usuario').setValue(null);
      }

      if (form.get('autoridad').value === '') {
        form.get('autoridad').setValue(null);
      }

      if (form.get('emisora').value === '') {
        form.get('emisora').setValue(null);
      }

      if (form.get('transferente').value === '') {
        form.get('transferente').setValue(null);
      }

      /* if (
        form.get('fechaInicio').value !== null ||
        form.get('fechaFin').value !== null
      ) {
        /// finiind
        this.params.getValue()[
          'filter.finiind'
        ] = `$btw:${this.formatDate(
          form.get('fechaInicio').value
        )},${this.formatDate(form.get('fechaFin').value)}`;
      } else {
        delete this.params.getValue()['filter.finiind'];
      } */

      if (form.get('fechaTurno').value !== null) {
        /// frecepcion
        this.params.getValue()['filter.frecepcion'] = `:${this.formatDate(
          form.get('fechaTurno').value
        )}`;
      } else {
        delete this.params.getValue()['filter.frecepcion'];
      }

      if (form.get('fechaDesahogo').value !== null) {
        /// ffinaliza
        this.params.getValue()['filter.ffinaliza'] = `${this.formatDate(
          form.get('fechaDesahogo').value
        )}`;
      } else {
        delete this.params.getValue()['filter.ffinaliza'];
      }

      if (form.get('fechaVolante').value !== null) {
        /// finiind
        this.params.getValue()['filter.finiind'] = `${this.formatDate(
          form.get('fechaDesahogo').value
        )}`;
      } else {
        delete this.params.getValue()['filter.finiind'];
      }

      if (form.get('cordinador').value !== null) {
        /// coordinacion_regional
        this.params.getValue()['filter.coordinacion_regional'] = `$ilike:${
          form.get('cordinador').value
        }`;
      } else {
        delete this.params.getValue()['filter.coordinacion_regional'];
      }

      if (form.get('usuario').value !== null) {
        /// userNameruleOrigin
        this.params.getValue()['filter.uinicia'] = `$ilike:${
          form.get('usuario').value
        }`;
      } else {
        delete this.params.getValue()['filter.uinicia'];
      }

      if (form.get('numeroVolante').value !== null) {
        /// userNameruleOrigin
        this.params.getValue()['filter.no_volante'] = `$ilike:${
          form.get('numeroVolante').value
        }`;
      } else {
        delete this.params.getValue()['filter.no_volante'];
      }

      if (form.get('tipoVolante').value !== null) {
        /// tipo_volante
        this.params.getValue()['filter.tipo_volante'] = `$ilike:${
          form.get('tipoVolante').value
        }`;
      } else {
        delete this.params.getValue()['filter.tipo_volante'];
      }

      if (form.get('transferente').value !== null) {
        /// tipo_volante
        this.params.getValue()['filter.no_transferente'] = `$ilike:${
          form.get('transferente').value
        }`;
      } else {
        delete this.params.getValue()['filter.no_transferente'];
      }

      if (form.get('emisora').value !== null) {
        /// no_emisora
        this.params.getValue()['filter.no_emisora'] = `$ilike:${
          form.get('emisora').value
        }`;
      } else {
        delete this.params.getValue()['filter.no_emisora'];
      }

      if (form.get('autoridad').value !== null) {
        /// tipo_volante
        this.params.getValue()['filter.no_autoridad'] = `$ilike:${
          form.get('autoridad').value
        }`;
      } else {
        delete this.params.getValue()['filter.no_autoridad'];
      }
    }
    const vEtapa: number = 2; //await this.vEtapa();
    if (vEtapa === 1) {
      this.vIndDictaminacion(this.params.getValue());
    } else {
      this.vIndDictaminacion1(this.params.getValue());
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

  clean(event: any) {
    this.params = new BehaviorSubject<ListParams>(new ListParams());
    this.data.load([]);
    this.data.refresh();
    this.totalItems = 0;
  }

  formatDate(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
