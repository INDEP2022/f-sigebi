import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { IRequest } from '../../../../../../core/models/requests/request.model';
import { AffairService } from '../../../../../../core/services/catalogs/affair.service';

@Component({
  selector: 'app-request-record-tab',
  templateUrl: './request-record-tab.component.html',
  styles: [],
})
export class RequestRecordTabComponent extends BasePage implements OnInit {
  @Input() requestForm: ModelForm<IRequest>;
  bsReceptionValue = new Date();
  bsPaperValue: any;
  selectTypeExpedient = new DefaultSelect<any>();
  selectOriginInfo = new DefaultSelect<any>();
  affairName: string = '';
  datePaper: any;

  affairService = inject(AffairService);
  genericsService = inject(GenericService);

  constructor(public fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.getOriginInfo(new ListParams());
    this.getTypeExpedient(new ListParams());

    this.requestForm.controls['affair'].valueChanges.subscribe(val => {
      if (this.requestForm.controls['id'].value != null) {
        this.getAffair(this.requestForm.controls['affair'].value);
      }

      if (this.requestForm.controls['paperDate'].value != null) {
        let date = new Date(this.requestForm.controls['paperDate'].value);
        this.bsPaperValue = date;
        this.requestForm.controls['paperDate'].setValue(date.toISOString());
      }
    });
  }

  getTypeExpedient(params: ListParams) {
    params.text = 'Tipo Expediente';
    this.genericsService.getAll(params).subscribe((data: any) => {
      this.selectTypeExpedient = new DefaultSelect(data.data, data.count);
    });
  }

  getOriginInfo(params?: ListParams) {
    params.text = 'Procedencia';
    this.genericsService.getAll(params).subscribe((data: any) => {
      this.selectOriginInfo = new DefaultSelect(data.data, data.count);
    });
  }

  getAffair(id: number) {
    this.affairService.getById(id).subscribe((data: any) => {
      this.affairName = data.data.description;
    });
  }

  confirm() {
    this.loading = true;
    let date = new Date(this.bsPaperValue);
    this.requestForm.controls['paperDate'].setValue(date.toISOString());
    console.log(this.requestForm.getRawValue());

    /*setTimeout(() => {
      let localDate = new Date(
        this.requestForm.controls['paperDate'].value
      ).toLocaleDateString();
      this.requestForm.controls['paperDate'].setValue(localDate);
    }, 2000);*/
  }
}
