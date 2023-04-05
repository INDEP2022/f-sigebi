import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IRequest } from 'src/app/core/models/requests/request.model';
import { AffairService } from 'src/app/core/services/catalogs/affair.service';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { PHONE_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-request-detail-tab',
  templateUrl: './request-detail-tab.component.html',
  styleUrls: ['./request-detail-tab.component.scss'],
})
export class RequestDetailTabComponent
  extends BasePage
  implements OnInit, OnChanges
{
  @Input() typeDoc = '';
  //datos pasados del padre
  @Input() requestForm: ModelForm<any>;
  @Input() process: string = '';
  public receptionForm: ModelForm<IRequest>;
  selectTypeExpedient = new DefaultSelect<IRequest>();
  priority: any = null;
  idRequest: number = 0;
  infoRequest: IRequest;
  affairName: string = '';
  ofiginName: string = '';
  selectOriginInfo = new DefaultSelect();

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private requestService: RequestService,
    private affairService: AffairService,
    private genericsService: GenericService
  ) {
    super();
    this.idRequest = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.reactiveFormCalls();
    this.showDataProg();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  prepareForm(): void {
    this.receptionForm = this.fb.group({
      priority: [null],
      infoProvenance: [null],
      receptDate: [null],
      officeDate: [null, Validators.required],
      typeExpedient: [null],
      nameSender: [null],
      senderCharge: [null],
      phoneSender: [
        null,
        [Validators.pattern(PHONE_PATTERN), Validators.maxLength(13)],
      ],
      emailSender: [null],
      publicMinister: [null],
      tribunal: [null],
      crime: [null],
      typeReception: [null], //esta campo depende de que tipo de recepcion es el formulario
      destinationManage: [null],
      contributor: [null],
      subject: [null],
      transExpedient: [null],
      typeTransfer: [null],
      transferEntityNotes: [null],
      observations: [null],
    });
  }

  showDataProg() {
    this.requestService.getById(this.idRequest).subscribe((data: any) => {
      this.infoRequest = data;
    });
  }

  getTypeExpedient(event: any) {}

  confirm() {
    this.loading = true;
  }

  getAffair(id: number) {
    this.affairService.getById(id).subscribe({
      next: data => {
        this.affairName = data.description;
      },
      error: error => {
        this.affairName = '';
        console.log(error.error.massage);
      },
    });
  }

  getOriginInfo(params: ListParams, id: number) {
    params['filter.name'] = '$eq:Procedencia';
    params['filter.keyId'] = `$eq:${id}`;
    params.limit = 20;
    this.genericsService.getAll(params).subscribe({
      next: resp => {
        this.ofiginName = resp.data[0].description;
      },
    });
  }

  reactiveFormCalls() {
    this.requestForm.valueChanges.subscribe((val: any) => {
      var v = this.requestForm.getRawValue();

      if (this.requestForm.controls['urgentPriority'].value) {
        this.priority =
          this.requestForm.controls['urgentPriority'].value === '0'
            ? false
            : true;
      }

      if (this.requestForm.controls['affair'].value) {
        const affair = Number(this.requestForm.controls['affair'].value);
        this.getAffair(affair);
      }

      if (this.requestForm.controls['originInfo'].value) {
        const originId = Number(this.requestForm.controls['originInfo'].value);
        this.getOriginInfo(new ListParams(), originId);
      }
    });
  }
}
