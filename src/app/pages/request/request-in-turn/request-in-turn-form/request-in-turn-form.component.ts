import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/ModelForm';
import { IRequestInTurn } from 'src/app/core/models/catalogs/request-in-turn.model';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-request-in-turn-form',
  templateUrl: './request-in-turn-form.component.html',
  styles: [
  ]
})
export class RequestInTurnFormComponent implements OnInit {
  @Output() sendSearchForm = new EventEmitter<ModelForm<IRequestInTurn>>();

  edit: boolean = false;
  title:string = 'SOliCITUD A TURNO';
  requestForm: ModelForm<IRequestInTurn>;
  requestInTurn: IRequestInTurn;

  loading:boolean = false

  selectTransmitter = new DefaultSelect<IRequestInTurn>;
  selectAuthority = new DefaultSelect<IRequestInTurn>;
  selectDeleRegional = new DefaultSelect<IRequestInTurn>;
  selectState = new DefaultSelect<IRequestInTurn>;
  selectSubject = new DefaultSelect<IRequestInTurn>;
  selectTransfer = new DefaultSelect<IRequestInTurn>;

  constructor(
    public modalRef: BsModalRef,
    public fb: FormBuilder,
    //public requestService: ResquestService
  ) { }

  ngOnInit(): void {
    this.initialForm();
  }

  initialForm():void {
    this.requestForm = this.fb.group({
      check: [null,],
      noRequest: [null],
      dateRequest: [null],
      titularName: [null],
      senderCharger: [null],
      noJob: [null],
      dateJob: [null],
      deleRegional: [null],
      state: [null],
      transfer: [null],
      transmitter: [null],
      authority: [null],
      expedient: [null],
      reception: [null],
      subject: [null],
      type: [null],
      appliStatus: [null],
      contributor: [null],
      acta: [null],
      ascertainment: [null], 
      cause: [null],
      typeMach: ['te'],
    });
    if (this.requestInTurn != null) {
      this.edit = true;
      this.requestForm.patchValue(this.requestForm);
    }
  }

getSubDelegations(params: ListParams) {
    /* this.requestService.getAll(params).subscribe(data => {
      this.station = new DefaultSelect(data.data, data.count);
    }); */
  }
  
  search():void{
    /* console.log(this.requestForm.getRawValue());
    console.log(this.selectTransmitter); */
    this.sendSearchForm.emit(this.requestForm);
  }

  reset():void{
    this.requestForm.reset();
  }

}
