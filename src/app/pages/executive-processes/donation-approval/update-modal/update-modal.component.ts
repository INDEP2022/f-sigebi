import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IHistoryGood } from 'src/app/core/models/administrative-processes/history-good.model';
import { IGood } from 'src/app/core/models/ms-good/good';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DonationService } from 'src/app/core/services/ms-donationgood/donation.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

interface IAdmonDonationGood {
  goodId: string | number;
  description?: string;
  quantity?: string | number;
  delAdmon?: string;
  delReceive?: string;
  desType?: string;
  desSubType?: string;
  desSsubType?: string;
  desSssubType?: string;
  noStorage?: string;
  noFile?: string;
  status?: string;
}

@Component({
  selector: 'app-update-modal',
  templateUrl: './update-modal.component.html',
  styles: [],
})
export class UpdateModalComponent extends BasePage implements OnInit {
  good: any;
  form: FormGroup;
  title: string = 'Aprobación de Bienes para Donación';
  get authUser() {
    return this.authService.decodeToken().username;
  }
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private goodService: GoodService,
    private goodprocessService: GoodProcessService,
    private historygoodService: HistoryGoodService,
    private authService: AuthService,
    private donationgoodService: DonationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.form.patchValue(this.good);
    this.form.disable();
    this.form.get('extDomProcess').reset();
    this.form.get('status').reset();
    this.form.get('status').enable();
    this.form.get('extDomProcess').enable();
  }

  prepareForm() {
    this.form = this.fb.group({
      id: [null, [Validators.required, Validators.maxLength(10)]],
      description: [
        null,
        [Validators.maxLength(1000), Validators.pattern(STRING_PATTERN)],
      ],
      di_cve_ubicacion: [null, [Validators.maxLength(1000)]],
      di_ubicacion1: [null],
      status: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      extDomProcess: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  close() {
    this.modalRef.hide();
  }

  handleSuccess() {
    const message: string = 'Actualizada';
    this.alert('success', this.title, `${message} Correctamente`);
    //this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  confirm() {
    this.preUpdate();
    this.update();
  }

  update() {
    this.loading = true;
    const good: IGood = {};
    good.id = this.form.get('id').value;
    good.goodId = this.form.get('id').value;
    good.extDomProcess = this.form.get('extDomProcess').value;
    good.status = this.form.get('status').value;
    this.goodService.update(good).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  async preUpdate() {
    const data: any[] = await this.getStatusFinal(
      this.form.get('status').value
    );
    if (data.length > 0) {
      data.forEach(element => {
        this.insertHistoryStatus(
          this.good,
          element.sestatus_final,
          this.authUser,
          element.proceso_ext_dom
        );
      });
      //const data2: any[] = await this.getData();
      /* if (data2.length > 0) {
        data2.forEach(element => {
          
        })
      } */
      const model: IAdmonDonationGood = {
        goodId: this.good.goodId,
      };
      this.createAdmonDonation(model);
    }
  }

  createAdmonDonation(model: IAdmonDonationGood) {
    return new Promise<any[]>((resolve, reject) => {
      this.donationgoodService.createAdmonDonation(model).subscribe({
        next: data => {
          console.log(data.data);
          resolve(data.data);
        },
        error: error => {
          resolve([]);
        },
      });
    });
  }

  getData() {
    return new Promise<any[]>((resolve, reject) => {
      const params: ListParams = {};
      this.goodprocessService.getData(params).subscribe({
        next: data => {
          console.log(data.data);
          resolve(data.data);
        },
        error: error => {
          resolve([]);
        },
      });
    });
  }

  insertHistoryStatus(
    good: IGood,
    statusFinal: string,
    usuario: string,
    extDomProcess: string
  ) {
    const model: IHistoryGood = {
      changeDate: this.getCurrentDate(),
      userChange: usuario,
      propertyNum: good.id,
      reasonForChange: 'Automatico',
      status: statusFinal,
      statusChangeProgram: 'FACTDESAPROBDONAC',
      extDomProcess,
    };
    this.historygoodService.create(model).subscribe({
      next: (response: any) => {
        console.log(response.data);
      },
      error: error => {
        console.log(error);
      },
    });
  }

  getCurrentDate(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getStatusFinal(status: string) {
    return new Promise<any[]>((resolve, reject) => {
      const model = {
        status,
        vcScreen: 'FACTDESAPROBDONAC',
      };
      this.goodprocessService.getStatusProcess(model).subscribe({
        next: data => {
          resolve(data.data);
        },
        error: error => {
          resolve([]);
        },
      });
    });
  }
}
