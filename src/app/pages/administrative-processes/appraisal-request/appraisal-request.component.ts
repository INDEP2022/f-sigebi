import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DepartamentService } from 'src/app/core/services/catalogs/departament.service';
import { ProeficientService } from 'src/app/core/services/catalogs/proficient.service';
import { SubdelegationService } from 'src/app/core/services/catalogs/subdelegation.service';
import { AppraisesService } from 'src/app/core/services/ms-appraises/appraises.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { DelegationService } from '../../../core/services/catalogs/delegation.service';
import { InstitutionClasificationService } from '../../../core/services/catalogs/institution-classification.service';
import { InstitutionClassificationDetailComponent } from '../../../pages/catalogs/institution-classification/institution-classification-detail/institution-classification-detail.component';

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
  public appraisalCurrency = new DefaultSelect();

  constructor(
    private fb: FormBuilder,
    private proeficientService: ProeficientService,
    private delegationService: DelegationService,
    private subdelegationService: SubdelegationService,
    private departamentService: DepartamentService,
    private institucionService: InstitutionClasificationService,
    private modalService: BsModalService,
    private appraisalService: AppraisesService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      noRequest: [null, Validators.required],
      requestDate: [null, Validators.required],
      noPerito: [null, Validators.required],
      institution: [null, Validators.required],
      applicant: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      userName: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
      delegation: [null, Validators.required],
      subdelegation: [null, Validators.required],
      department: [null, Validators.required],
      requestedTo: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      requestedName: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      requestedDelegation: [null, Validators.required],
      requestedSubdelegation: [null, Validators.required],
      requestedDepartment: [null, Validators.required],
      observations: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],

      costCurrency: [null, Validators.required],
      appraisalCurrency: [null, Validators.required],
      elements: [],
      registers: [],
    });
  }

  send() {
    console.log(this.form.value);
  }

  public getPeritos(params: ListParams) {
    this.proeficientService.getAll(params).subscribe(data => {
      this.peritos = new DefaultSelect(data.data, data.count);
    });
  }

  public getInstitutions(params: any) {
    this.institucionService.getAll(params).subscribe(data => {
      console.log(data);
      this.institutions = new DefaultSelect(data.data, data.count);
    });
  }

  public getDelegations(params: ListParams) {
    this.delegationService.getAll(params).subscribe(data => {
      // console.log(data);
      this.delegation = new DefaultSelect(data.data, data.count);
    });
  }

  public getSubdelegations(params: ListParams) {
    this.subdelegationService.getAll(params).subscribe(data => {
      console.log(data);
      this.subdelegation = new DefaultSelect(data.data, data.count);
    });
  }

  public getDepartments(params: any) {
    this.departamentService.getAll(params).subscribe(data => {
      console.log(data);
      this.department = new DefaultSelect(data.data, data.count);
    });
  }

  public getCurrencies(event: any) {
    // this.currencyService.getAll(params).subscribe(data => {
    //   this.currency = new DefaultSelect(data.data, data.count);
    // });
  }

  public getRequestById(params: ListParams, id?: number) {
    this.appraisalService.getRequestAppraisalById(id).subscribe({
      next: data => {
        this.noRequest = new DefaultSelect([data]);
      },
      error: error => {
        console.log(error);
      },
    });
  }

  openModal(context?: Partial<InstitutionClassificationDetailComponent>) {
    const modalRef = this.modalService.show(
      InstitutionClassificationDetailComponent,
      {
        initialState: context,
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
  }

  public add() {
    this.openModal();
  }
}
