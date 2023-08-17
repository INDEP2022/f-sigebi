import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

import { BsModalService } from 'ngx-bootstrap/modal';
//BasePage
import { BasePage } from 'src/app/core/shared/base-page';
//Services
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
//Components
import { DatePipe } from '@angular/common';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { IDepartment } from 'src/app/core/models/catalogs/department.model';
import { ISubdelegation } from 'src/app/core/models/catalogs/subdelegation.model';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { PrintFlyersService } from 'src/app/core/services/document-reception/print-flyers.service';

export interface IReport {
  data: File;
}

@Component({
  selector: 'app-print-flyers',
  templateUrl: './print-flyers.component.html',
  styles: [],
})
export class PrintFlyersComponent extends BasePage implements OnInit {
  flyersForm: FormGroup = this.fb.group({});
  select = new DefaultSelect();
  delegations = new DefaultSelect<IDelegation>();
  subdelegations = new DefaultSelect<ISubdelegation>();
  departments = new DefaultSelect<IDepartment>();
  phaseEdo: number;
  maxDateEnd = new Date();
  maxDateStart: Date;
  minDateEnd: Date;

  @Output() submit = new EventEmitter();
  constructor(
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private siabService: SiabService,
    private fb: FormBuilder,
    private serviceDeleg: DelegationService,
    private printFlyersService: PrintFlyersService,
    private datePipe: DatePipe
  ) {
    super();
    this.maxDateStart = new Date(
      this.maxDateEnd.getFullYear(),
      this.maxDateEnd.getMonth(),
      this.maxDateEnd.getDate() - 1
    );
    this.minDateEnd = new Date(this.maxDateEnd.getFullYear() - 1, 0, 1);
  }

  get PN_NODELEGACION() {
    return this.flyersForm.get('PN_NODELEGACION');
  }
  get PN_NOSUBDELEGACION() {
    return this.flyersForm.get('PN_NOSUBDELEGACION');
  }
  get PN_AREADESTINO() {
    return this.flyersForm.get('PN_AREADESTINO');
  }
  get PF_FECFIN() {
    return this.flyersForm.get('PF_FECFIN');
  }
  get PF_FECINI() {
    return this.flyersForm.get('PF_FECINI');
  }
  get PN_VOLANTEFIN() {
    return this.flyersForm.get('PN_VOLANTEFIN');
  }
  get PN_VOLANTEINI() {
    return this.flyersForm.get('PN_VOLANTEINI');
  }

  get PN_TIPOASUNTO() {
    return this.flyersForm.get('PN_TIPOASUNTO');
  }
  get P_IDENTIFICADOR() {
    return this.flyersForm.get('P_IDENTIFICADOR');
  }

  ngOnInit(): void {
    this.prepareForm();
    // this.confirm();
  }

  prepareForm() {
    this.flyersForm = this.fb.group({
      PN_NODELEGACION: [null, [Validators.required, Validators.maxLength(200)]],
      PN_NOSUBDELEGACION: [
        null,
        [Validators.required, Validators.maxLength(30)],
      ],
      PN_AREADESTINO: [null, [Validators.required, Validators.maxLength(200)]],
      PN_VOLANTEINI: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.maxLength(10),
        ],
      ],
      PN_VOLANTEFIN: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.maxLength(30),
        ],
      ],
      PN_TIPOASUNTO: [null, [Validators.required]],
      PF_FECINI: [null, [Validators.required]],
      PF_FECFIN: [null, [Validators.required]],
      P_IDENTIFICADOR: [0, [Validators.required, Validators.maxLength(14)]],
    });
    this.initialDisabled();
  }

  private initialDisabled() {
    this.PN_NOSUBDELEGACION.disable();
    this.PN_AREADESTINO.disable();
    this.PF_FECFIN.disable();
    this.PN_VOLANTEFIN.disable();
  }

  loadFile() {
    return;
  }

  confirm(): void {
    this.loading = true;
    this.submit.emit(this.flyersForm);
    let dateInit = this.datePipe.transform(this.PF_FECINI.value, 'yyyy-MM-dd');

    let dateEnd = this.datePipe.transform(this.PF_FECFIN.value, 'yyyy-MM-dd');

    let params = {
      PN_NODELEGACION: this.PN_NODELEGACION.value,
      PN_NOSUBDELEGACION: this.PN_NOSUBDELEGACION.value,
      PN_AREADESTINO: this.PN_AREADESTINO.value,
      PN_VOLANTEINI: this.PN_VOLANTEINI.value,
      PN_VOLANTEFIN: this.PN_VOLANTEFIN.value,
      PN_TIPOASUNTO: this.PN_TIPOASUNTO.value,
      PF_FECINI: dateInit,
      PF_FECFIN: dateEnd,
      P_IDENTIFICADOR: this.P_IDENTIFICADOR.value,
    };

    this.siabService
      //.fetchReport('RCONCOGVOLANTESRE', params)
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

  getDelegations(params: ListParams) {
    this.serviceDeleg.getAll(params).subscribe(
      data => {
        this.delegations = new DefaultSelect(data.data, data.count);
      },
      err => {
        this.delegations = new DefaultSelect();
      },
      () => {}
    );
  }

  getSubDelegations(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    if (lparams?.text.length > 0)
      params.addFilter('dsarea', lparams.text, SearchFilter.LIKE);
    if (this.PN_NODELEGACION.value) {
      params.addFilter('delegationNumber', this.PN_NODELEGACION.value);
    }
    if (this.phaseEdo) params.addFilter('phaseEdo', this.phaseEdo);
    this.printFlyersService.getSubdelegations(params.getParams()).subscribe({
      next: data => {
        this.subdelegations = new DefaultSelect(data.data, data.count);
      },
      error: err => {
        this.subdelegations = new DefaultSelect();
      },
    });
  }

  getDepartments(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    if (lparams?.text.length > 0)
      params.addFilter('dsarea', lparams.text, SearchFilter.LIKE);
    if (this.PN_NODELEGACION.value) {
      params.addFilter('numDelegation', this.PN_NODELEGACION.value);
    }
    if (this.PN_NOSUBDELEGACION.value) {
      params.addFilter('numSubDelegation', this.PN_NOSUBDELEGACION.value);
    }
    if (this.phaseEdo) params.addFilter('phaseEdo', this.phaseEdo);
    this.printFlyersService.getDepartments(params.getParams()).subscribe({
      next: data => {
        this.departments = new DefaultSelect(data.data, data.count);
      },
      error: err => {
        this.departments = new DefaultSelect();
      },
    });
  }

  onDelegationsChange(element: any) {
    if (element != undefined) {
      this.resetFields([this.PN_NOSUBDELEGACION]);
      this.resetFields([this.PN_AREADESTINO]);
      this.subdelegations = new DefaultSelect();
      this.departments = new DefaultSelect();

      if (this.PN_NODELEGACION.value) {
        this.enableField('PN_NOSUBDELEGACION');
        this.getSubDelegations({ page: 1, limit: 10, text: '' });
      }
    } else {
      this.PN_NOSUBDELEGACION.setValue(null);
      this.PN_AREADESTINO.setValue(null);
      this.PN_NOSUBDELEGACION.disable();
      this.PN_AREADESTINO.disable();
    }
  }

  onSubDelegationsChange(element: any) {
    if (element != undefined) {
      this.resetFields([this.PN_AREADESTINO]);
      this.departments = new DefaultSelect();
      if (this.PN_NOSUBDELEGACION.value) {
        this.enableField('PN_AREADESTINO');
        this.getDepartments({ page: 1, limit: 10, text: '' });
      }
    } else {
      this.PN_AREADESTINO.setValue(null);
      this.PN_AREADESTINO.disable();
    }
  }
  public onVolanteIniChange(element: any) {
    this.PN_VOLANTEFIN.enable();
    this.PN_VOLANTEFIN.setValidators([
      Validators.pattern(NUMBERS_PATTERN),
      Validators.maxLength(10),
      Validators.min(this.PN_VOLANTEINI.value + 1),
    ]);
  }
  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      field = null;
    });
    this.flyersForm.updateValueAndValidity();
  }

  private enableField(field: string) {
    switch (field) {
      case 'PN_NOSUBDELEGACION':
        this.flyersForm.get('PN_NOSUBDELEGACION').enable();
        break;
      case 'PF_FECFIN':
        this.flyersForm.get('PF_FECFIN').enable();
        break;
      case 'PN_VOLANTEFIN':
        this.flyersForm.get('PN_VOLANTEFIN').enable();
        break;
      case 'PN_AREADESTINO':
        this.flyersForm.get('PN_AREADESTINO').enable();
        break;
    }
  }

  setMinDateEnd(date: Date) {
    if (date != undefined) {
      this.enableField('PF_FECFIN');
      this.PF_FECFIN.setValue(null);
      if (date != undefined) this.minDateEnd = date;
    }
  }

  cleanForm(): void {
    this.flyersForm.reset();
  }

  public onlyNumbers(event: any) {
    var code = event.which ? event.which : event.keyCode;

    if (code >= 48 && code <= 57) {
      return true;
    } else {
      return false;
    }
  }
}
