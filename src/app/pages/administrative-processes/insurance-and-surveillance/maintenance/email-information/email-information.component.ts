import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { EmailService } from 'src/app/core/services/ms-email/email.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-email-information',
  templateUrl: './email-information.component.html',
  styles: [],
})
export class EmailInformationComponent extends BasePage {
  maxDate = new Date();
  VigEmailSend = new DefaultSelect();
  VigEmailBook = new DefaultSelect();
  VigCC = new DefaultSelect();
  VigEmailBody = new DefaultSelect();
  // form: FormGroup;
  constructor(
    // private fb: FormBuilder,
    private emailService: EmailService
  ) {
    super();
  }
  form = new FormGroup({
    reasonForChange: new FormControl(null, [
      Validators.required,
      Validators.pattern(STRING_PATTERN),
    ]),
    date: new FormControl(null, Validators.required),
    from: new FormControl(null, Validators.required),
    to: new FormControl(null, Validators.required),
    cc: new FormControl(null, Validators.required),
    type: new FormControl(null, Validators.required),
    issue: new FormControl(null, Validators.required),
    body: new FormControl(null, Validators.required),
    textBody: new FormControl(null, Validators.required),
  });

  public from = new DefaultSelect();
  public tos = new DefaultSelect();
  public ccs = new DefaultSelect();
  public types = new DefaultSelect();

  @ViewChild('Send') Send: ElementRef;

  @Output() eventEmailInformation = new EventEmitter();

  ngOnInit(): void {
    this.getDate();
    // this.prepareForm();
  }
  save() {
    console.log(this.form.value);
  }

  getFormEmailInformation() {
    return this.form;
  }

  changeType($event: any): void {
    console.log($event);
    if ($event) {
      this.form.get('body').setValue($event.id);
      this.form.get('textBody').setValue($event.bodyEmail);
      this.form.get('issue').setValue($event.subjectEmail);
    }
  }
  // prepareForm() {
  //   this.form = this.fb.group({
  //     reasonForChange: [null, [
  //       Validators.required,
  //       Validators.pattern(STRING_PATTERN),
  //     ]],
  //     date: [null, Validators.required],
  //     from: [null, Validators.required],
  //     to: [null, Validators.required],
  //     cc: [null, Validators.required],
  //     type: [null, Validators.required],
  //     issue: [null, Validators.required],
  //     body: [null, Validators.required],
  //     textBody: [null, Validators.required],
  //   });
  // }

  send() {
    console.log('this.form.value', this.form.value);
    this.eventEmailInformation.emit(this.form.value);
  }

  convertEmailBody(id: any): string {
    const data: any = {
      1: 'Eliminación de Cargas Erróneas',
      2: 'Cambio de Periodos',
      3: 'Cambio de Bienes de Número Aleatorio',
    };
    return data?.[id] || id.toString();
  }

  onChangeCc(event: any) {
    console.log(event);
    if (event) {
      this.form.get('cc').setValue(event.id);
    }

    console.log('Send', this.Send);
  }
  onChangeTo(event: any) {
    console.log(event);
    if (event) {
      this.form.get('to').setValue(event.id);
    }
  }
  onChangeFrom(event: any) {
    console.log(event);
    if (event) {
      this.form.get('from').setValue(event.id);
    }
  }

  cleanForm() {
    this.form.get('type').setValue('');
    this.form.reset();
  }

  async getDate() {
    // console.log('date', );
    // const formattedDate = moment(date).format('DD-MM-YYYY');
    // if () {

    this.form.get('date').valueChanges.subscribe((date: Date) => {
      if (date) {
        const formattedDate = moment(date).format('YYYY-MM-DD');
        this.form.value.date = formattedDate;
        // this.form.patchValue({ date: formattedDate }, { emitEvent: false });
      }
    });
    // const fechaEscritura: any = new Date();
    // fechaEscritura.setUTCDate(fechaEscritura.getUTCDate());
    // const _fechaEscritura: any = new Date(fechaEscritura.toISOString());
    // return _fechaEscritura ? _fechaEscritura : null;
    // } else {
    //   return null;
    // }
    // { authorizeDate: formattedDate }
    // { emitEvent: false }
  }

  // EMAIL FROM //
  async getVigEmailSend(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    params.addFilter('status', 1, SearchFilter.EQ);
    if (lparams.text) params.search = lparams.text;
    // params.addFilter('nameSend', lparams.text, SearchFilter.ILIKE);
    params.sortBy = `nameSend:ASC`
    return new Promise((resolve, reject) => {
      this.emailService.getVigEmailSend(params.getParams()).subscribe({
        next: async (response: any) => {
          console.log('resss', response);
          let result = response.data.map(async (item: any) => {
            item['emailSend'] = item.nameSend + ' - ' + item.emailSend;
          });

          Promise.all(result).then(async (resp: any) => {
            this.VigEmailSend = new DefaultSelect(
              response.data,
              response.count
            );
            this.loading = false;
          });
        },
        error: error => {
          this.VigEmailSend = new DefaultSelect();
          this.loading = false;
          resolve(null);
        },
      });
    });
  }

  // EMAIL TO //
  async getVigMailBook(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    params.addFilter('bookType', 'P', SearchFilter.EQ);
    params.addFilter('bookStatus', 1, SearchFilter.EQ);

    if (lparams.text) params.search = lparams.text;
    // if (lparams.text)
    //   // params.search = lparams.text;
    //   params.addFilter('bookName', lparams.text, SearchFilter.ILIKE);
    params.sortBy = `bookName:ASC`
    return new Promise((resolve, reject) => {
      this.emailService.getVigMailBook(params.getParams()).subscribe({
        next: async (response: any) => {
          console.log('resss', response);
          let result = response.data.map(async (item: any) => {
            item['bookEmail'] = item.bookName + ' - ' + item.bookEmail;
          });

          Promise.all(result).then(async (resp: any) => {
            this.VigEmailBook = new DefaultSelect(
              response.data,
              response.count
            );
            this.loading = false;
          });
        },
        error: error => {
          this.VigEmailBook = new DefaultSelect();
          this.loading = false;
          resolve(null);
        },
      });
    });
  }

  // CC //
  async getCC(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    params.addFilter('bookType', 'C', SearchFilter.EQ);
    params.addFilter('bookStatus', 1, SearchFilter.EQ);

    if (lparams.text)
      params.search = lparams.text;
    // params.addFilter('bookName', lparams.text, SearchFilter.ILIKE);
    params.sortBy = `bookName:ASC`
    return new Promise((resolve, reject) => {
      this.emailService.getVigMailBook(params.getParams()).subscribe({
        next: async (response: any) => {
          console.log('resss', response);
          let result = response.data.map(async (item: any) => {
            item['bookEmail'] = item.bookName + ' - ' + item.bookEmail;
          });

          Promise.all(result).then(async (resp: any) => {
            this.VigCC = new DefaultSelect(response.data, response.count);
            this.loading = false;
          });
        },
        error: error => {
          this.VigCC = new DefaultSelect();
          this.loading = false;
          resolve(null);
        },
      });
    });
  }

  // BODY //
  async getBody(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    params.addFilter('status', 1, SearchFilter.EQ);
    params.addFilter('id', `1,2,3`, SearchFilter.IN);
    params.sortBy = `id:ASC`;
    if (lparams.text)
      // params.search = lparams.text;
      params.addFilter('bodyEmail', lparams.text, SearchFilter.ILIKE);

    return new Promise((resolve, reject) => {
      this.emailService.getVigEmailBody(params.getParams()).subscribe({
        next: async (response: any) => {
          console.log('resss', response);
          let result = response.data.map(async (item: any) => {
            item['body'] = this.convertEmailBody(item.id);
            // item.id + ' - ' + item.bodyEmail;
          });

          Promise.all(result).then(async (resp: any) => {
            this.VigEmailBody = new DefaultSelect(
              response.data,
              response.count
            );
            this.loading = false;
          });
        },
        error: error => {
          this.VigEmailBody = new DefaultSelect();
          this.loading = false;
          resolve(null);
        },
      });
    });
  }
}
