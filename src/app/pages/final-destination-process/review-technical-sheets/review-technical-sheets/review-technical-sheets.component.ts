import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-review-technical-sheets',
  templateUrl: './review-technical-sheets.component.html',
  styles: [],
})
export class ReviewTechnicalSheetsComponent extends BasePage implements OnInit {
  form: FormGroup;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  data: LocalDataSource = new LocalDataSource();
  selectReview: any = [];

  get initDate() {
    return this.form.get('initDate');
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe,
    private modalService: BsModalService
  ) {
    super();
    this.settings = { ...this.settings, actions: false, hideSubHeader: false };
    this.settings.columns = COLUMNS;
  }

  ngOnInit(): void {
    this.initForm();

    this.totalItems = 0;
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            //console.log(filter);
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
        }
      });

    this.params.pipe(takeUntil(this.$unSubscribe));
  }

  initForm() {
    this.form = this.fb.group({
      initDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      proceedingsSiab: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(1000),
        ],
      ],
      initAct: [null, [Validators.required]],
      endAct: [null, [Validators.required]],
      userUploadAct: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(40),
        ],
      ],
      regCoordination: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      transf: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(1000),
        ],
      ],
      issuing: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(1000),
        ],
      ],
      authority: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(1000),
        ],
      ],
    });
  }

  onSubmit() {}

  save() {
    this.loading = true;

    const fechaInicio = this.form.get('initDate').value;
    const fechaFin = this.form.get('endDate').value;

    const ActaInicio = this.form.get('initAct').value;
    const ActaFin = this.form.get('endAct').value;

    const fechaInicioFormateada = this.datePipe.transform(
      fechaInicio,
      'dd-MM-yyyy'
    );
    const fechaFinFormateada = this.datePipe.transform(fechaFin, 'dd-MM-yyyy');
    const fechaActaInicio = this.datePipe.transform(ActaInicio, 'dd-MM-yyyy');
    const fechaActaFin = this.datePipe.transform(ActaFin, 'dd-MM-yyyy');

    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    if (fechaInicioFormateada !== null)
      params['filter.fechaInicioFormateada'] = `$eq:${fechaInicioFormateada}`;

    if (fechaFinFormateada !== null)
      params['filter.fechaFinFormateada'] = `$eq:${fechaFinFormateada}`;

    if (this.form.get('proceedingsSiab').value !== null)
      params['filter.proceedingsSiab'] = `$eq:${
        this.form.get('proceedingsSiab').value
      }`;

    if (fechaActaInicio !== null)
      params['filter.fechaActaInicio'] = `$eq:${fechaActaInicio}`;

    if (fechaActaFin !== null)
      params['filter.fechaActaFin'] = `$eq:${fechaActaFin}`;

    if (this.form.get('userUploadAct').value !== null)
      params['filter.userUploadAct'] = `$eq:${
        this.form.get('userUploadAct').value
      }`;

    if (this.form.get('regCoordination').value !== null)
      params['filter.regCoordination'] = `$eq:${
        this.form.get('regCoordination').value
      }`;

    if (this.form.get('transf').value !== null)
      params['filter.transf'] = `$eq:${this.form.get('transf').value}`;

    if (this.form.get('issuing').value !== null)
      params['filter.issuing'] = `$eq:${this.form.get('issuing').value}`;

    if (this.form.get('authority').value !== null)
      params['filter.authority'] = `$eq:${this.form.get('authority').value}`;

    console.log(params);
  }

  settingsChange(event: any) {
    this.settings = event;
  }

  report() {
    //FESTCOTPRE_0001
    let params = {
      //PN_DEVOLUCION: this.data,
    };
    this.siabService.fetchReport('blank', params).subscribe(response => {
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

  selectData(event: { data: any; selected: any }) {
    console.log('AQUI', event);
    this.selectReview = [];
    this.selectReview.push(event.data);
    console.log('this.selectReview', this.selectReview);
  }

  clean() {}
}
