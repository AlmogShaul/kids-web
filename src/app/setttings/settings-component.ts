import {Component} from "@angular/core";
import {FirebaseService} from "../services/firebase.service";
import {DateFormatter} from "@angular/common/src/pipes/intl";
import {DatePipe} from "@angular/common";
/**
 * Created by shaul.almog on 15/01/2017.
 */



@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent{

  settings:any;
  constructor(private firebase: FirebaseService) {
    this.settings = {};
    this.getSettings();
  }

  public getSettings(){
    this.firebase.getSettingsObservable().subscribe((result:any)=>{
      this.settings.debugMode = result.debugMode == "true" ? true : false;
      this.settings.restart = result.restart == "true" ? true : false;
      this.settings.stopSMS = result.stopSMS== "true" ? true : false;
      this.settings.holidays = result.holidays.split(';');
      this.settings.congratsFiles = result.congratsFiles.split(';');
    });
    }

  public updateSettings(){
    this.firebase.updateSettings(this.getObjToSave());
  }

  private getObjToSave() {
    return {debugMode:this.settings.debugMode,
            restart:this.settings.restart,
            holidays:this.settings.holidays.join(';'),
            congratsFiles:this.settings.congratsFiles.join(';'),
            stopSMS:this.settings.stopSMS};

  }

  addHoliday(val:any){
    this.settings.holidays.push(val);
  }

  addFile(val:any){
  this.settings.congratsFiles.push(val);
  }


  public save(){
    this.updateSettings();
  }



}
