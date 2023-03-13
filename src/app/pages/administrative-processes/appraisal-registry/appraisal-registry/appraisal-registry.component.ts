import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppraiseService } from 'src/app/core/services/ms-appraise/appraise.service';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-appraisal-registry',
  templateUrl: './appraisal-registry.component.html',
  styles: [],
})
export class AppraisalRegistryComponent implements OnInit {
  form: FormGroup;

  public peritos = new DefaultSelect();
  public institutions = new DefaultSelect();
  public delegation = new DefaultSelect();
  public subdelegation = new DefaultSelect();
  public department = new DefaultSelect();
  public appraisalCurrency = new DefaultSelect();
  constructor(
    private fb: FormBuilder,
    private _AppraisalService: AppraiseService
  ) {}

  ngOnInit(): void {
    this.prepareForm();
    this._AppraisalService.getPerito().subscribe(data => {
      console.log(data);
    });
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

      appraisalCost: [],
      appraisalDate: [],
      expirationAppraisal: [],

      bien: [],
      appraisalValue: [],
      appraisalAmount: [],
      expiracyDate: [],
      appraisalDates: [],
      totalAppraisal: [],

      elements: [],
      registers: [],
    });
  }

  public getPeritos(event: any) {
    // this.bankService.getAll(params).subscribe(data => {
    //   this.peritos = new DefaultSelect(data.data, data.count);
    // });
  }

  public getInstitutions(event: any) {
    // this.bankService.getAll(params).subscribe(data => {
    //   this.banks = new DefaultSelect(data.data, data.count);
    // });
  }

  public getDelegations(event: any) {
    // this.bankService.getAll(params).subscribe(data => {
    //   this.banks = new DefaultSelect(data.data, data.count);
    // });
  }

  public getSubdelegations(event: any) {
    // this.bankService.getAll(params).subscribe(data => {
    //   this.banks = new DefaultSelect(data.data, data.count);
    // });
  }

  public getDepartments(event: any) {
    // this.bankService.getAll(params).subscribe(data => {
    //   this.banks = new DefaultSelect(data.data, data.count);
    // });
  }

  public getCurrencies(event: any) {
    // this.currencyService.getAll(params).subscribe(data => {
    //   this.currency = new DefaultSelect(data.data, data.count);
    // });
  }
}
