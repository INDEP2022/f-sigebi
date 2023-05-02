import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from '../../../../core/interfaces/model-form';

var data = [
  {
    id: '5a15b13c36e7a7f00cf0d7cb',
    index: 2,
    isActive: true,
    picture: 'http://placehold.it/32x32',
    age: 23,
    name: 'Karyn Wright',
    gender: 'female',
    company: 'ZOLAR',
    email: 'karynwright@zolar.com',
    phone: '+1 (851) 583-2547',
  },
  {
    id: '5a15b13c2340978ec3d2c0ea',
    index: 3,
    isActive: true,
    picture: 'http://placehold.it/32x32',
    age: 35,
    name: 'Rochelle Estes',
    disabled: false,
    gender: 'female',
    company: 'EXTRAWEAR',
    email: 'rochelleestes@extrawear.com',
    phone: '+1 (849) 408-2029',
  },
  {
    id: '5a15b13c663ea0af9ad0dae8',
    index: 4,
    isActive: false,
    picture: 'http://placehold.it/32x32',
    age: 25,
    name: 'Mendoza Ruiz',
    gender: 'male',
    company: 'ZYTRAX',
    email: 'mendozaruiz@zytrax.com',
    phone: '+1 (904) 536-2020',
  },
];

@Component({
  selector: 'app-programming-delivery',
  templateUrl: './programming-delivery.component.html',
  styleUrls: ['./programming-delivery.component.scss'],
})
export class ProgrammingDeliveryComponent implements OnInit {
  information: any;
  programmingForm: ModelForm<any>;

  bsValue = new Date();
  minDate: Date;
  maxDate: Date;

  //
  participants: any[] = []; //people$: Observable<any[]> -> item tiene que ser async;
  selectedparticipants: any[] = [];

  constructor(private fb: FormBuilder, private bsModalRef: BsModalRef) {
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate() + 5);
    this.bsValue = this.minDate;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.programmingForm = this.fb.group({
      destiny: [{ value: 'Bienes para estudio', disabled: true }],
      operationDayStart: [null],
      operationDayEnd: [null],
      participants: [null],
    });

    this.programmingForm.controls['operationDayStart'].patchValue(this.bsValue);
    this.participants = data;
  }

  clearModel() {
    this.selectedparticipants = [];
  }

  close(): void {
    this.bsModalRef.hide();
  }

  program(): void {
    //verificar que la fecha inicial no sea mayor a la fecha final
    console.log(this.programmingForm.getRawValue());
    console.log(this.programmingForm.value);
  }
}
