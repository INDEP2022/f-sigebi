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
  selector: 'app-effective-numerary-devolution',
  templateUrl: './effective-numerary-devolution.component.html',
  styles: [],
})
export class EffectiveNumeraryDevolutionComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  maxDate = new Date();
  currencies = new DefaultSelect<IMoneda>([], 0);
  fromF: string = '';
  toT: string = '';
  import: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());

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
      fileFrom: [null, Validators.required],
      fileTo: [null, Validators.required],
      goodFrom: [null, Validators.required],
      goodTo: [null, Validators.required],
      from: [null, Validators.required],
      to: [null, Validators.required],
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
      PN_DELEG: this.form.controls['delegation'].value,
      PN_SUBDEL: this.form.controls['subdelegation'].value,
      PN_EXPINI: this.form.controls['fileFrom'].value,
      PN_EXPFIN: this.form.controls['fileTo'].value,
      PN_BIENINI: this.form.controls['goodFrom'].value,
      PN_BIENFIN: this.form.controls['goodTo'].value,
      PF_FECINI: this.fromF,
      PF_FECFIN: this.toT,
    };

    // let params = {
    //   PN_DELEG: this.form.controls['delegation'].value ? '[null]' : this.form.controls['delegation'].value,
    //   PN_SUBDEL: this.form.controls['subdelegation'].value ? '[null]' : this.form.controls['subdelegation'].value,
    //   PN_EXPINI: this.form.controls['fileFrom'].value ? '[null]' : this.form.controls['fileFrom'].value,
    //   PN_EXPFIN: this.form.controls['fileTo'].value ? '[null]' : this.form.controls['fileTo'].value,
    //   PN_BIENINI: this.form.controls['goodFrom'].value ? '[null]' : this.form.controls['goodFrom'].value,
    //   PN_BIENFIN: this.form.controls['goodTo'].value ? '[null]' : this.form.controls['goodTo'].value,
    //   PF_FECINI: this.fromF ? '[null]' : this.fromF,
    //   PF_FECFIN: this.toT ? '[null]' : this.toT,
    // };

    this.siabService
      .fetchReport('RGERADBDEVNUMEFEC', params)
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

  cleanForm() {
    this.form.reset();
  }
}
