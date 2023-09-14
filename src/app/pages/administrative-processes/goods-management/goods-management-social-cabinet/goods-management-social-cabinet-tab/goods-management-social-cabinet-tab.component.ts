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
  options: { value: number; label: string }[] = [];
  // @Input() selectedGoodstxt: number[];
  @Input() identifier: number;
  _process: ETypeGabinetProcess = ETypeGabinetProcess['Sin Asignar'];
  @Input()
  get process() {
    return this._process;
  }
  selectedOption: number = 0;
  set process(value) {
    this.options = [];
    this._process = value;
    this.selectedOption = value + 1;
    this.form.get('process').setValue(value + 1);
    if (value < 1) this.options.push({ value: 1, label: 'Susceptible' });
    if (value < 2) this.options.push({ value: 2, label: 'Asignado' });
    if (value < 3) this.options.push({ value: 3, label: 'Entregado' });
    if (value < 4) this.options.push({ value: 4, label: 'Liberado' });
  }
  @Input() disabledProcess = true;
  typeGabinetProcess = ETypeGabinetProcess;
  form: FormGroup = new FormGroup({});
  processErrors = 0;
  user: string;
  constructor(
    private fb: FormBuilder,
    private service: SocialCabinetService,
    private goodsManagementService: GoodsManagementService
  ) {
    super();
    this.form = this.fb.group({
      process: [null, [Validators.required]],
      excuse: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      excuse2: [null, [Validators.pattern(STRING_PATTERN)]],
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

  get pageLoading() {
    return this.goodsManagementService.pageLoading;
  }

  set pageLoading(value) {
    this.goodsManagementService.pageLoading = value;
  }

  cantByProcess(process: ETypeGabinetProcess) {
    switch (process) {
      case ETypeGabinetProcess['Sin Asignar']:
        return this.goodsManagementService.sinAsignarCant;
      case ETypeGabinetProcess.Susceptible:
        return this.goodsManagementService.susceptibleCant;
      case ETypeGabinetProcess.Liberado:
        return this.goodsManagementService.liberadoCant;
      case ETypeGabinetProcess.Entregado:
        return this.goodsManagementService.entregadoCant;
      case ETypeGabinetProcess.Asignado:
        return this.goodsManagementService.asignadoCant;
      default:
        return 0;
    }
  }

  ngOnInit() {}

  clear() {
    this.form.reset();
    // this.clearFlag++;
  }

  async processCabinetSocial() {
    // console.log(this.form.get('process').value);
    // console.log({
    //   pId: this.identifier,
    //   pTypeProcess: this.form.get('process').value,
    //   pJustify: this.form.get('excuse').value,
    //   pUser: this.user,
    //   currentProcessType: this.process,
    // });

    // return;
    this.pageLoading = true;
    this.service
      .paValidSocialCabinet({
        pId: this.identifier,
        pTypeProcess: this.form.get('process').value,
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
            this.alert('success', 'Bienes Procesados', '');
          } else {
            this.alert('error', 'Procesamiento Gabinete Social', message);
          }
        },
        error: err => {
          this.pageLoading = false;
          // this.form.get('option').setValue(null);
          this.alert(
            'error',
            'Procesamiento Gabinete Social',
            'Bienes no procesados correctamente'
          );
          // this.selectedGoodstxt = [...this.selectedGoodstxt];
          this.processErrors++;
        },
      });
  }
}
