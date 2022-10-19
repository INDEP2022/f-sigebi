import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { BOOK_EMAIL_COLUMNS } from './book-email-columns';

@Component({
  selector: 'app-email-book-config',
  templateUrl: './email-book-config.component.html',
  styles: [],
})
export class EmailBookConfigComponent extends BasePage implements OnInit {
  form: FormGroup;

  public regionalDelegations = new DefaultSelect();

  emailConfig: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor(private fb: FormBuilder) {
    super();
    this.settings.columns = BOOK_EMAIL_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      regionalDelegation: [null, Validators.required],
    });
  }

  save() {
    console.log(this.form.value);
  }

  public getRegionalDelegations(event: any) {
    // this.bankService.getAll(params).subscribe(data => {
    //   this.banks = new DefaultSelect(data.data, data.count);
    // });
  }
}
