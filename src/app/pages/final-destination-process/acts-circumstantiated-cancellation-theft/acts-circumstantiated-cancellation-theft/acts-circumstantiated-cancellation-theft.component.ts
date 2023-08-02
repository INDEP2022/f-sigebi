import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, tap } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { COLUMNS1 } from './columns1';
import { COLUMNS2 } from './columns2';

@Component({
  selector: 'app-acts-circumstantiated-cancellation-theft',
  templateUrl: './acts-circumstantiated-cancellation-theft.component.html',
  styles: [],
})
export class ActsCircumstantiatedCancellationTheftComponent
  extends BasePage
  implements OnInit
{
  response: boolean = false;
  form: FormGroup;
  formTable1: FormGroup;
  formTable2: FormGroup;
  formTag: FormGroup;
  bsValueFromYear: Date = new Date();
  minModeFromYear: BsDatepickerViewMode = 'year';
  bsConfigFromYear: Partial<BsDatepickerConfig>;
  bsValueFromMonth: Date = new Date();
  minModeFromMonth: BsDatepickerViewMode = 'month';
  bsConfigFromMonth: Partial<BsDatepickerConfig>;
  totalItems: number = 0;
  settings2: any;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data1 = EXAMPLE_DATA1;
  data2 = EXAMPLE_DATA2;
  folioScan: number;
  loadingDoc: boolean = false;

  constructor(
    private fb: FormBuilder,
    private jasperService: SiabService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer
  ) {
    super();
    this.settings = { ...this.settings, actions: false };
    this.settings.columns = COLUMNS1;
    this.settings2 = { ...this.settings, actions: false };
    this.settings2.columns = COLUMNS2;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      statusAct: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      preliminaryAscertainment: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      causePenal: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      elabDate: [null, [Validators.required]],
      captureDate: [null, [Validators.required]],
      actSelect: [null, [Validators.required]],
      authority: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      ident: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      receive: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      admin: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      folio: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      year: [this.bsValueFromYear, [Validators.required]],
      month: [this.bsValueFromMonth, [Validators.required]],
      act: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      address: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      autorithy2: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      observations: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      elaboration: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      responsible: [null, [Validators.required]],
      witnessContr: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      folioScan: [null, [Validators.required]],
    });

    this.formTable1 = this.fb.group({
      detail: [null, [Validators.pattern(STRING_PATTERN)]],
    });

    this.formTable2 = this.fb.group({
      detail: [null, [Validators.pattern(STRING_PATTERN)]],
      status: [null, [Validators.pattern(STRING_PATTERN)]],
    });

    this.formTag = this.fb.group({
      tag: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  onSubmit() {}

  search(event: any) {
    this.response = !this.response;
  }

  settingsChange(event: any, op: number) {
    op === 1 ? (this.settings = event) : (this.settings2 = event);
  }

  proccesReport() {
    if (this.folioScan) {
      const msg = setTimeout(() => {
        this.jasperService
          .fetchReport('RGERGENSOLICDIGIT', { pn_folio: this.folioScan })
          .pipe(
            tap(response => {
              this.alert(
                'success',
                'Generado correctamente',
                'Generado correctamente con folio: ' + this.folioScan
              );
              const blob = new Blob([response], { type: 'application/pdf' });
              const url = URL.createObjectURL(blob);
              let config = {
                initialState: {
                  documento: {
                    urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                    type: 'pdf',
                  },
                  callback: (data: any) => {},
                },
                class: 'modal-lg modal-dialog-centered',
                ignoreBackdropClick: true,
              };
              this.modalService.show(PreviewDocumentsComponent, config);
              this.loadingDoc = false;
              clearTimeout(msg);
            })
          )
          .subscribe();
      }, 1000);
    } else {
      this.alert(
        'error',
        'ERROR',
        'Debe tener el folio en pantalla para poder imprimir'
      );
    }
  }
}
const EXAMPLE_DATA1 = [
  {
    goodNumb: '3859',
    description: 'Inmueble ubicado...',
    quantity: 1,
    act: '...',
  },
];

const EXAMPLE_DATA2 = [
  {
    goodNumb: '9877',
    clasificationNumb: '7874',
    description: '...',
    quantity: 4,
  },
];
