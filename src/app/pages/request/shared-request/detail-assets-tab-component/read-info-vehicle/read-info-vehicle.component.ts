import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-read-info-vehicle',
  templateUrl: './read-info-vehicle.component.html',
  styleUrls: ['./read-info-vehicle.component.scss'],
})
export class ReadInfoVehicleComponent implements OnInit {
  @Input() vehicleObject: any;
  constructor() {}

  ngOnInit(): void {
    console.log(this.vehicleObject);
  }
}
