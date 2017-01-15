import {Component} from "@angular/core";
import {FirebaseService} from "../services/firebase.service";
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
    this.firebase.getSettingsObservable().subscribe((result)=>{
      this.settings = result;
    });
    }

  public updateSettings(){
    this.firebase.updateSettings(this.getObjToSave());
  }

  private getObjToSave() {
    return {debugMode:this.settings.debugMode,
            restart:this.settings.restart,
            holidays:this.settings.holidays,
            congratsFiles:this.settings.congratsFiles,
            stopSMS:this.settings.stopSMS};

  }

  public save(){
    this.updateSettings();
  }



}
