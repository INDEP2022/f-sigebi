import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { IRequest } from '../../../../../../core/models/requests/request.model';
import { AffairService } from '../../../../../../core/services/catalogs/affair.service';

@Component({
  selector: 'app-request-record-tab',
  templateUrl: './request-record-tab.component.html',
  styles: [],
})
export class RequestRecordTabComponent
  extends BasePage
  implements OnInit, OnChanges
{
  @Input() requestForm: ModelForm<IRequest>;
  receptionForm: ModelForm<IRequest>;
  bsValue = new Date();
  selectTypeExpedient = new DefaultSelect<any>();
  affairName: string = '';

  affairService = inject(AffairService);

  constructor(public fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.getCurrentDate();
    /*setTimeout(()=>{
      this.requestForm.controls['receptionDate'].patchValue(this.bsValue);
      this.requestForm.controls['paperDate'].patchValue('');
      this.requestForm.controls['receiptRoute'].value;
    },1000)*/

    this.requestForm.valueChanges.subscribe(val => {
      if (this.requestForm.controls['id'].value != null) {
        console.log(this.requestForm.getRawValue());
        this.getAffair(this.requestForm.controls['affair'].value);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.requestForm.controls['id'].value != null) {
      debugger;
    }
  }

  prepareForm(): void {
    //console.log(this.dataObject);
    let fecha = this.getCurrentDate();
    this.receptionForm = this.fb.group({
      applicationDate: [null],
      paperNumber: [null],
      regionalDelegationId: [null],
      keyStateOfRepublic: [null],
      transferenceId: [null],
      stationId: [null],
      authorityId: [null],
      typeUser: [''],
      receiUser: [''],
      id: [null],
      urgentPriority: [null],
      originInfo: [null],
      receptionDate: [null],
    });
  }

  getCurrentDate(): string {
    var today = new Date();
    var year = today.getFullYear();
    var mes = today.getMonth() + 1;
    var dia = today.getDate();
    var fecha = dia + '/' + mes + '' + year;
    return fecha;
  }

  getTypeExpedient(event: any) {}

  getAffair(id: number) {
    this.affairService.getById(id).subscribe((data: any) => {
      this.affairName = data.data.description;
    });
  }

  confirm() {
    this.loading = true;
    console.log(this.requestForm.getRawValue());
  }
}
