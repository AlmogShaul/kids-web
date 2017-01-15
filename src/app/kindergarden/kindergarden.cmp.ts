import {Component, ChangeDetectorRef, NgZone} from '@angular/core';
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FirebaseService} from "../services/firebase.service";
import {Observable} from "rxjs/Observable";
import {forEach} from "@angular/router/src/utils/collection";

@Component({
  selector: 'kindergarden',
  templateUrl: './kindergarden.component.html',
  styleUrls: ['./kindergarden.component.css']
})
export class KindergardenComponent {

  kids: any[] = [];
  private reminderTime: any;
  kindergarden: any;

  constructor(private firebase: FirebaseService, private route: ActivatedRoute, private router: Router, private zone: NgZone) {
    this.kindergarden={};
  }

  ngOnInit() {
      this.route.params.forEach((params: Params) => {
          let kindergardenId = params['id'];
          if (kindergardenId !== '-1') {
            this.firebase.completed.subscribe((c) => {
              if (c) {
                this.zone.run(() => {
                  this.kindergarden = this.firebase.getKindergardens().filter((kg) => kg.$key === kindergardenId)[0];
                  this.getKindergardenKids();
                  this.getReminderTime();
                });
              }});
          }
        }
      );
  }



  public updateKindergarden(){
    this.firebase.updateKindergarden(this.kindergarden);
  }

  public setArrived(_kid: any) {
    _kid.arrived = true;
    this.firebase.updateKid(_kid);
  }

  public setNotArrived(_kid: any) {
    _kid.arrived = false;
    this.firebase.updateKid(_kid);
  }

  public editKid(kidId: string,kgId:any) {
    this.router.navigateByUrl('kid/' + kidId + '/' + kgId);
  }

  public removeKid(kidId: string,kgId:any) {
    this.firebase.removeKidFromKindergarden(kidId,kgId);
  }

  public addKid(kgId:any) {
    this.router.navigateByUrl('kid/-1/'+kgId);
  }

  private getKindergardenKids() {
    if (!this.kindergarden) return;
    let temp = [];
    let _kids = this.firebase.getKids();
      let kidIds = this.kindergarden.kids;
      if(!kidIds) return;
      _kids.forEach((kid) => {
        if (kidIds[kid.$key]) {
          temp.push(kid);
        }
      });
    this.zone.run(()=> {
      this.kids = temp;
    });
  }


  private getReminderTime() {
    this.firebase.getReminderTime().subscribe((time) => {
      this.reminderTime = time.$value;
    });
  }
}
