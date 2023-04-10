import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IAppraisalMonitor } from 'src/app/core/models/ms-appraise/appraise-model';
import { DepartamentService } from 'src/app/core/services/catalogs/departament.service';
import { ProeficientService } from 'src/app/core/services/catalogs/proficient.service';
import { SubdelegationService } from 'src/app/core/services/catalogs/subdelegation.service';
import { DynamicTablesService } from 'src/app/core/services/dynamic-catalogs/dynamic-tables.service';
import { AppraisesService } from 'src/app/core/services/ms-appraises/appraises.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { IListResponse } from '../../../../app/core/interfaces/list-response.interface';
import { DelegationService } from '../../../core/services/catalogs/delegation.service';
import { InstitutionClasificationService } from '../../../core/services/catalogs/institution-classification.service';
import { AppraisalRequestDetailComponent } from './appraisal-request-detail/appraisal-request-detail.component';

@Component({
  selector: 'app-appraisal-request',
  templateUrl: './appraisal-request.component.html',
  styles: [],
})
export class AppraisalRequestComponent extends BasePage implements OnInit {
  form: FormGroup;

  public peritos = new DefaultSelect();
  public institutions = new DefaultSelect();
  public delegation = new DefaultSelect();
  public subdelegation = new DefaultSelect();
  public department = new DefaultSelect();
  public noRequest = new DefaultSelect();
  public currency = new DefaultSelect();
  appraisals: any[] = [];
  totalItems: number = 0;

  constructor(
    private fb: FormBuilder,
    private proeficientService: ProeficientService,
    private delegationService: DelegationService,
    private subdelegationService: SubdelegationService,
    private departamentService: DepartamentService,
    private institucionService: InstitutionClasificationService,
    private modalService: BsModalService,
    private appraisalService: AppraisesService,
    private datePipe: DatePipe,
    private currencyService: DynamicTablesService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getRequestAppraisalAll(new ListParams());
  }

  prepareForm() {
    this.form = this.fb.group({
      noRequest: [null, [Validators.required]],
      requestDate: [null, [Validators.required]],
      noPerito: [null, [Validators.required]],
      institution: [null, [Validators.required]],
      applicant: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      userName: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      delegation: [null, [Validators.required]],
      subdelegation: [null, [Validators.required]],
      department: [null, [Validators.required]],
      requestedTo: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      requestedName: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      requestedDelegation: [null, [Validators.required]],
      requestedSubdelegation: [null, [Validators.required]],
      requestedDepartment: [null, [Validators.required]],
      observations: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],

      costCurrency: [null, [Validators.required]],
      appraisalCurrency: [null, [Validators.required]],
      elements: [],
      registers: [],
    });
  }

  send() {
    this.loading = true;
    // const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/RGERADBNUMEOTRMON.pdf?PARAMFORM=NO`
    const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/blank.pdf`;
    const downloadLink = document.createElement('a');
    downloadLink.href = pdfurl;
    downloadLink.target = '_blank';
    downloadLink.click();
    let params = { ...this.form.value };
    for (const key in params) {
      if (params[key] === null) delete params[key];
    }
    this.onLoadToast('success', '', 'Reporte generado');
    this.loading = false;
  }

  public getPeritos(params: ListParams) {
    this.proeficientService.getAll(params).subscribe(data => {
      this.peritos = new DefaultSelect(data.data, data.count);
    });
  }

  public getInstitutions(params: any) {
    this.institucionService.getAll(params).subscribe(data => {
      this.institutions = new DefaultSelect(data.data, data.count);
    });
  }

  public getDelegations(params: ListParams) {
    this.delegationService.getAll(params).subscribe(data => {
      this.delegation = new DefaultSelect(data.data, data.count);
    });
  }

  public getSubdelegations(params: ListParams) {
    this.subdelegationService.getAll(params).subscribe(data => {
      this.subdelegation = new DefaultSelect(data.data, data.count);
    });
  }

  public getDepartments(params: any) {
    this.departamentService.getAll(params).subscribe(data => {
      this.department = new DefaultSelect(data.data, data.count);
    });
  }

  public getCurrencies(params: ListParams) {
    this.currencyService.getTvalTable5ByTable(3).subscribe(data => {
      this.currency = new DefaultSelect(data.data, data.count);
    });
  }

  public getRequestAppraisalAll(params?: ListParams) {
    params.text =
      params.text == null || params.text == ''
        ? ''
        : (params['filter.id'] = `${params.text}`);
    this.appraisalService
      .getRequestAppraisalAll(params)
      .subscribe((data: IListResponse<IAppraisalMonitor>) => {
        this.noRequest = new DefaultSelect(data.data, data.count);
      });
  }

  public getRequestAppraisalById() {
    let requestNumber = this.form.controls['noRequest'].value;
    this.appraisalService.id_request = requestNumber;
    this.appraisalService.getRequestAppraisalById(requestNumber).subscribe({
      next: data => {
        this.form.controls['applicant'].setValue(data.sourceUser);
        this.form.controls['requestedTo'].setValue(data.targetUser);
        this.form.controls['noPerito'].setValue(data.noExpert);
        this.form.controls['appraisalCurrency'].setValue(
          data.cveCurrencyAppraisal
        );
        this.form.controls['costCurrency'].setValue(data.cveCurrencyCost);
        this.form.controls['observations'].setValue(data.observations);
        this.form.controls['requestDate'].setValue(
          this.datePipe.transform(data.requestDate, 'dd/MM/yyyy')
        );
        this.form.controls['institution'].setValue(data.noAppraiser);
      },
      error: error => (this.loading = false),
    });
  }

  openModal(context?: Partial<AppraisalRequestDetailComponent>) {
    const modalRef = this.modalService.show(AppraisalRequestDetailComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  public add() {
    this.openModal();
  }
}
