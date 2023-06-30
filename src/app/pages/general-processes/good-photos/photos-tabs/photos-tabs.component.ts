import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-photos-tabs',
  templateUrl: './photos-tabs.component.html',
  styleUrls: ['./photos-tabs.component.scss'],
})
export class PhotosTabsComponent implements OnInit {
  @Input() goodNumber: string;
  @Input() disabled: boolean;
  constructor() {}

  ngOnInit() {}
}
