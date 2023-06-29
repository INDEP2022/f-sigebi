import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-photos-historic',
  templateUrl: './photos-historic.component.html',
  styleUrls: ['./photos-historic.component.scss'],
})
export class PhotosHistoricComponent implements OnInit {
  mainUrl: string =
    'https://media.istockphoto.com/vectors/image-preview-icon-picture-placeholder-for-website-or-uiux-design-vector-id1222357475?k=20&m=1222357475&s=612x612&w=0&h=jPhUdbj_7nWHUp0dsKRf4DMGaHiC16kg_FSjRRGoZEI=';
  itemsPerSlide = 4;
  singleSlideOffset = true;
  noWrap = true;

  slides = [
    {
      image:
        'https://images.kavak.services/images/202518/EXTERIOR-frontSidePilotNear-1663797326136.jpeg?d=756x434',
    },
    {
      image:
        'https://images.kavak.services/images/202518/EXTERIOR-front-1663797338664.jpeg?d=756x434',
    },
    {
      image:
        'https://images.kavak.services/images/202518/EXTERIOR-frontSideCopilot-1663797361668.jpeg?d=756x434',
    },
    {
      image:
        'https://images.kavak.services/images/202518/EXTERIOR-pilotRim-1663797207371.jpeg?d=756x434',
    },
    {
      image:
        'https://images.kavak.services/images/202518/EXTERIOR-openDoorPilot-1663797159535.jpeg?d=756x434',
    },
    {
      image:
        'https://images.kavak.services/images/202518/INTERIOR-console-1663797010209.jpeg?d=756x434',
    },
    {
      image:
        'https://images.kavak.services/images/202518/INTERIOR-openTrunk-1663797109010.jpeg?d=756x434',
    },
    {
      image:
        'https://images.kavak.services/images/202518/INTERIOR-backSeatCopilot-1663797095691.jpeg?d=756x434',
    },
  ];
  constructor(private modalRef: BsModalRef) {}

  ngOnInit() {}

  close() {
    this.modalRef.hide();
  }
}
