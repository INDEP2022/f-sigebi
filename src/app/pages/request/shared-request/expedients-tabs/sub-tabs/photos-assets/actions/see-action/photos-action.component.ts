import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-photos-action',
  templateUrl: './photos-action.component.html',
  styleUrls: ['./photos-action.component.scss'],
})
export class PhotosActionComponent implements OnInit {
  renderValue: string;
  @Input() value: string | number;
  @Input() rowData: any = '';
  @Output() btn1click: EventEmitter<any> = new EventEmitter();
  @Output() btn2click: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {
    this.renderValue = this.value.toString().toUpperCase();
  }

  onActionSeeBtn() {
    this.btn1click.emit(this.rowData);
  }

  onActionUploadBtn() {
    this.btn2click.emit(this.rowData);
  }
}
