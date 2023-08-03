import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/good/good.model';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { DetRelationConfiscationService } from 'src/app/core/services/ms-confiscation/det-relation-confiscation.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { ScreenStatusService } from 'src/app/core/services/ms-screen-status/screen-status.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-confiscation-ratio',
  templateUrl: './confiscation-ratio.component.html',
  styles: [],
})
export class ConfiscationRatioComponent extends BasePage implements OnInit {
  form: FormGroup;
  file: FormGroup;
  data: FormGroup[];
  lock: boolean = false;
  pdfurl = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  filterParams = new BehaviorSubject<ListParams>(new ListParams());
  params = new BehaviorSubject<ListParams>(new ListParams());
  goods: DefaultSelect<IGood>;
  columnFilters: any = [];
  dataTemplate = this.fb.group({
    noGood: [null, Validators.required],
    criminalCase: [
      null,
      [Validators.pattern(/^[0-9/]+$/), Validators.required],
    ],
    preliminaryInvestigation: [
      null,
      [Validators.pattern(/^[0-9/]+$/), Validators.required],
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
    private accountMovementService: AccountMovementService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    // this.getGood(new ListParams)
    // this.filterParams.getValue().addFilter('description', '', SearchFilter.ILIKE)
    // this.filterParams.pipe(takeUntil(this.$unSubscribe)).subscribe({
    //   next: () => this.getGood()
    // })
  }
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

  onCsvSelected(event: any) {
    //cargar csv a campos
    const file: File = event.target.files[0];
    const fileReader: FileReader = new FileReader();

    fileReader.onload = e => {
      const content: string = fileReader.result as string;
      const lines: string[] = content.split('\n');

      this.data.length = 1;
      this.data[0].reset();

      let i = 0;
      let startFlag = true;
      for (let line of lines) {
        if (startFlag) {
          //se salta la primera linea
          startFlag = false;
          continue;
        }
        // Aquí puedes realizar las acciones que deseas con cada línea del archivo
        console.log(line);
        let params = line.replace(/[\r\n]+/g, '').split(',');
        if (i != 0) {
          this.data.push(
            this.fb.group({
              noGood: [null, Validators.required],
              criminalCase: [
                null,
                [Validators.pattern(/^[0-9/]+$/), Validators.required],
              ],
              preliminaryInvestigation: [
                null,
                [Validators.pattern(/^[0-9/]+$/), Validators.required],
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
            })
          );
        }
        console.log(params);
        const rowData = params;
        if (rowData[0]) {
          const formValues = {
            noGood: +rowData[0],
            dateTransfer: rowData[1],
            dateSentencia: rowData[2],
            interests: +rowData[3],
            dateTesofe: rowData[4],
            jobTesofe: rowData[5],
          };

          console.log(formValues);

          this.data[i].patchValue(formValues);
        }
        i++;
      }
    };

    fileReader.readAsText(file);
  }

  getClasificGood() {}

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
  openFile() {
    console.log('asd');
    document.getElementById('uploadfile').click();
  }
}
