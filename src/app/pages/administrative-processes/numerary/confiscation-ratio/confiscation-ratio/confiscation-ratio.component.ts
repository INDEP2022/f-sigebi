import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { TokenInfoModel } from 'src/app/core/models/authentication/token-info.model';
import { IGood } from 'src/app/core/models/good/good.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { DetRelationConfiscationService } from 'src/app/core/services/ms-confiscation/det-relation-confiscation.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { ScreenStatusService } from 'src/app/core/services/ms-screen-status/screen-status.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { EXCEL_TO_JSON } from 'src/app/pages/admin/home/constants/excel-to-json-columns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import * as XLSX from 'xlsx';

interface IExcelToJson {
  idD: number;
  id: number;
  f_trnas: string;
  f_sent: string;
  Inte: number;
  f_teso: string;
  o_teso: string;
}

@Component({
  selector: 'app-confiscation-ratio',
  templateUrl: './confiscation-ratio.component.html',
  styles: [],
})
export class ConfiscationRatioComponent extends BasePage implements OnInit {
  form: FormGroup;
  file: FormGroup;
  dataExcel: any = [];
  data: FormGroup[];
  totalItems: number = 0;
  lock: boolean = false;
  pdfurl = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  filterParams = new BehaviorSubject<ListParams>(new ListParams());
  params = new BehaviorSubject<ListParams>(new ListParams());
  source: LocalDataSource = new LocalDataSource();
  goods: DefaultSelect<IGood>;
  columnFilters: any = [];
  dataTemplate = this.fb.group({
    noGood: [null, Validators.required],
    criminalCase: [
      null,
      [Validators.pattern(STRING_PATTERN), Validators.required],
    ],
    preliminaryInvestigation: [
      null,
      [Validators.pattern(STRING_PATTERN), Validators.required],
    ],
    dateTesofe: [null, Validators.required],
    jobTesofe: [null, Validators.required],
    authority: [null, Validators.required],
    dateTreasury: [null, Validators.required],
    dateJudgment: [null, Validators.required],
    appraisalValue: [null, Validators.required],
    interests: [null, Validators.required],
    results: [null, Validators.required],
    totalSeizures: [null, Validators.required],
  });
  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private report: SiabService,
    private goodServ: GoodService,
    private goodSssubtypeService: GoodSssubtypeService,
    private screenStatusService: ScreenStatusService,
    private detRelationConfiscationService: DetRelationConfiscationService,
    private goodProcessService: GoodProcessService,
    private authorityService: AuthorityService,
    private excelService: ExcelService,
    private accountMovementService: AccountMovementService,
    private authService: AuthService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: EXCEL_TO_JSON,
    };
  }
  token: TokenInfoModel;
  ngOnInit(): void {
    this.prepareForm();
    this.token = this.authService.decodeToken();

    console.log('Información del usuario logeado: ', this.token);

    // this.getGood(new ListParams)
    // this.filterParams.getValue().addFilter('description', '', SearchFilter.ILIKE)
    // this.filterParams.pipe(takeUntil(this.$unSubscribe)).subscribe({
    //   next: () => this.getGood()
    // })
  }
  //const user = this.user.decodeToken();
  //toolbarUser: user.username.toUpperCase(),
  prepareForm() {
    this.form = this.fb.group({
      forfeitureKey: [null],
      check: [null, Validators.required],
      import: [null],
      pgr: [null, Validators.required],
      ssa: [null, Validators.required],
      pjf: [null, Validators.required],
    });
    this.file = this.fb.group({
      recordRead: [null, Validators.required],
      recordsProcessed: [null, Validators.required],
      processed: [null, Validators.required],
      wrong: [null, Validators.required],
    });
    this.data = [this.dataTemplate];
  }
  openPrevPdf() {
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

  getGood(params: ListParams) {
    const field = `filter.goodDescription`;
    params['sortBy'] = 'goodDescription:ASC';
    if (params.text !== '' && params.text !== null) {
      this.columnFilters[field] = `${SearchFilter.ILIKE}:${params.text}`;
      delete params.text;
      delete params['search'];
    } else {
      delete this.columnFilters[field];
    }
    let paramsValue = { ...params, ...this.columnFilters };
    this.goodServ.getAll(paramsValue).subscribe({
      next: resp => {
        this.goods = new DefaultSelect(resp.data, resp.count);
      },
    });
  }

  public callReport() {
    const { forfeitureKey } = this.form.value;

    if (!forfeitureKey) {
      this.onLoadToast(
        'info',
        'Es necesario contar con la Clave del Decomiso',
        ''
      );
    } else {
      const params = {
        P_CLAVE_DECOMISO: forfeitureKey,
      };
      this.report.fetchReport('RRELDECOMISO', params).subscribe({
        next: response => {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          let config = {
            initialState: {
              documento: {
                urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                type: 'pdf',
              },
            },
            class: 'modal-lg modal-dialog-centered',
            ignoreBackdropClick: true,
          };
          this.modalService.show(PreviewDocumentsComponent, config);
        },
      });
    }
  }

  initialize() {
    //p_Trae('Consecutivo');
  }

  brings() {}

  onFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files.length != 1) throw 'No files selected, or more than of allowed';
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(files[0]);
    fileReader.onload = () => this.readExcel(fileReader.result);
    console.log(fileReader);
    console.log((fileReader.onload = () => this.readExcel(fileReader.result)));
  }

  readExcel(binaryExcel: string | ArrayBuffer) {
    try {
      this.dataExcel = this.excelService.getData(binaryExcel);
      console.log(this.dataExcel);
      const mappedData: any = [];
      for (let i = 0; i < this.dataExcel.length; i++) {
        const user = this.authService.decodeToken();
        mappedData.push({
          idD: this.dataExcel[i].clave_decom,
          id: this.dataExcel[i].no_bien,
          f_trnas: this.dataExcel[i].fec_transferencia,
          f_sent: this.dataExcel[i].fec_sentencia,
          Inte: this.dataExcel[i].intereses,
          f_teso: this.dataExcel[i].fec_of_tesofe,
          o_teso: this.dataExcel[i].oficio_tesofe,
          curr: this.dataExcel[i].money,
          aut: this.dataExcel[i].autoridad,
          screenkey: this.dataExcel[i].screenkey,
          toolbar_user: this.dataExcel[i].toolbar_user,
        });
      }
      console.log(mappedData);

      this.source.load(mappedData);
      this.source.refresh();
      console.log(this.source);
      console.log(this.source);
      this.totalItems = this.dataExcel.length;
      this.file.get('recordRead').patchValue(this.totalItems);
    } catch (error) {
      this.onLoadToast('error', 'Ocurrio un error al leer el archivo', 'Error');
    }
  }

  aprove() {
    const user = this.authService.decodeToken();
    let body = {
      data: this.dataExcel,
    };
    console.log(body);
    this.detRelationConfiscationService.Insert(body).subscribe({
      next: resp => {
        console.log(resp);
        this.file.get('recordsProcessed').patchValue(resp['total']);
        this.file.get('processed').patchValue(resp['sucess']);
        this.file.get('wrong').patchValue(resp['error']);
        console.log(resp['total']);
      },
      error: err => {
        console.log(err);
      },
    });
  }

  getGoodFilter(money: number | string, goodNumber: number | string) {
    let body = {
      vcScreen: 'FRELDECOMISO',
      coinArray: money,
      goodNumber: goodNumber,
    };
    this.goodProcessService.getGoodAppraise(body).subscribe({
      next: resp => {
        console.log(resp);
      },
      error: err => {
        console.log(err);
      },
    });
  }

  getValidGood(goodNumber: number | string) {
    if (goodNumber) {
      this.params.getValue()['filter.goodNumber'] = goodNumber;
    }
    let params = {
      ...this.params.getValue(),
    };
    this.detRelationConfiscationService.getAllDetRel(params).subscribe({
      next: resp => {
        console.log(resp);
      },
      error: err => {
        console.log(err);
      },
    });
  }

  getCpAp() {
    //Endpoint pendiente
  }

  getAuthority() {
    //Preguntar
  }

  // getDTransfer(goodNumber?: number | string) {
  //   if (goodNumber) {
  //     this.params.getValue()['filter.numberAccount'] = goodNumber;
  //   }
  //   let params = {
  //     ...this.params.getValue(),
  //   };
  //   this.accountMovementService.getAllRatio(params).subscribe({
  //     next: resp => {
  //       console.log(resp);
  //     },
  //     error: err => {
  //       console.log(err);
  //     },
  //   });
  // }

  getConsecutive(year?: number | string) {
    this.detRelationConfiscationService.getAllMaxNoRelDec(year).subscribe({
      next: resp => {
        console.log(resp);
      },
      error: err => {
        console.log(err);
      },
    });
  }
  openFile(file: any): void {
    console.log('asd');
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const workbook = XLSX.read(e.target.result, { type: 'binary' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      this.data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    };
    reader.readAsBinaryString(file);
    document.getElementById('uploadfile').click();
  }
}
