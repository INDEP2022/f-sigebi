import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { SURVEILLANCE_CONCEPTS_COLUMNS } from './surveillance-concepts-columns';

@Component({
  selector: 'app-surveillance-concepts',
  templateUrl: './surveillance-concepts.component.html',
  styles: [],
})
export class SurveillanceConceptsComponent extends BasePage implements OnInit {
  form: FormGroup;

  concepts: any[] = [];
  totalItems: number = 0;
  maxDate = new Date();
  fromF: string = '';
  toT: string = '';
  params = new BehaviorSubject<ListParams>(new ListParams());
  @Output() submit = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = SURVEILLANCE_CONCEPTS_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      from: [null, Validators.required],
      to: [null, Validators.required],
      noRequest: [null, Validators.required],
      toRequest: [null, Validators.required],
      keyPol: [null, Validators.required],
    });
  }

  generar() {
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
      PF_FECINI: this.fromF,
      PF_FECFIN: this.toT,
      PN_SOLINI: this.form.controls['noRequest'].value,
      PN_SOLFIN: this.form.controls['toRequest'].value,
      PC_POLIZA: this.form.controls['keyPol'].value,
    };

    this.siabService
      // .fetchReport('RCONADBINCORPOLIZA', params)
      .fetchReportBlank('blank')
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
