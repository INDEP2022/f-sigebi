import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { IMoneda } from 'src/app/core/models/catalogs/tval-Table5.model';
import { TvalTable5Service } from 'src/app/core/services/catalogs/tval-table5.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-bank-accounts-insured',
  templateUrl: './bank-accounts-insured.component.html',
  styles: [],
})
export class BankAccountsInsuredComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  maxDate = new Date();
  currencies = new DefaultSelect<IMoneda>([], 0);
  fromF: string = '';
  toT: string = '';
  import: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  cve: any;
  @Output() submit = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    private tableServ: TvalTable5Service,
    private datePipe: DatePipe,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      delegation: [null, Validators.required],
      subdelegation: [null, Validators.required],
      currency: [null, Validators.required],
      bank: [null, Validators.required],
      from: [null, Validators.required],
      to: [null, Validators.required],
      import: [null],
    });
  }

  Generar() {
    this.isLoading = true;
    this.submit.emit(this.form);
    this.fromF = this.datePipe.transform(
      this.form.controls['from'].value,
      'dd/MM/yyyy'
    );

    this.toT = this.datePipe.transform(
      this.form.controls['to'].value,
      'dd/MM/yyyy'
    );

    let params = {
      PN_DELEGACION: this.form.controls['delegation'].value,
      PN_SUBDELEGACION: this.form.controls['subdelegation'].value,
      // PC_MONEDA: this.form.controls['currency'].value,
      PC_BANCO: this.form.controls['bank'].value,
      PF_INI: this.fromF,
      PF_FIN: this.toT,
    };

    console.log('params', params);
    this.siabService
      .fetchReport('RGENADBCTASASEGBA', params)
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

  getCurrencies($params: ListParams) {
    let params = new FilterParams();
    params.page = $params.page;
    params.limit = $params.limit;
    if ($params.text) params.search = $params.text;
    this.getRegCurrency(params);
  }

  getRegCurrency(_params?: FilterParams, val?: boolean) {
    // const params = new FilterParams();

    // params.page = _params.page;
    // params.limit = _params.limit;
    // if (val) params.addFilter3('filter.desc_moneda', _params.text);

    this.tableServ.getReg4WidthFilters(_params.getParams()).subscribe({
      next: data => {
        data.data.map(data => {
          data.desc_moneda = `${data.cve_moneda}- ${data.desc_moneda}`;
          return data;
        });
        this.currencies = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.currencies = new DefaultSelect();
      },
    });
  }

  cleanForm() {
    this.form.reset();
  }
}
