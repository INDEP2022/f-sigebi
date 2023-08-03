import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
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
  data: any;
  selectReview: any = [];

  get initDate() {
    return this.form.get('initDate');
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService
  ) {
    super();
    this.settings = { ...this.settings, actions: false, hideSubHeader: false };
    this.settings.columns = COLUMNS;
  }

  ngOnInit(): void {
    this.initForm();
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

  save(filter: any) {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...(this.columnFilters = []),
    };
    /*
        if (this.form.get('initDate').value !== null)
          params['filter.initDate'] = `$ilike:${this.form.get('initDate').value}`;
    
        if (this.form.get('endDate').value !== null)
          params['filter.storeNumber'] = `$eq:${this.form.get('warehouse').value}`;
    */
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
