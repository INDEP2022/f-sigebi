import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
import {
  BsModalService,
  ModalDirective,
  ModalOptions,
} from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  FilterParams,
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
import { JSON_TO_CSV_FRELDECOMISO } from 'src/app/pages/admin/home/constants/json-to-csv';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

declare var $: any;
interface IExcelToJson {
  idD: number;
  id: number;
  f_trnas: string;
  f_sent: string;
  Inte: number;
  f_teso: string;
  o_teso: string;
}

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
  @ViewChild('modal', { static: false }) modal?: ModalDirective;
  form: FormGroup;
  file: FormGroup;
  jsonToCsv = JSON_TO_CSV_FRELDECOMISO;
  dataExcel: any = [];
  data: FormGroup[];
  totalItems: number = 0;
  lock: boolean = false;
  binaryExcel: string | ArrayBuffer;
  currentPage = 1;
  pageSize = 10;
  paginatedData: any[] = [];
  fileReader = new FileReader();
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
    setTimeout(() => {
      $('[data-toggle="tooltip"]').tooltip('show');
    });

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
      forfeitureKey: [null, [Validators.required]],
      check: [null],
      import: [null],
      pgr: [null],
      ssa: [null],
      pjf: [null],
      totalAmount: [null],
    });
    this.file = this.fb.group({
      recordRead: [null],
      recordsProcessed: [null],
      processed: [null],
      wrong: [null],
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
    const forfeitureKey = this.form.get('forfeitureKey').value;

    if (!forfeitureKey) {
      this.onLoadToast(
        'info',
        'Es necesario contar con la Clave del Decomiso',
        ''
      );
    } else {
      const params = {
        P_Clave_Decomiso: forfeitureKey,
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
    try {
      const files = (event.target as HTMLInputElement).files;
      if (!files || files.length !== 1) {
        throw new Error('Please select one file.');
      }

      // Limpia cualquier evento onload anterior
      this.fileReader.onload = null;

      // Asigna el evento onload para manejar la lectura del archivo
      this.fileReader.onload = loadEvent => {
        if (loadEvent.target && loadEvent.target.result) {
          // Llama a la función para procesar el archivo
          this.readExcel(loadEvent.target.result);

          // Limpia el input de archivo para permitir cargar el mismo archivo nuevamente
          (event.target as HTMLInputElement).value = '';
        }
      };

      // Lee el contenido binario del archivo
      this.fileReader.readAsBinaryString(files[0]);
    } catch (error) {
      console.error('Error:', error);
      // Maneja el error de acuerdo a tus necesidades
    }
  }

  readExcel(binaryExcel: string | ArrayBuffer) {
    try {
      this.dataExcel = this.excelService.getData(binaryExcel);

      const mappedData: any = [];
      for (let i = 0; i < this.dataExcel.length; i++) {
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
          causa_penal: this.dataExcel[i].causa_penal,
        });
      }

      this.source.load(mappedData);
      this.source.refresh();

      this.totalItems = this.dataExcel.length;
      this.file.get('recordRead').patchValue(this.totalItems);
    } catch (error) {
      this.onLoadToast('error', 'Ocurrio un error al leer el archivo', 'Error');
    }
  }

  exportCsv() {
    const filename: string = 'Archivo Prueba';
    this.excelService.export(this.jsonToCsv, { type: 'csv', filename });
  }

  async aprove() {
    if (this.dataExcel.length === 0) {
      this.alert('info', 'Se debe importar el archivo excel', '');
      return;
    }
    const user = this.authService.decodeToken();
    const useri = user.username.toUpperCase();
    this.dataExcel.map((item: any) => {
      item['screenkey'] = 'FRELDECOMISO';
      item['toolbar_user'] = useri;
    });

    let insertBody = {
      data: this.dataExcel,
    };

    // Crear un arreglo para almacenar los números de bien duplicados
    const duplicateNumbers = [];
    const mon: any = [];
    const data1: any = [];
    for (let i = 0; i < this.dataExcel.length; i++) {
      data1.push([this.dataExcel[i].no_bien]);
      const data = this.dataExcel[i].no_bien;
      // mon.push([this.dataExcel[i].money]);

      let body = {
        goodNumber: data,
      };
      try {
        const resp = await this.detRelationConfiscationService
          .getById(body)
          .toPromise();

        // Verificar si el número de bien ya existe en la respuesta
        if (resp || resp['exists']) {
          duplicateNumbers.push(data); // Agregar el número de bien duplicado al arreglo
        }
      } catch (err) {}
    }

    // console.log(mon);

    // if (!mon.includes(1424) && !mon.includes(1426) && !mon.includes(1590)) {
    //   this.alert('warning', 'El Tipo de Moneda es Inválida', '');
    //   return;
    // }

    // Si se encontraron números de bien duplicados, mostrar la alerta y detener el proceso

    // Si no se encontraron números de bien duplicados, continuar con la inserción

    let insertResp;
    try {
      insertResp = await this.detRelationConfiscationService
        .Insert(insertBody)
        .toPromise();

      this.file.get('recordsProcessed').patchValue(insertResp['total']);
      this.file.get('processed').patchValue(insertResp['sucess']);
      this.file.get('wrong').patchValue(insertResp['error']);
      if (this.file.get('processed').value > 0) {
        this.alert('success', 'Registros Procesados con Éxito', '');
      }
    } catch (err) {
      // Verificar si err es de tipo HttpErrorResponse
      if (err instanceof HttpErrorResponse) {
        if (
          err.status === 500 ||
          (err.error && err.error.includes('column "undefined" does not exist'))
        ) {
          this.alert(
            'error',
            'Todas las columnas deben contar con información',
            ''
          );
        } else {
          this.alert('error', 'Error desconocido.', '');
        }
      } else {
        this.alert('error', 'Error desconocido.', '');
      }
    }
    if (duplicateNumbers.length > 0) {
      this.alert(
        'warning',
        'El No. Bien que Intenta Ingresar ya Existe',
        duplicateNumbers.join(', ')
      );
      this.file.get('wrong').patchValue(insertResp['error']);
      this.file.get('processed').patchValue('0');
      this.file.get('recordsProcessed').patchValue(insertResp['total']);

      return;
    }
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
  openFile(): void {
    const forfeitureKey = this.form.get('forfeitureKey').value;

    const filter = new FilterParams();
    filter.addFilter('confiscationKey', forfeitureKey, SearchFilter.EQ);

    this.detRelationConfiscationService
      .getAllMore(filter.getParams())
      .subscribe({
        next: resp => {
          const data = resp.data[0];
          this.form.get('import').patchValue(data.amountDlls);
          this.form.get('pgr').patchValue(data.pgr);
          this.form.get('ssa').patchValue(data.ssa);
          this.form.get('pjf').patchValue(data.pjf);
          this.form.get('totalAmount').patchValue(data.totalAmount);
        },
        error: err => {
          const forfeitureKey = this.form.get('forfeitureKey').value;
          if (!forfeitureKey) {
            this.alert(
              'info',
              'Es necesario contar con la Clave del Decomiso',
              ''
            );
            return;
          }

          if (
            err.status === 400 ||
            err.message.includes('No se encontrarón registros')
          ) {
            this.alert('error', 'No se encontraron registros', '');
            return;
          }
        },
      });
  }
  cleanFilter() {
    this.form.get('import').setValue(null);
    this.form.get('pgr').setValue(null);
    this.form.get('ssa').setValue(null);
    this.form.get('pjf').setValue(null);
    this.form.get('totalAmount').setValue(null);
    this.form.get('forfeitureKey').setValue(null);
  }
  clean() {
    this.file.get('recordsProcessed').setValue(null);
    this.file.get('processed').setValue(null);
    this.file.get('wrong').setValue(null);
    this.file.get('recordRead').setValue(null);
    this.source.reset();
    this.dataExcel = [];

    this.source.load(this.dataExcel);
  }
}
