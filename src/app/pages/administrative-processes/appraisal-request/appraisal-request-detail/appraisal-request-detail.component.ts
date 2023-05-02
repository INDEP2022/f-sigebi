import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { AppraisesService } from 'src/app/core/services/ms-appraises/appraises.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { APPRAISAL_COLUMNS } from './appraisal-request-detail-columns';

@Component({
  selector: 'app-appraisal-request-detail',
  templateUrl: './appraisal-request-detail.component.html',
  styles: [],
})
export class AppraisalRequestDetailComponent
  extends BasePage
  implements OnInit
{
  status: string = 'Nueva';
  edit: boolean = false;
  form: FormGroup = new FormGroup({});
  institution: any;
  appraisals: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  // public get id() {
  //   return this.form.get('id');
  // }

  @Output() refresh = new EventEmitter<true>();
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private appraisalService: AppraisesService
  ) {
    super();
    this.settings.columns = APPRAISAL_COLUMNS;
    this.settings.actions = false;
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getGoodsbyRequest();
  }

  prepareForm() {
    this.form = this.fb.group({
      id: [null],
      description: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100),
          Validators.pattern(''),
        ]),
      ],
      numRegister: [
        null,
        Validators.compose([Validators.minLength(1), Validators.pattern('')]),
      ],
    });
    if (this.edit) {
      this.status = 'Actualizar';
      this.form.patchValue(this.institution);
    }
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  close() {
    this.modalRef.hide();
  }

  create() {
    this.loading = true;
    // this.institutionService.create(this.form.value).subscribe(
    //   data => this.handleSuccess(),
    //   error => (this.loading = false)
    // );
  }

  handleSuccess() {
    this.loading = false;
    this.refresh.emit(true);
    this.modalRef.hide();
  }

  update() {
    this.loading = true;

    // this.institutionService.newUpdate(this.form.value).subscribe(
    //   data => this.handleSuccess(),
    //   error => (this.loading = false)
    // );
  }

  getGoodsbyRequest() {
    this.loading = true;
    let num = this.appraisalService.id_request;
    this.appraisalService.getGoodsByAppraises(num).subscribe({
      next: data => {
        this.appraisals = data.data;
        this.totalItems = data.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }
}
