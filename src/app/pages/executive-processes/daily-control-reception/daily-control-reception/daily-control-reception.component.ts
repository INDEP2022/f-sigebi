import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms'; 
import { DomSanitizer } from '@angular/platform-browser';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { FilterParams, ListParams, SearchFilter } from 'src/app/common/repository/interfaces/list-params';
import { maxDate } from 'src/app/common/validations/date.validators';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Models
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { ISubdelegation } from 'src/app/core/models/catalogs/subdelegation.model';
//Services
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { PrintFlyersService } from 'src/app/core/services/document-reception/print-flyers.service';

@Component({
  selector: 'app-daily-control-reception',
  templateUrl: './daily-control-reception.component.html',
  styles: [],
})
export class DailyControlReceptionComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  select = new DefaultSelect();

  pdfurl = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';

  today: Date;
  override minMode: BsDatepickerViewMode = 'month'; // change for month:year
  override bsConfig: Partial<BsDatepickerConfig>;

  delegations = new DefaultSelect<IDelegation>();
  subdelegations = new DefaultSelect<ISubdelegation>();

  phaseEdo: number;

  get delegation() {
    return this.form.get('delegation');
  }
  get subdelegation() {
    return this.form.get('subdelegation');
  }
  
  

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private serviceDeleg: DelegationService,
    private printFlyersService: PrintFlyersService
  ) {
    super();
    this.today = new Date();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.bsConfig = Object.assign(
      {},
      {
        minMode: this.minMode,
        dateInputFormat: 'MMMM/YYYY',
      }
    );
  }

  private prepareForm() {
    this.form = this.fb.group({
      delegation: [null],
      subdelegation: [null],
      monthYear: [null, [Validators.required, maxDate(new Date())]],
    });
  }

  getDelegations(params: ListParams) {
    this.serviceDeleg.getAll(params).subscribe(
      data => {
        this.delegations = new DefaultSelect(data.data, data.count);
      },
      err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        this.onLoadToast('error', 'Error', error);
      },
      () => {}
    );
  }

 onDelegationsChange(element: any) {
    this.resetFields([this.delegation]);
    this.subdelegations = new DefaultSelect();
    // console.log(this.PN_NODELEGACION.value);
    if (this.delegation.value)
      this.getSubDelegations({ page: 1, limit: 10, text: '' });
  }

  getSubDelegations(lparams: ListParams) {
    // console.log(lparams);
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    if (lparams?.text.length > 0)
      params.addFilter('dsarea', lparams.text, SearchFilter.LIKE);
    if (this.delegation.value) {
      params.addFilter('delegationNumber', this.delegation.value);
    }
    if (this.phaseEdo) params.addFilter('phaseEdo', this.phaseEdo);
    // console.log(params.getParams());
    this.printFlyersService.getSubdelegations(params.getParams()).subscribe({
      next: data => {
        this.subdelegations = new DefaultSelect(data.data, data.count);
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }

        this.onLoadToast('error', 'Error', error);
      },
    });
  }

  onSubDelegationsChange(element: any) {
    this.resetFields([this.subdelegation]);
    
  }


  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      field = null;
    });
    this.form.updateValueAndValidity();
  }

  cleanForm(): void {
    this.form.reset();
  }

  openPrevPdf() {
    let config: ModalOptions = {
      initialState: {
        documento: {
          urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfurl),
          type: 'pdf',
        },
        callback: (data: any) => {
          console.log(data);
        },
      }, //pasar datos por aca
      class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    this.modalService.show(PreviewDocumentsComponent, config);
  }
}
