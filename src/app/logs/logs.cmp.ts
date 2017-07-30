import {Component} from "@angular/core";
import {FirebaseService} from "../services/firebase.service";
import {FirebaseListObservable} from "angularfire2";
import {Observable} from "rxjs/Observable";
import {MdDialog} from "@angular/material";
import {ConfirmationCmp} from "../confirmation.cmp";

@Component({
  selector: 'logs',
  templateUrl: 'logs.cmp.html',
  styleUrls: ['logs.cmp.less']
})
export class LogsComponent {


  private logs: any;
  private _dateFilter:string = '';
  private filteredLogs : any;

  set dateFilter(val:string){
    this._dateFilter = val;
  }
  get dateFilter(){
    return this._dateFilter;
  }

  filter(){
    if(this.logs)
      this.filteredLogs = this.logs.filter( log => log.$key.indexOf(this.dateFilter) >= 0);
  }

  deleteLogs(){
    let dialog = this.dialog.open(ConfirmationCmp);
    dialog.afterClosed().subscribe(result => {
      if(!result) return;
      this.firebaseService.deleteLogs();
    });


  }

  constructor(private firebaseService : FirebaseService,private dialog: MdDialog){
    this.firebaseService.getLogs().subscribe(res=>{
      this.logs = res;
    });
  }



}
