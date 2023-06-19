import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IPerson } from 'src/app/core/models/catalogs/person.model';
import { PersonService } from 'src/app/core/services/catalogs/person.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-depositary-report',
  templateUrl: './depositary-report.component.html',
  styles: [],
})
export class DepositaryReportComponent extends BasePage implements OnInit {
  depositaryDataForm: FormGroup;
  persons = new DefaultSelect<IPerson>();
  @Input() goodId: number;
  ngOnInit(): void {
    this.prepareForm();
  }
  constructor(
    private fb: FormBuilder,
    private readonly personService: PersonService
  ) {
    super();
  }

  private prepareForm() {
    this.depositaryDataForm = this.fb.group({
      reportDate: [null],
      person: [null],
      noPerson: [null],
      report: [null],
    });
  }

  getPerson(params?: ListParams) {
    this.personService.getAll(params).subscribe({
      next: resp => (this.persons = new DefaultSelect(resp.data, resp.count)),
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

  onPersonChange(event: IPerson) {
    console.log(event);
    this.depositaryDataForm.get('noPerson').patchValue(event.id);
  }
}
