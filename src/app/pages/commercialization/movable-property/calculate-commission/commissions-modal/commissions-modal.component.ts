import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IComerEvent2 } from 'src/app/core/models/ms-event/event.model';
import { IGood } from 'src/app/core/models/ms-good/good';
import { IComerCommissionsPerGood } from 'src/app/core/models/ms-thirdparty/third-party.model';
import { ComerCommissionsPerGoodService } from 'src/app/core/services/ms-thirdparty/comer-commissions-per-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  NUMBERS_DASH_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-commissions-modal',
  templateUrl: './commissions-modal.component.html',
  styles: [],
})
export class CommissionsModalComponent extends BasePage implements OnInit {
  title: string = 'Comisiones';
  edit: boolean = false;

  commissionsForm: ModelForm<IComerCommissionsPerGood>;
  commissions: IComerCommissionsPerGood;

  idEvent: IComerEvent2;
  idGood: IGood;

  comerComCalculated: any;
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private comerCommissionsPerGoodService: ComerCommissionsPerGoodService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.commissionsForm = this.fb.group({
      comCalculatedId: [this.comerComCalculated.comCalculatedId],
      eventId: [
        null,
        [
          Validators.pattern(NUMBERS_DASH_PATTERN),
          Validators.max(99999999999),
          Validators.required,
        ],
      ],
      goodNumber: [
        null,
        [
          Validators.pattern(NUMBERS_DASH_PATTERN),
          Validators.maxLength(99999999999),
          Validators.required,
        ],
      ],
      amountCommission: [
        null,
        [Validators.max(999999999999999999999999999), Validators.required],
      ],
      batch: [null, [Validators.max(99999999999), Validators.required]],
      cvman: [null, [Validators.pattern(STRING_PATTERN), Validators.required]],
      sale: [
        null,
        [Validators.max(999999999999999999999), Validators.required],
      ],
      comments: [null, [Validators.pattern(STRING_PATTERN)]],
      processIt: [null, [Validators.pattern(STRING_PATTERN)]],
      saleTc: [null, []],
    });
    if (this.commissions != null) {
      this.edit = true;
      this.idEvent = this.commissions.eventId as IComerEvent2;
      this.idGood = this.commissions.goodNumber as IGood;
      this.commissionsForm.patchValue(this.commissions);
      this.commissionsForm.controls['eventId'].setValue(this.idEvent.eventId);
      this.commissionsForm.controls['goodNumber'].setValue(this.idGood.goodId);
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    const body: IComerCommissionsPerGood = {
      comCalculatedId: this.comerComCalculated.comCalculatedId,
      eventId: this.commissionsForm.value.eventId,
      goodNumber: this.commissionsForm.value.goodNumber,
      amountCommission: this.commissionsForm.value.amountCommission,
      batch: this.commissionsForm.value.batch,
      cvman: this.commissionsForm.value.cvman,
      sale: this.commissionsForm.value.sale,
      comments: this.commissionsForm.value.comments,
      processIt: this.commissionsForm.value.processIt,
      saleTc: null,
    };

    this.comerCommissionsPerGoodService.create(body).subscribe({
      next: data => this.handleSuccess(),
      error: error => {
        this.alert(
          'error',
          'Ocurrió un error al guardar el registro',
          error.error.message
        );
        this.loading = false;
      },
    });
  }

  update() {
    this.loading = true;
    const body: IComerCommissionsPerGood = {
      comCalculatedId: this.comerComCalculated.comCalculatedId,
      eventId: this.commissionsForm.value.eventId,
      goodNumber: this.commissionsForm.value.goodNumber,
      amountCommission: this.commissionsForm.value.amountCommission,
      batch: this.commissionsForm.value.batch,
      cvman: this.commissionsForm.value.cvman,
      sale: this.commissionsForm.value.sale,
      comments: this.commissionsForm.value.comments,
      processIt: this.commissionsForm.value.processIt,
      saleTc: this.commissions.saleTc,
    };
    this.comerCommissionsPerGoodService.update(body).subscribe({
      next: data => this.handleSuccess(),
      error: error => {
        this.alert(
          'error',
          'Ocurrió un error al actualizar el registro',
          error.error.message
        );
        this.loading = false;
      },
    });
  }

  handleSuccess() {
    const message: string = this.edit ? 'actualizada' : 'guardada';
    this.onLoadToast('success', `Comisión ${message} correctamente`, '');
    // this.title
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
