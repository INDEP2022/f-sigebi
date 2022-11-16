import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-msg-rsb-c-register-request-goods',
  templateUrl: './msg-rsb-c-register-request-goods.component.html',
  styleUrls: ['./msg-rsb-c-register-request-goods.component.scss'],
})
export class MsgRsbCRegisterRequestGoodsComponent implements OnInit {
  /** INPUT VARIABLES */
  @Input() nombrePantalla: string = 'sinNombre';
  @Input() idParam: number = null;

  /** OUTPUT VARIABLES */
  @Output() formValuesDataDocumentation = new EventEmitter<any>();

  /** OTHERS VARIABLES */
  requestNumb: number;
  registRequestForm: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getPathParameter();
    this.prepareForm();
  }

  getPathParameter() {
    if (this.idParam) {
      this.requestNumb = this.idParam;
    } else {
      this.activatedRoute.paramMap.subscribe(params => {
        this.requestNumb = parseInt(params.get('id'));
      });
    }
  }

  prepareForm() {
    this.registRequestForm = this.fb.group({
      date: [],
      noOfi: ['400-10-00-01*00*2020-7824'],
      regDelega: ['BAJA CALIFORNIA'],
      noExpedient: ['24355'],
      noRequest: ['27445'],
      state: ['Juan Pablo'],
      tranfe: ['SAT FISCO FEDERAL'],
      transmitter: ['ADMINISTRACION GENERAL DE RECAUDACION'],
      authority: [
        'ADMINISTRACION DESCONCENTRADA DE RECAUDACION DE BAJA CALIFORNIA',
      ],
    });
  }
  dataRegistration(data: any) {
    console.log(data);
    this.formValuesDataDocumentation.emit(data);
  }
}
