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
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { GoodSsubtypeService } from 'src/app/core/services/catalogs/good-ssubtype.service';
import { GoodSubtypeService } from 'src/app/core/services/catalogs/good-subtype.service';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { TvalTable5Service } from 'src/app/core/services/catalogs/tval-table5.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-appraisal-goods',
  templateUrl: './appraisal-goods.component.html',
  styles: [],
})
export class AppraisalGoodsComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  maxDate = new Date();
  currencies = new DefaultSelect<IMoneda>([], 0);
  import: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  public initialType = new DefaultSelect();
  public finalType = new DefaultSelect();
  public initialSubtype = new DefaultSelect();
  public finalSubtype = new DefaultSelect();
  @Output() submit = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    private tableServ: TvalTable5Service,
    private datePipe: DatePipe,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private goodTypesService: GoodTypeService,
    private goodSubtypeService: GoodSubtypeService,
    private goodSsubtypeService: GoodSsubtypeService,
    private goodSssubtypeService: GoodSssubtypeService
  ) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      delegation: [null, Validators.required],
      subdelegation: [null, Validators.required],
      initialType: [null, Validators.required],
      finalType: [null, Validators.required],
      initialSubtype: [null, Validators.required],
      finalSubtype: [null, Validators.required],
      daysToFinish: [null, Validators.required],
    });
  }
  getInitialType(params: ListParams) {
    this.goodTypesService.getAll(params).subscribe(data => {
      this.initialType = new DefaultSelect(data.data, data.count);
    });
  }

  getFinaltype(params: ListParams) {
    this.goodSubtypeService.getAll(params).subscribe(data => {
      this.finalType = new DefaultSelect(data.data, data.count);
    });
  }

  getInitialSubtype(params: ListParams) {
    this.goodSsubtypeService.getAll(params).subscribe(data => {
      this.initialSubtype = new DefaultSelect(data.data, data.count);
    });
  }

  getFinalSubtype(params: ListParams) {
    this.goodSssubtypeService.getAll(params).subscribe(data => {
      this.finalSubtype = new DefaultSelect(data.data, data.count);
    });
  }

  Generar() {
    this.isLoading = true;
    this.submit.emit(this.form);

    let params = {
      PN_DELEG: this.form.controls['delegation'].value,
      PN_SUBDEL: this.form.controls['subdelegation'].value,
      PN_TIPOINI: this.form.controls['initialType'].value,
      PN_TIPOFIN: this.form.controls['finalType'].value,
      PN_STIPOINI: this.form.controls['initialSubtype'].value,
      PN_STIPOFIN: this.form.controls['finalSubtype'].value,
      PN_DIAS: this.form.controls['daysToFinish'].value,
    };

    this.siabService
      .fetchReport('RCONADBBIENESSAVA', params)
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

  getRegCurrency() {
    this.tableServ.getReg4WidthFilters().subscribe({
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
