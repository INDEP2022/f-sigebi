import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { SocialCabinetService } from 'src/app/core/services/ms-social-cabinet/social-cabinet.service';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { GoodsManagementService } from '../../services/goods-management.service';
import { ETypeGabinetProcess } from '../typeProcess';

@Component({
  selector: 'app-goods-management-social-cabinet-tab',
  templateUrl: './goods-management-social-cabinet-tab.component.html',
  styleUrls: ['./goods-management-social-cabinet-tab.component.scss'],
})
export class GoodsManagementSocialCabinetTabComponent
  extends BasePage
  implements OnInit
{
  // @Input() selectedGoodstxt: number[];
  @Input() override loading: boolean = false;
  @Input() identifier: number;
  @Input() process: ETypeGabinetProcess = ETypeGabinetProcess['Sin Asignar'];
  @Input() disabledProcess = true;
  typeGabinetProcess = ETypeGabinetProcess;
  form: FormGroup = new FormGroup({});
  processErrors = 0;
  pageLoading = false;
  user: string;
  constructor(
    private fb: FormBuilder,
    private service: SocialCabinetService,
    private goodsManagementService: GoodsManagementService
  ) {
    super();
    this.form = this.fb.group({
      // option: [null, [Validators.required]],
      excuse: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    });
    this.user = localStorage.getItem('username').toUpperCase();
    this.goodsManagementService.clear
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          if (response) {
            this.form.reset();
          }
        },
      });
  }

  // get option() {
  //   return this.form
  //     ? this.form.get('option')
  //       ? this.form.get('option').value
  //       : null
  //     : null;
  // }

  ngOnInit() {}

  clear() {
    this.form.reset();
    // this.clearFlag++;
  }

  async processCabinetSocial() {
    this.pageLoading = true;
    this.service
      .paValidSocialCabinet({
        pId: this.identifier,
        pTypeProcess: this.process + 1,
        pJustify: this.form.get('excuse').value,
        pUser: this.user,
        currentProcessType: this.process,
      })
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          console.log(response);
          this.processErrors++;
          // this.disabledProcess = true;
          // this.selectedGoodstxt = [...this.selectedGoodstxt];
          this.goodsManagementService.refreshData.next(true);
          const message = response.message ? response.message[0] ?? '' : '';
          this.pageLoading = false;
          // this.form.get('option').setValue(null);
          // this.form.get('option').setValue(null);
          // if (response.dataErrors.length > 0) {
          //   this.alert(
          //     'error',
          //     'Procesamiento Gabinete Social',
          //     response.dataErrors[0]
          //   );
          // } else {
          //   this.alert(
          //     'success',
          //     'Procesamiento Gabinete Social',
          //     'Bienes procesados'
          //   );
          // }
          if (
            message.includes('correctamente') ||
            message.includes('procesado')
          ) {
            this.alert(
              'success',
              'Procesamiento Gabinete Social',
              'Bienes procesados'
            );
          } else {
            this.alert('error', 'Procesamiento Gabinete Social', message);
          }
        },
        error: err => {
          this.pageLoading = false;
          this.form.get('option').setValue(null);
          this.alert('error', 'ERROR', 'Bienes no procesados correctamente');
          // this.selectedGoodstxt = [...this.selectedGoodstxt];
          this.processErrors++;
        },
      });
  }
}
