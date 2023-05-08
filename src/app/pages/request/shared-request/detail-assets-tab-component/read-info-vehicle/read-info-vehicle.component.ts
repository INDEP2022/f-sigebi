import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-read-info-vehicle',
  templateUrl: './read-info-vehicle.component.html',
  styleUrls: ['./read-info-vehicle.component.scss'],
})
export class ReadInfoVehicleComponent implements OnInit {
  @Input() vehicleObject: any;
  fitCircular: string;
  theftReport: string;
  armor: string;

  constructor() {}

  ngOnInit(): void {
    console.log(this.vehicleObject);
    this.setFitCircular();
    this.setTheftReport();
    this.setArmor();
  }

  setFitCircular() {
    if (this.vehicleObject.fitCircular != null) {
      this.fitCircular = this.vehicleObject.fitCircular === 'N' ? 'No' : 'Si';
    } else {
      this.fitCircular = 'No';
    }
  }

  setTheftReport() {
    if (this.vehicleObject.theftReport != null) {
      this.theftReport = this.vehicleObject.theftReport === 'N' ? 'No' : 'Si';
    } else {
      this.theftReport = 'No';
    }
  }

  setArmor() {
    if (this.vehicleObject.armor != null) {
      this.armor = this.vehicleObject.armor === 'N' ? 'No' : 'Si';
    } else {
      this.armor = 'No';
    }
  }
}
