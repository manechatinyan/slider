import {Observable} from 'rxjs';
import {Component} from '@angular/core';

import {IImagesData} from './@core/interfaces/IImage';
import {ImagesService} from './@core/services/images.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public imagesData: Observable<IImagesData> = this.imagesService.getImages();

  constructor(private imagesService: ImagesService) {}
}
