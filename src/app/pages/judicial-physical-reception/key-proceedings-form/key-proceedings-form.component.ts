import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { SharedModule } from 'src/app/shared/shared.module';
import { settingKeysProceedings } from '../scheduled-maintenance-1/scheduled-maintenance-detail/const';

@Component({
  selector: 'app-key-proceedings-form',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './key-proceedings-form.component.html',
  styles: [],
})
export class KeyProceedingsFormComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() formField = 'claveActa';
  @Input() set statusActaValue(value: string) {
    this.updateSettingsKeysProceedings(value);
  }
  source: LocalDataSource;
  settingKeysProceedings = settingKeysProceedings;
  constructor() {}

  ngOnInit(): void {
    // this.updateSettingsKeysProceedings();
  }

  get claveActa() {
    return this.form
      ? this.form.get(this.formField)
        ? this.form.get(this.formField).value
        : ''
      : '';
  }

  updateKeysProcedding(event: any) {
    console.log(event);
    let { newData, confirm } = event;
    confirm.resolve(newData);
    this.form
      .get(this.formField)
      .setValue(
        newData[0] +
          '/' +
          newData[1] +
          '/' +
          newData[2] +
          '/' +
          newData[3] +
          '/' +
          newData[4] +
          '/' +
          newData[5] +
          '/' +
          newData[6] +
          '/' +
          newData[7]
      );
  }

  private updateTableKeysProceedings(keysProceedings: string) {
    let keys = [];
    let key = {};
    keysProceedings.split('/').forEach((letra, index) => {
      key = { ...key, [index]: letra };
    });
    keys.push(key);
    this.source = new LocalDataSource(keys);
  }

  private updateSettingsKeysProceedings(value: string) {
    this.settingKeysProceedings = {
      ...this.settingKeysProceedings,
      actions: {
        ...this.settingKeysProceedings.actions,
        edit: value !== 'CERRADA',
      },
    };
    this.updateTableKeysProceedings(this.claveActa);
  }
}
