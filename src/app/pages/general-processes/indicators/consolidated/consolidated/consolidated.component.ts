import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DictaminacionService } from 'src/app/common/services/dictaminacion.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { CONSOLIDATED_COLUMNS } from './consolidated-columns';

@Component({
  selector: 'app-consolidated',
  templateUrl: './consolidated.component.html',
  styles: [],
})
export class ConsolidatedComponent extends BasePage implements OnInit {
  data: any = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsFilter$ = new BehaviorSubject<any>(null);
  dataReporte: LocalDataSource = new LocalDataSource();
  username: string = '';
  lv_par_anio: number;
  lv_par_mes: number;
  lv_par_coor: string = '0';
  nivel_usuar: string;
  no_deleg: number;
  params_no_delegacion: string = '2';
  toolbar_no_delegacion: string = '2';
  lv_totreg: number;

  totalItems: number = 0;
  constructor(
    private dictaminaService: DictaminacionService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private documentsService: DocumentsService,
    private programmingRequestService: ProgrammingRequestService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      hideSubHeader: false,
      columns: CONSOLIDATED_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.getUserInfo();

    this.paramsFilter$
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(paramsFilter => {
        if (paramsFilter) {
          this.params.next(new ListParams());
          this.getDataForTable(paramsFilter);
        }
      });
    this.getFilterParams();
  }

  validateUser() {
    if (this.nivel_usuar === '1') {
      this.lv_par_coor = '1';
    } else if (this.nivel_usuar === '2') {
      if (
        this.params_no_delegacion === ('2' || '3') &&
        this.toolbar_no_delegacion === ('2' || '3')
      ) {
        this.lv_par_coor = '1';
        this.alert('success', 'Se procede a generar el reporte', '');
      } else {
        this.lv_par_coor = '0';
        this.alert(
          'warning',
          'No tiene privilegios para generar el reporte de está Coordinación Regional',
          ''
        );
      }
    } else if (this.nivel_usuar === '3') {
      this.alert('warning', 'No tiene privilegios para generar el reporte', '');
      this.lv_par_coor = '0';
    }
  }

  getUserInfo() {
    this.programmingRequestService.getUserInfo().subscribe((data: any) => {
      this.username = data.username;
      console.log(this.username);
      const userprueba = 'HTORTOLERO';
      this.dictaminaService.getUserLevel(this.username).subscribe({
        next: data => {
          this.nivel_usuar = data.nivel_usar;
        },
        error: error => {
          console.log(error);
        },
      });
    });
  }

  getDataForTable(paramsFilter: any) {
    if (this.nivel_usuar !== '2') {
      return;
    } else {
      this.loading = true;
      this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
        let params = {
          ...this.params.getValue(),
          'filter.iniDate': `$btw:${paramsFilter.de},${paramsFilter.a}`,
        };
        this.dictaminaService.getDictamina(params).subscribe({
          next: (data: any) => {
            this.data = data.data;
            this.totalItems = data.count;
            this.loading = false;
          },
          error: () => (this.loading = false),
        });
      });
    }
  }

  getFilterParams() {
    this.dictaminaService.paramsDictamina.subscribe((data: any) => {
      this.paramsFilter$.next(data);
    });
  }

  generateReport(paramsSeleccion: any) {
    console.log('Usuario:', this.username);
    if (this.nivel_usuar !== '2') {
      this.alert('warning', 'No tiene privilegios para generar el reporte', '');
      return;
    } else {
      const [year, month, day] = paramsSeleccion.de.split('-');
      const P_ANIO = year;
      const P_MES = month;
      const P_COR_REG = '';
      const P_FECHA1 = '';

      const params = {
        P_FECHA1: `${day}-${month}-${year}`,
      };

      const model: any = {};
      this.documentsService.createCatDigitalizationTmp(model).subscribe({
        next: resp => console.log(resp),
        error: err => console.log(err),
      });
      this.showReport(params);
    }
  }

  showReport(paramsSeleccion: any) {
    const reportName = 'RINDICA_0008'; //Reporte no está habilitado, se envía blanco
    this.siabService.fetchReport('blank', paramsSeleccion).subscribe({
      next: response => {
        this.loading = true;
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        console.log(url);
        let config = {
          initialState: {
            documento: {
              urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
              type: 'pdf',
            },
            callback: (data: any) => {
              console.log(data);
            },
          },
          class: 'modal-lg modal-dialog-centered',
          ignoreBackdropClick: true,
        };
        this.loading = false;
        this.modalService.show(PreviewDocumentsComponent, config);
      },
      error: error => {
        this.loading = false;
        console.log(error);
      },
    });
  }
}
