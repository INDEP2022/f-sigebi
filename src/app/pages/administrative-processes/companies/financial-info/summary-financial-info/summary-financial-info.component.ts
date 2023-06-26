import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGoodType } from 'src/app/core/models/catalogs/good-type.model';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { ReportService } from 'src/app/core/services/reports/reports.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  financialAtribs,
  financialIndicators,
} from '../select-attributes/info';
import { SelectAttributesComponent } from '../select-attributes/select-attributes.component';
export interface FinancialAtrib {
  id: string;
  description: string;
  isSelected: boolean;
}

export interface FinancialIndicator {
  id: string;
  description: string;
  formula: string;
  isSelected: boolean;
}

@Component({
  selector: 'app-summary-financial-info',
  templateUrl: './summary-financial-info.component.html',
  styles: [],
})
export class SummaryFinancialInfoComponent extends BasePage implements OnInit {
  financialIndicators: FinancialIndicator[] = financialIndicators;
  financialAtribs: FinancialAtrib[] = financialAtribs;
  params = new BehaviorSubject<ListParams>(new ListParams());
  event: Date = new Date();
  checkedListFI: FinancialIndicator[];
  checkedListFA: FinancialAtrib[];
  resA: string = '';
  isLoading = false;
  resI: string = '';
  urlAll: string = '';
  stringA: string = '';
  stringI: string = '';
  goodList: any;
  fromF: string;
  toT: string;
  description: string = '';
  select = new DefaultSelect<IGoodType>();
  form: FormGroup = new FormGroup({});
  @Input() typeField: string = 'type';
  @Input() types = new DefaultSelect<Partial<IGoodType>>();
  get type() {
    return this.form.get('type');
  }
  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private reportService: ReportService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe
  ) {
    super();
  }

  ngOnInit(): void {
    this.checkedListFA = [];
    this.checkedListFI = [];
    this.prepareForm();
    this.getGood();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      from: [null, [Validators.required]],
      to: [null, [Validators.required]],
      type: [null],
      PC_ATRI: [null],
      PC_INDI: [null],
    });
  }

  openModal(): void {
    let checkedListFA = JSON.parse(JSON.stringify(this.financialAtribs));
    let checkedListFI = JSON.parse(JSON.stringify(this.financialIndicators));

    const modalRef = this.modalService.show(SelectAttributesComponent, {
      initialState: {
        checkedListFA,
        checkedListFI,
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });

    modalRef.content.data.subscribe(data => {
      if (data) this.financialAtribs = data.checkedListFA;
      this.financialIndicators = data.checkedListFI;
      this.checkedListFA = this.financialAtribs.filter(fa => fa.isSelected);
      this.checkedListFI = this.financialIndicators.filter(fi => fi.isSelected);
      this.resA = this.checkedListFA.map(e => e.description).toString();
      this.resI = this.checkedListFI.map(e => e.description).toString();
    });
  }

  // confirm(): void {
  //   let options = {
  //     weekday: 'long',
  //     year: 'numeric',
  //     month: 'long',
  //     day: 'numeric',
  //   };
  //   let params = {
  //     PF_FECUNO: new DatePipe('en-EN').transform(this.event, 'dd/MM/yyyy'),
  //     PF_FECDOS: new DatePipe('en-EN').transform(this.event, 'dd/MM/yyyy'),
  //     PN_BIEN: this.form.controls['type'].value,
  //     PC_ATRI: this.resA,
  //     PC_INDI: this.resI,
  //   };

  //   //this.showSearch = true;
  //   console.log(params);
  //   const start = new Date(this.form.get('from').value);
  //   const end = new Date(this.form.get('to').value);

  //   const startTemp = `${start.getFullYear()}-0${start.getUTCMonth() + 1
  //     }-0${start.getDate()}`;
  //   const endTemp = `${end.getFullYear()}-0${end.getUTCMonth() + 1
  //     }-0${end.getDate()}`;

  //   if (end < start) {
  //     this.alert(
  //       'warning',
  //       'advertencia',
  //       'Fecha final no puede ser menor a fecha de inicio'
  //     );
  //     return;
  //   }
  //   setTimeout(() => {
  //     this.onLoadToast('success', 'procesando', '');
  //   }, 1000);

  //   const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/RCONADBRESUMFIAN.pdf?PF_FECUNO=${params.PF_FECUNO}&PF_FECDOS=${params.PF_FECDOS}&PN_BIEN=${params.PN_BIEN}&PC_ATRI=${params.PC_ATRI}&PC_INDI=${params.PC_INDI}`;
  //   //const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/blank.pdfttps://drive.google.com/file/d/1o3IASuVIYb6CPKbqzgtLcxx3l_V5DubV/view?usp=sharing`; //window.URL.createObjectURL(blob);
  //   window.open(pdfurl, 'RCONADBRESUMFIAN.pdf');
  //   setTimeout(() => {
  //     this.onLoadToast('success', 'Reporte generado', '');
  //   }, 2000);

  //   this.loading = false;
  //   this.cleanForm();
  // }

  confirm() {
    this.isLoading = true;

    this.fromF = this.datePipe.transform(
      this.form.controls['from'].value,
      'MM/yyyy'
    );

    this.toT = this.datePipe.transform(
      this.form.controls['to'].value,
      'MM/yyyy'
    );

    let params = {
      PF_FECUNO: this.fromF,
      PF_FECDOS: this.toT,
      PN_BIEN: this.form.controls['type'].value,
      PC_ATRI: this.resA,
      PC_INDI: this.resI,
    };

    console.log(params);
    const start = new Date(this.form.get('from').value);
    const end = new Date(this.form.get('to').value);

    const startTemp = `${start.getFullYear()}-0${
      start.getUTCMonth() + 1
    }-0${start.getDate()}`;
    const endTemp = `${end.getFullYear()}-0${
      end.getUTCMonth() + 1
    }-0${end.getDate()}`;

    if (end < start) {
      this.alert(
        'warning',
        'advertencia',
        'Fecha final no puede ser menor a fecha de inicio'
      );
      return;
    }

    this.siabService
      .fetchReport('RCONADBRESUMFIAN', params)
      // .fetchReportBlank('blank')
      .subscribe(response => {
        if (response !== null) {
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
        } else {
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
        }
      });
  }
  cleanForm(): void {
    this.form.reset();
    this.checkedListFI = [];
    this.checkedListFA = [];
  }

  removeItem(id: string, tags: string): void {
    if (tags == 'financialAtribs') {
      this.financialAtribs
        .filter(fa => fa.id == id)
        .map(a => {
          a.isSelected = false;
        });
      this.checkedListFA = this.financialAtribs.filter(fa => fa.isSelected);
      console.log(this.checkedListFA);
    }

    this.financialIndicators
      .filter(fi => fi.id == id)
      .map(i => {
        i.isSelected = false;
      });
    this.checkedListFI = this.financialIndicators.filter(fi => fi.isSelected);
    console.log(this.checkedListFI);
  }

  getGood() {
    this.reportService.getGoodType().subscribe({
      next: (data: any) => {
        this.goodList = data.data;
        this.description = data.data.nameGoodType;
        console.log(this.goodList);
      },
      error: error => console.error(error),
    });
  }
}
