import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {IImagesData} from '../interfaces/IImage';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  private path: string = './assets/data/images.json';

  constructor(private http: HttpClient) {}

  public getImages(): Observable<IImagesData> {
    return this.http.get<IImagesData>(this.path);
  }
}
