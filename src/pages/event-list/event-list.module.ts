import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventListPage } from './event-list';

@NgModule({
  imports: [
    IonicPageModule.forChild(EventListPage),
  ],
})
export class EventListPageModule {}
