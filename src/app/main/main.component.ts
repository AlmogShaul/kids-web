import {Component, ChangeDetectorRef, NgZone} from '@angular/core';
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {FirebaseService} from "../services/firebase.service";
import {Router} from "@angular/router";
import set = Reflect.set;
import {MdDialog} from "@angular/material";
import {ConfirmationCmp} from "../confirmation.cmp";
import {AuthService} from "../services/auth.service";

var  USERS:string[] = ['bsaveservice','shaul.almog','ronengelman1','sharli19'];
@Component({
  selector: 'app-root',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})
export class MainComponent {
  title = 'Kindergarden...';
  kids: any[] = [];
  kindergardens: any = [];
  editMode: boolean;
  loadingCompleted : boolean;

  constructor(private auth:AuthService,private dialog: MdDialog,private firebase: FirebaseService, private router: Router, private zone: NgZone) {

  }

  public settings(){
    this.router.navigateByUrl('settings');
  }


  public save(kindergarden: any) {
    this.fixUndefinedFields(kindergarden);
    kindergarden.editMode = false;
    if(kindergarden.$key){
      this.firebase.updateKindergarden(kindergarden);
    }
    else {
      this.firebase.addKindergarden(kindergarden);
    }
  }

  private fixUndefinedFields(kindergarden: any) {
    if (kindergarden.simSerialNumber === undefined)
      kindergarden.simSerialNumber = '';
    if (kindergarden.phone === undefined)
      kindergarden.phone = '';
  }

  public edit(item: any, event: any) {
    event.stopPropagation();
    item.editMode = true;
  }

  public delete(item: any, event: any) {
    event.stopPropagation();

    let dialog = this.dialog.open(ConfirmationCmp);
    dialog.afterClosed().subscribe(result => {
      if(!result) return;
      this.firebase.kindergardenObservable.remove(item);
    });

  }

  ngOnInit() {

    this.firebase.completed.subscribe((c) => {
      if (c) {
        this.loadingCompleted = true;
        this.zone.run(() => {
          if(USERS.find(x=> x == this.auth.userProfile.nickname)){
            this.kindergardens = this.firebase.kindergardens;
            this.firebase.admin = true;
          }
          else {
            this.firebase.admin = false;
            this.kindergardens = this.firebase.kindergardens.filter(k=> k.group == this.auth.userProfile.nickname);
          }

        });
      }
    });

  }

  public add() {
    this.kindergardens.push({name: 'new',editMode:true,phone:'',simSerialNumber:''});
  }

  public getKindergardens() {
    this.kindergardens = this.firebase.getKindergardens();

  }


  public selectKindergarden(item) {
    this.router.navigateByUrl('kindergarden/' + item.$key);

  }
}
