import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import { TvalTable1Service } from 'src/app/core/services/catalogs/tval-table1.service';
import { TvalTable5Service } from 'src/app/core/services/catalogs/tval-table5.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
@Component({
  selector: 'app-numerary-physics',
  templateUrl: './numerary-physics.component.html',
  styles: [],
})
export class NumeraryPhysicsComponent extends BasePage implements OnInit {
  form: FormGroup;
  isLoading = false;
  maxDate = new Date();
  currencies = new DefaultSelect<IMoneda>([], 0);
  fromF: string = '';
  toT: string = '';
  @Input() goodTypeShow: boolean = true;
  import: number = 0;
  // @Input() typeField: string = 'type';
  params = new BehaviorSubject<ListParams>(new ListParams());
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  types = new DefaultSelect<Partial<any>>();
  @Output() submit = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private tableServ: TvalTable5Service,
    private datePipe: DatePipe,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private tvalTable1Service: TvalTable1Service
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getTvalTable1Service(new ListParams());
  }

  prepareForm() {
    this.form = this.fb.group({
      delegation: [null, Validators.required],
      from: [null, Validators.required],
      to: [null, Validators.required],
      type: [null, Validators.required],
    });
  }
  getTypes(params: ListParams, id: any = null) {
    const _params: any = params;
    if (id) {
      params['filter.id'] = id;
    } else {
      _params['filter.nameGoodType'] = `$ilike:${params.text}`;
    }
    delete _params.search;
    delete _params.text;
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
      PN_DELEG: this.form.controls['delegation'].value,
      PF_FECINI: this.fromF,
      PF_FECFIN: this.toT,
      PC_TIPO: this.form.controls['type'].value,
    };

    console.log('params', params);
    this.siabService
      .fetchReport('RGENADBNUMEFISICO', params)
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

  getTvalTable1Service(params?: ListParams) {
    params['filter.nmtable'] = `$eq:348`;
    if (params.text) params['filter.otvalor'] = `$eq:${params.text}`;

    this.tvalTable1Service.getAlls(params).subscribe({
      next: (data: any) => {
        console.log('data', data);
        this.types = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.types = new DefaultSelect();
      },
    });
  }

  cleanForm() {
    this.form.reset();
  }

  // get type() {
  //   return this.form.get(this.typeField);
  // }
}
