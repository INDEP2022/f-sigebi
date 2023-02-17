import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
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
  priority: boolean = false;

  constructor(
    public fb: FormBuilder,
    private affairService: AffairService,
    private genericsService: GenericService,
    private requestService: RequestService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getOriginInfo(new ListParams());
    this.getTypeExpedient(new ListParams());

    this.requestForm.controls['affair'].valueChanges.subscribe(val => {
      if (this.requestForm.controls['id'].value != null) {
        this.getAffair(this.requestForm.controls['affair'].value);
      }
      if (this.requestForm.controls['urgentPriority'].value) {
        this.priority =
          this.requestForm.controls['urgentPriority'].value === '0'
            ? false
            : true;
        this.requestForm.controls['urgentPriority'].setValue(this.priority);
      }

      if (this.requestForm.controls['paperDate'].value != null) {
        let date = new Date(this.requestForm.controls['paperDate'].value);
        this.bsPaperValue = date;
        this.requestForm.controls['paperDate'].setValue(date.toISOString());
      }
    });
  }

  getTypeExpedient(params: ListParams) {
    params['filter.name'] = '$eq:Tipo Expediente';
    params.limit = 20;
    this.genericsService.getAll(params).subscribe((data: any) => {
      this.selectTypeExpedient = new DefaultSelect(data.data, data.count);
    });
  }

  getOriginInfo(params?: ListParams) {
    params['filter.name'] = '$eq:Procedencia';
    params.limit = 20;
    this.genericsService.getAll(params).subscribe((data: any) => {
      this.selectOriginInfo = new DefaultSelect(data.data, data.count);
    });
  }

  getAffair(id: number) {
    this.affairService.getById(id).subscribe((data: any) => {
      this.affairName = data.description;
    });
  }

  changeDateEvent(event: Date) {
    this.bsPaperValue =
      this.bsPaperValue !== undefined ? this.bsPaperValue : event;

    if (this.bsPaperValue != undefined) {
      let date = new Date(this.bsPaperValue);
      this.requestForm.controls['paperDate'].setValue(date.toISOString());
    }
  }

  changePriority(event: any) {
    if (event.currentTarget.checked) {
      let checked = event.currentTarget.checked;
      let value = checked === true ? '1' : '0';
      this.requestForm.controls['urgentPriority'].setValue(value);
    }
  }

  confirm() {
    this.loading = true;
    console.log(this.requestForm.getRawValue());

    const request = this.requestForm.getRawValue() as IRequest;
    this.requestService.update(request.id, request).subscribe({
      next: (resp: any) => {
        if (resp.id != null) {
          this.message(
            'success',
            'Guardado',
            'Se guardo la solicitud correctamente'
          );
        }
        if (resp.statusCode != null) {
          this.message('error', 'Error', 'No se guardo la solicitud!');
        }

        this.loading = false;
      },
      error: error => {
        console.log(error);
      },
    });
  }

  message(header: any, title: string, body: string) {
    this.onLoadToast(header, title, body);
  }
}
