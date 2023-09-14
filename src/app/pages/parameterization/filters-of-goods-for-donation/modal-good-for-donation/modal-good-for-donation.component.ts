import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ILabelOKey } from 'src/app/core/models/catalogs/label-okey.model';
import { IFilterDonation } from 'src/app/core/models/ms-donation/donation.model';
import { IStatusGood } from 'src/app/core/models/ms-good/status-good';
import { LabelGoodService } from 'src/app/core/services/catalogs/label-good.service';
import { DonationService } from 'src/app/core/services/ms-donationgood/donation.service';
import { StatusGoodService } from 'src/app/core/services/ms-good/status-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-modal-good-for-donation',
  templateUrl: './modal-good-for-donation.component.html',
  styles: [],
})
export class ModalGoodForDonationComponent extends BasePage implements OnInit {
  title: string = 'Filtro de Bienes para Donación';
  edit: boolean = false;
  form: FormGroup = new FormGroup({});
  allotment: any;
  @Output() refresh = new EventEmitter<true>();
  id: string = '';
  statusSelect = new DefaultSelect<IStatusGood>();
  labelSelect = new DefaultSelect<ILabelOKey>();

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private donationServ: DonationService,
    private statusGoodService: StatusGoodService,
    private labelGoodService: LabelGoodService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      goodStatus: [null, [Validators.required]],
      targetIndicator: [null, [Validators.required]],
    });
    if (this.allotment != null) {
      console.log(this.allotment);

      this.edit = true;
      let goodStatus: IStatusGood = this.allotment.status as IStatusGood;
      let tag: ILabelOKey = this.allotment.tag as ILabelOKey;

      console.log(this.allotment.noLabel);
      this.form.patchValue({
        goodStatus: goodStatus.status,
        targetIndicator: tag.id,
      });

      this.id = this.allotment.statusId;

      this.statusSelect = new DefaultSelect([goodStatus], 1);
      this.labelSelect = new DefaultSelect([tag], 1);
      this.form.get('goodStatus').disable();
      //this.form.get('targetIndicator').disable();

      /*this.form.controls['goodStatus'].patchValue(this.allotment.statusId);
      this.form.controls['targetIndicator'].patchValue(this.allotment.tagId);
      this.id = this.form.controls['goodStatus'].value;*/
    }
    setTimeout(() => {
      this.getStatus(new ListParams());
      this.getLabel(new ListParams());
    }, 1000);
  }

  getStatus(params: ListParams) {
    this.statusGoodService.getAll(params).subscribe({
      next: data => {
        this.statusSelect = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        console.log(error);
        this.statusSelect = new DefaultSelect();
        this.loading = false;
      },
    });
  }

  getLabel(params: ListParams) {
    this.labelGoodService.getEtiqXClasif(params).subscribe({
      next: data => {
        this.labelSelect = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        console.log(error);
        this.labelSelect = new DefaultSelect();
        this.loading = false;
      },
    });
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
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', this.title, `${message} Correctamente`);
    //this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  close() {
    this.modalRef.hide();
  }
}
