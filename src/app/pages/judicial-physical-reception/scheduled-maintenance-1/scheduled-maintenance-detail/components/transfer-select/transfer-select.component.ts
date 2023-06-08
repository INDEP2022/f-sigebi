import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DefaultEditor } from 'ng2-smart-table';
import { lastValueFrom, map } from 'rxjs';
import { DynamicCatalogService } from 'src/app/core/services/dynamic-catalogs/dynamic-catalogs.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { KeyProceedingsService } from 'src/app/pages/judicial-physical-reception/key-proceedings-form/key-proceedings.service';

@Component({
  selector: 'app-transfer-select',
  templateUrl: './transfer-select.component.html',
  styleUrls: ['./transfer-select.component.css'],
})
export class TransferSelectComponent extends DefaultEditor implements OnInit {
  form: FormGroup = new FormGroup({});
  constructor(
    private fb: FormBuilder,
    private expedientService: ExpedientService,
    private dynamicCatalogService: DynamicCatalogService,
    private keyProceedingsService: KeyProceedingsService
  ) {
    super();
  }

  get detail() {
    return this.keyProceedingsService.detail;
  }

  get transfers() {
    return this.keyProceedingsService.transfers;
  }

  set transfers(value) {
    this.keyProceedingsService.transfers = value;
  }

  ngOnInit() {
    this.form = this.fb.group({
      transfer: [null],
    });
    if (this.cell.newValue !== '') {
      this.form.controls['transfer'].setValue(this.cell.newValue);
    }
  }

  private async getExpedientById(id: string | number) {
    return await lastValueFrom(
      this.expedientService
        .getById(id)
        .pipe(map(expedient => expedient.identifier))
    );
  }

  private async getTransferType(expedientId: string | number) {
    return await lastValueFrom(
      this.dynamicCatalogService.getIncapAndClave(expedientId).pipe(
        map(res => {
          return { type: res.data[0].coaelesce, key: res.data[0].clave };
        })
      )
    );
  }

  private async getTTrans(expedientId: string | number) {
    return await lastValueFrom(
      this.dynamicCatalogService
        .getDescEmisora(expedientId)
        .pipe(map(res => res.data[0].desc_emisora))
    );
  }

  private async getTAseg(expedientId: string | number) {
    return await lastValueFrom(
      this.dynamicCatalogService
        .getClaveCTransparente(expedientId)
        .pipe(map(res => res.data[0].clave))
    );
  }

  async transferClick() {
    console.log('Transfer click');

    const firstDetail = this.detail;
    // const { transference, type } = this.registerControls;
    if (!firstDetail) {
      return;
    }

    if (!firstDetail.no_expediente) {
      // transference.reset();
      return;
    }
    const { no_expediente } = firstDetail;
    const identifier = await this.getExpedientById(no_expediente);

    if (identifier == 'TRANS') {
      const { type, key } = await this.getTransferType(no_expediente);
      if (type == 'E') {
        const tTrans = await this.getTTrans(no_expediente);
        this.form.controls['transfer'].setValue(tTrans);
      } else {
        this.form.controls['transfer'].setValue(key);
        // transference.setValue(key);
      }
    } else {
      const tAseg = await this.getTAseg(no_expediente);
      this.form.controls['transfer'].setValue(tAseg);
      // this.row[2] = tAseg;
    }

    const transferent = this.form.controls['transfer'].value;
    this.transfers = [{ value: transferent, label: transferent }];
    // this.settingKeysProceedings = {
    //   ...this.settingKeysProceedings,
    //   columns: {
    //     ...this.settingKeysProceedings.columns,
    //     2: {
    //       ...this.settingKeysProceedings.columns[2],
    //       editor: {
    //         type: 'list',
    //         config: { selectText: 'Select', list: this.transfers },
    //       },
    //     },
    //   },
    // };
    if (transferent == 'PGR' || transferent == 'PJF') {
      this.keyProceedingsService.changeType.next('A');
    } else {
      this.keyProceedingsService.changeType.next('RT');
    }
    this.updateData();

    // await this.generateCve();
  }

  updateData() {
    this.cell.newValue = this.form.controls['transfer'].value;
  }
}
