import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {SliderComponent} from './components/slider/slider.component';
import {DragAndDropDirective} from './@theme/directives/drag-and-drop.directive';

@NgModule({
  declarations: [
    AppComponent,
    SliderComponent,
    DragAndDropDirective
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
