import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { EmailService } from 'src/app/core/services/ms-email/email.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { EMAIL_CONFIG_COLUMNS } from './mail-configuration-columns';

@Component({
  selector: 'app-maintenance-mail-configuration',
  templateUrl: './maintenance-mail-configuration.component.html',
  styles: [],
})
export class MaintenanceMailConfigurationComponent
  extends BasePage
  implements OnInit
{
  form = new FormGroup({
    identifier: new FormControl('', [Validators.required]),
    asunto: new FormControl('', [Validators.required]),
    body: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required]),
  });

  emailsSend = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor(private emailService: EmailService) {
    super();
    this.settings.columns = EMAIL_CONFIG_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params.subscribe(params => {
      this.getEmailSend(params);
    });
    // this.prepareForm();
  }

  // prepareForm() {
  //   this.form = this.fb.group({
  //     identifier: [null, Validators.required],
  //     asunto: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
  //     body: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
  //     status: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
  //   });
  // }

  getEmailSend(listParams: ListParams): void {
    this.loading = true;
    this.emailService.getVigEmailSend(listParams).subscribe({
      next: res => {
        this.emailsSend.load(res.data);
        this.totalItems = res.count;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  save() {
    console.log(this.form.value);
  }
}
