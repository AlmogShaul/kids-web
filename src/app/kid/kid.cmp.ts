import {Component, NgZone} from '@angular/core';
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FirebaseService} from "../services/firebase.service";
import {Location} from "@angular/common";

@Component({
  selector: 'kid',
  templateUrl: './kid.component.html',
  styleUrls: ['./kid.component.css']
})
export class KidComponent {

  kid:any;
  kidObservable:FirebaseListObservable<any[]>;
  private kindergardenId:any;

  constructor(private firebase : FirebaseService,private route: ActivatedRoute, private zone: NgZone,private location: Location){
    this.kid = {};
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      let kidId = params['id'];
      this.kindergardenId = params['kgId'];
      if(kidId !== '-1'){
        this.zone.run(() => {
          this.kid = this.firebase.getKid(kidId);
        });
      }
      else{
        this.kid = {name:'',father:'',mother:'',absentConfirmed:false,fatherPhone:'',motherPhone:'',arrived:false,reminderTime:'10:00',vacationPeriodFrom : null , vacationPeriodTo : null};
      }

    });
  }

  byteArrayOfSelectedPic = null;
  picChosen (data) {
    let files : any[]= data.currentTarget.files;
    for (var i = 0; i < files.length; i++) {
      var reader = new FileReader();
      reader.addEventListener('load', (result) => {
        var target:any = result.target;
        this.byteArrayOfSelectedPic = new Uint8Array(target.result);
      });
      reader.readAsArrayBuffer(files[i]);
    }

  };

  private save(){
    if(this.kid.$key) {
      if(this.byteArrayOfSelectedPic) {
        this.firebase.saveKidPic(this.kid, this.byteArrayOfSelectedPic, this.kid.$key + '.png').then(res => {
          this.kid.image = res;
        });
      }
      this.firebase.updateKid(this.kid).then(()=>{
      });
    }
    else {
      this.kid.arrived = false;
      this.firebase.addKid(this.kid,this.kindergardenId).then(()=>{
        if(this.byteArrayOfSelectedPic) {
          this.firebase.saveKidPic(this.kid, this.byteArrayOfSelectedPic, this.kid.$key + '.png').then(res => {
            this.kid.image = res;
          });
        }
        this.firebase.updateKid(this.kid).then(()=>{
        });
      });
    }
    this.location.back();
  }
}
