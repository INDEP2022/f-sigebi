import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-appraisal-request',
  templateUrl: './appraisal-request.component.html',
  styles: [],
})
export class AppraisalRequestComponent implements OnInit {
  form: FormGroup;

  public peritos = new DefaultSelect();
  public institutions = new DefaultSelect();
  public delegation = new DefaultSelect();
  public subdelegation = new DefaultSelect();
  public department = new DefaultSelect();
  public appraisalCurrency = new DefaultSelect();

  constructor(private fb: FormBuilder) // private peritosService: PeritosService
  {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      noRequest: [null, Validators.required],
      requestDate: [null, Validators.required],
      noPerito: [null, Validators.required],
      institution: [null, Validators.required],
      applicant: [null, Validators.required],
      userName: [null, Validators.required],
      delegation: [null, Validators.required],
      subdelegation: [null, Validators.required],
      department: [null, Validators.required],
      requestedTo: [null, Validators.required],
      requestedName: [null, Validators.required],
      requestedDelegation: [null, Validators.required],
      requestedSubdelegation: [null, Validators.required],
      requestedDepartment: [null, Validators.required],
      observations: [null, Validators.required],

      costCurrency: [null, Validators.required],
      appraisalCurrency: [null, Validators.required],
      elements: [],
      registers: [],
    });
  }

  send() {
    console.log(this.form.value);
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
