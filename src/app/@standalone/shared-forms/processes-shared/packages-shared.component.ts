import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
//Rxjs
//Params
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Services
//import { MeasurementUnitsService } from 'src/app/core/services/catalogs/measurement-units.service';
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { IPackage } from 'src/app/core/models/catalogs/package.model';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';

@Component({
  selector: 'app-processes-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './processes-shared.component.html',
  styles: [],
})
export class ProcessesSharedComponent extends BasePage implements OnInit {
  @Input() form: FormGroup;
  @Input() packageField: string = 'processes';
  @Input() label: string = 'Processes';
  @Input() showPackages: boolean = true;
  @Input() idGood: string | number = '';
  @Input() process: string = '';

  processes = new DefaultSelect<IPackage>();

  get measurementUnit() {
    return this.form.get(this.packageField);
  }

  constructor(private readonly historyGoodService: HistoryGoodService) {
    super();
  }

  ngOnInit(): void {}

  getProcesses(params: ListParams) {
    this.historyGoodService
      .getByGoodAndProcess(this.idGood, this.process)
      .subscribe({
        next: response => {
          this.processes = new DefaultSelect(
            this.distinct(response.data, 'extDomProcess'),
            response.count
          );
        },
        error: error => {
          this.loading = false;
        },
      });
  }

  distinct(data: any[], indice: string) {
    let uniques: any[] = []; //temporal
    return data.filter(item => {
      return uniques.indexOf(item[indice]) < 0
        ? uniques.push(item[indice])
        : false;
    });
  }
  onPackagesChange(type: any) {
    this.form.updateValueAndValidity();
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      field = null;
    });
    this.form.updateValueAndValidity();
  }
}
