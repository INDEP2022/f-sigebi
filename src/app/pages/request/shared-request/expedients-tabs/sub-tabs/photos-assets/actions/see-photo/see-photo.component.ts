import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-see-photo',
  templateUrl: './see-photo.component.html',
  styleUrls: ['./see-photo.component.scss'],
})
export class SeePhotoComponent implements OnInit {
  renderValue: string;
  @Input() value: string | number;
  @Input() rowData: any = '';
  @Output() btnclick: EventEmitter<any> = new EventEmitter();
  task: any;
  statusTask: any;

  constructor() {}

  ngOnInit(): void {
    this.renderValue = this.value.toString().toUpperCase();
  }

  seeImage(): void {
    this.btnclick.emit(this.rowData);
  }
}
