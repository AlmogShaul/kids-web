import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MainComponent} from './main/main.component';
import { AngularFireModule } from 'angularfire2';
import {MaterialModule, MdInputModule} from "@angular/material";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {app_routes} from "./app.routing";
import {KidComponent} from "./kid/kid.cmp";
import {HashLocationStrategy, LocationStrategy} from "@angular/common";
import {AppComponent} from "./app.cmp";
import {FirebaseService} from "./services/firebase.service";
import {KindergardenComponent} from "./kindergarden/kindergarden.cmp";
import {SettingsComponent} from "./setttings/settings-component";

// Must export the config
export const firebaseConfig = {
  apiKey: "AIzaSyACoSaSPuxvYz16ZE2-9myZrN0e4RBbY7o",
  authDomain: "kids-f5aa3.firebaseapp.com",
  databaseURL: "https://kids-f5aa3.firebaseio.com",
  storageBucket: "kids-f5aa3.appspot.com",
  messagingSenderId: "16965481247"
};

@NgModule({
  imports: [
    RouterModule.forRoot(app_routes),
    MaterialModule.forRoot(),
    MdInputModule,
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  providers:[
    FirebaseService,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
  ],
  declarations: [ AppComponent,MainComponent ,SettingsComponent, KidComponent, KindergardenComponent],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
