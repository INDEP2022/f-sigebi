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
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DynamicCatalogService } from 'src/app/core/services/dynamic-catalogs/dynamic-catalogs.service';
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
  form: FormGroup;
  totalItems: number = 0;
  blkcontrol: IBlkcontrol = {
    totalcumplido: 0,
    totalNocumplido: 0,
    porcentajeCunplido: 0,
  };
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  consulto: boolean = false;

  get authUser() {
    return this.authService.decodeToken().preferred_username;
  }

  constructor(
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private documentsService: DocumentsService,
    private excelService: ExcelService,
    private dictationService: DictationService,
    private dynamicCatalogService: DynamicCatalogService,
    private authService: AuthService
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
          if (this.consulto) this.consult();
        }
      });
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (this.consulto) this.consult();
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
        this.totalItems = 0;
        this.loading = false;
      },
      error: err => {
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
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
        this.totalItems = 0;
        this.loading = false;
      },
      error: err => {
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
        this.loading = false;
        console.log(err);
      },
    });
  }

  async consult(form?: FormGroup) {
    if (form) {
      this.form = form;
    }
    this.consulto = true;
    let vEtapa: number = 1;
    this.params.getValue()['filter.no_gestion'] = `2`;
    this.params.getValue()['filter.desalojo_diadia'] = `0`;
    if (this.form.get('fechaInicio').value === '') {
      this.form.get('fechaInicio').setValue(null);
    }

    if (this.form.get('fechaFin').value === '') {
      this.form.get('fechaFin').setValue(null);
    }

    if (this.form.get('cordinador').value === '') {
      this.form.get('cordinador').setValue(null);
    }

    if (this.form.get('usuario').value === '') {
      this.form.get('usuario').setValue(null);
    }

    if (this.form.get('autoridad').value === '') {
      this.form.get('autoridad').setValue(null);
    }

    if (this.form.get('numeroVolante').value === '') {
      this.form.get('numeroVolante').setValue(null);
    }

    if (this.form.get('tipoVolante').value === '') {
      this.form.get('tipoVolante').setValue(null);
    }

    if (this.form.get('emisora').value === '') {
      this.form.get('emisora').setValue(null);
    }

    if (this.form.get('transferente').value === '') {
      this.form.get('transferente').setValue(null);
    }

    if (
      this.form.get('fechaInicio').value !== null ||
      this.form.get('fechaFin').value !== null
    ) {
      /// finiind
      console.log('FILTRO POR RANGO');
      this.params.getValue()['filter.finiind'] = `$bwt:${this.formatDate(
        this.form.get('fechaInicio').value
      )},${this.formatDate(this.form.get('fechaFin').value)}`;
    } else {
      delete this.params.getValue()['filter.finiind'];
    }

    if (this.form.get('fechaTurno').value !== null) {
      /// frecepcion
      this.params.getValue()['filter.frecepcion'] = `$eq:${this.formatDate(
        this.form.get('fechaTurno').value
      )}`;
    } else {
      delete this.params.getValue()['filter.frecepcion'];
    }

    if (this.form.get('fechaDesahogo').value !== null) {
      /// ffinaliza
      this.params.getValue()['filter.ffinaliza'] = `$eq:${this.formatDate(
        this.form.get('fechaDesahogo').value
      )}`;
    } else {
      delete this.params.getValue()['filter.ffinaliza'];
    }

    if (this.form.get('fechaVolante').value !== null) {
      /// finiind
      console.log(this.form.get('fechaVolante').value);
      this.params.getValue()['filter.finiind'] = `$eq:${this.formatDate(
        this.form.get('fechaVolante').value
      )}`;
    } else if (
      this.form.get('fechaInicio').value === null ||
      this.form.get('fechaFin').value === null
    ) {
      delete this.params.getValue()['filter.finiind'];
    }

    if (this.form.get('cordinador').value !== null) {
      /// coordinacion_regional
      this.params.getValue()['filter.coordinacion_regional'] = `${
        this.form.get('cordinador').value
      }`;
    } else {
      delete this.params.getValue()['filter.coordinacion_regional'];
    }

    if (this.form.get('usuario').value !== null) {
      /// userNameruleOrigin
      this.params.getValue()['filter.uinicia'] = `${
        this.form.get('usuario').value
      }`;
    } else {
      delete this.params.getValue()['filter.uinicia'];
    }

    if (this.form.get('numeroVolante').value !== null) {
      /// userNameruleOrigin
      this.params.getValue()['filter.no_volante'] = `${
        this.form.get('numeroVolante').value
      }`;
    } else {
      delete this.params.getValue()['filter.no_volante'];
    }

    if (this.form.get('tipoVolante').value !== null) {
      /// tipo_volante
      this.params.getValue()['filter.tipo_volante'] = `${
        this.form.get('tipoVolante').value
      }`;
    } else {
      delete this.params.getValue()['filter.tipo_volante'];
    }

    if (this.form.get('transferente').value !== null) {
      /// no_transferente
      this.params.getValue()['filter.no_transferente'] = `${
        this.form.get('transferente').value
      }`;
    } else {
      delete this.params.getValue()['filter.no_transferente'];
    }

    if (this.form.get('emisora').value !== null) {
      /// no_emisora
      this.params.getValue()['filter.no_emisora'] = `${
        this.form.get('emisora').value
      }`;
    } else {
      delete this.params.getValue()['filter.no_emisora'];
    }

    if (this.form.get('autoridad').value !== null) {
      /// no_autoridad
      this.params.getValue()['filter.no_autoridad'] = `${
        this.form.get('autoridad').value
      }`;
    } else {
      delete this.params.getValue()['filter.no_autoridad'];
    }
    if (this.form.get('fechaInicio').value !== null) {
      vEtapa = await this.vEtapa(
        this.formatDate(this.form.get('fechaInicio').value)
      );
    }

    if (vEtapa === 1) {
      this.vIndDictaminacion(this.params.getValue());
    } else {
      this.vIndDictaminacion1(this.params.getValue());
    }
  }

  vEtapa(fecha: string) {
    return new Promise<number>((res, _rej) => {
      this.dynamicCatalogService.faEtapaind(fecha).subscribe({
        next: resp => {
          console.log(resp);
          res(Number(resp.data[0].fa_etapaind));
        },
        error: _err => res(1),
      });
    });
  }

  async report(form: FormGroup) {
    console.log(form.value);
    const data = await this.data.getAll();
    const dataArray: any[] = data.map((item: any) => {
      return {
        keyOfficeExternal: item.externallettercode,
        transferentNumber: item.transferornumber,
        keyAffair: item.subjectcode,
        fileNumber: item.filenumber,
        flierNumber: item.flywheelnumber,
        flyerDate: item.startdateofindication,
        ffinal: item.enddate,
        uinit: item.startdate,
        fmax: item.maximumdate,
        accomplish: 1,
      };
    });
    const numRegs: number = await this.pupReport(this.authUser, dataArray);
    if (numRegs === 0) {
      this.alert(
        'warning',
        'Indicador de Dictaminación',
        'El reprote no se generá, porque no hay registros consultados'
      );
    } else {
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

  pupReport(user: string, dataArray: any[]) {
    return new Promise<number>((res, _rej) => {
      const model = {
        user,
        dataArray,
      };
      console.log(model);
      this.dictationService.pupReport(model).subscribe({
        next: resp => {
          console.log(resp);
          res(1);
        },
        error: err => {
          console.log(err);
          res(0);
        },
      });
    });
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
    const filename: string = 'Dictaminación';
    const jsonToCsv: any[] = await this.data.getAll();
    if (jsonToCsv.length === 0) {
      this.alert(
        'warning',
        'Indicador de Dictaminación',
        'No hay información para descargar'
      );
      return;
    }
    const data = jsonToCsv.map(elemt => {
      return {
        CVE_DICTAMEN: elemt.opinioncode, //elemt.
        OFICIO: elemt.externallettercode,
        EXPEDIENTE: elemt.filenumber,
        PROGRAMA: elemt.evictionperday,
        VOLANTE: elemt.flywheelnumber,
        FEC_VOLANTE: elemt.startdateofindication
          ? elemt.startdateofindication
              .split('T')[0]
              .split('-')
              .reverse()
              .join('/')
          : '',
        FEC_DESAHOGO: elemt.enddate
          ? elemt.enddate.split('-').reverse().join('/')
          : '',
        FEC_MAXIMA: elemt.maximumdate
          ? elemt.maximumdate.split('-').reverse().join('/')
          : '',
        USUARIO: elemt.startdate,
        CUMPLIO: 'N',
      };
    });

    this.excelService.export(data, { type: 'csv', filename });
  }

  clean(event: any) {
    delete this.params.getValue()['filter.uinicia'];
    delete this.params.getValue()['filter.finiind'];
    delete this.params.getValue()['filter.frecepcion'];
    delete this.params.getValue()['filter.ffinaliza'];
    delete this.params.getValue()['filter.coordinacion_regional'];
    delete this.params.getValue()['filter.no_volante'];
    delete this.params.getValue()['filter.tipo_volante'];
    delete this.params.getValue()['filter.no_transferente'];
    delete this.params.getValue()['filter.no_emisora'];
    delete this.params.getValue()['filter.no_autoridad'];
    this.params.getValue().text = '';
    this.params.getValue().page = 1;
    this.params.getValue().inicio = 1;
    this.params.getValue().pageSize = 10;
    this.params.getValue().take = 10;
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
