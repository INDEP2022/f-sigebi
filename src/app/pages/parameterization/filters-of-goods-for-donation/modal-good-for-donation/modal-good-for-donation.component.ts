import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IFilterDonation } from 'src/app/core/models/ms-donation/donation.model';
import { DonationService } from 'src/app/core/services/ms-donationgood/donation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-modal-good-for-donation',
  templateUrl: './modal-good-for-donation.component.html',
  styles: [],
})
export class ModalGoodForDonationComponent extends BasePage implements OnInit {
  title: string = '';
  edit: boolean = false;
  form: FormGroup = new FormGroup({});
  allotment: any;
  @Output() refresh = new EventEmitter<true>();
  id: string = '';

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private donationServ: DonationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      goodStatus: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      targetIndicator: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
    if (this.allotment != null) {
      this.edit = true;
      this.form.controls['goodStatus'].patchValue(this.allotment.statusId);
      this.form.controls['targetIndicator'].patchValue(this.allotment.tagId);
      this.id = this.form.controls['goodStatus'].value;
    }
  }

  createDonation() {
    if (this.form.valid) {
      const donation: IFilterDonation = {} as IFilterDonation;
      donation.statusId = this.form.controls['goodStatus'].value;
      donation.noLabel = Number(this.form.controls['targetIndicator'].value);
      if (this.edit) {
        this.donationServ.updateDonation(donation, this.id).subscribe({
          next: () => {
            this.handleSuccess();
          },
          error: err => {
            this.loading = false;
            this.onLoadToast('error', err.error.message, '');
          },
        });
      } else {
        this.donationServ.createDonation(donation).subscribe({
          next: () => {
            this.handleSuccess();
          },
          error: err => {
            this.loading = false;
            this.onLoadToast('error', err.error.message, '');
          },
        });
      }
    }
  }

  handleSuccess() {
    this.loading = false;
    this.onLoadToast(
      'success',
      'Bien donación',
      `Ha sido ${this.edit ? 'actualizado' : 'creado'} correctamente`
    );
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  close() {
    this.modalRef.hide();
  }
}
