import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import {
  FilePhotoService,
  IHistoricalPhoto,
} from 'src/app/core/services/ms-ldocuments/file-photo.service';

@Component({
  selector: 'app-photos-historic',
  templateUrl: './photos-historic.component.html',
  styleUrls: ['./photos-historic.component.scss'],
})
export class PhotosHistoricComponent implements OnInit {
  singleSlideOffset = true;
  noWrap = true;

  // slides = [
  //   {
  //     image:
  //       'https://images.kavak.services/images/202518/EXTERIOR-frontSidePilotNear-1663797326136.jpeg?d=756x434',
  //   },
  //   {
  //     image:
  //       'https://images.kavak.services/images/202518/EXTERIOR-front-1663797338664.jpeg?d=756x434',
  //   },
  //   {
  //     image:
  //       'https://images.kavak.services/images/202518/EXTERIOR-frontSideCopilot-1663797361668.jpeg?d=756x434',
  //   },
  //   {
  //     image:
  //       'https://images.kavak.services/images/202518/EXTERIOR-pilotRim-1663797207371.jpeg?d=756x434',
  //   },
  //   {
  //     image:
  //       'https://images.kavak.services/images/202518/EXTERIOR-openDoorPilot-1663797159535.jpeg?d=756x434',
  //   },
  //   {
  //     image:
  //       'https://images.kavak.services/images/202518/INTERIOR-console-1663797010209.jpeg?d=756x434',
  //   },
  //   {
  //     image:
  //       'https://images.kavak.services/images/202518/INTERIOR-openTrunk-1663797109010.jpeg?d=756x434',
  //   },
  //   {
  //     image:
  //       'https://images.kavak.services/images/202518/INTERIOR-backSeatCopilot-1663797095691.jpeg?d=756x434',
  //   },
  // ];
  files: IHistoricalPhoto[] = [];
  @Input() goodNumber: string;
  slides: { image: string; usuarioElimina: string }[] = [];
  constructor(
    // private modalRef: BsModalRef,
    private service: FilePhotoService
  ) {}

  ngOnInit() {}

  private getData() {
    this.service.getAllHistoric(this.goodNumber).subscribe({
      next: response => {
        if (response) {
          this.files = [...response];
        }
      },
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['goodNumber']) {
      this.getData();
    }
  }

  // close() {
  //   this.modalRef.hide();
  // }
}
