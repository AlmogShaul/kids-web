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

  constructor(private firebaseService : FirebaseService,private route: ActivatedRoute, private zone: NgZone,private location: Location){
    this.kid = {};
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      let kidId = params['id'];
      this.kindergardenId = params['kgId'];
      if(kidId !== '-1'){
        this.zone.run(() => {
          this.kid = this.firebaseService.getKid(kidId);
        });
      }
      else{
        this.kid = {name:'',father:'',mother:'',fatherPhone:'',motherPhone:'',arrived:false};
      }

    });
  }

  picChosen (data) {
    let files : any[]= data.currentTarget.files;
    for (var i = 0; i < files.length; i++) {
      var reader = new FileReader();
      reader.addEventListener('load', (result) => {
        var target:any = result.target;
        var byteArray = new Uint8Array(target.result);
        this.firebaseService.saveKidPic(byteArray, this.kid.$key + '.png');
        this.firebaseService.getKidPic(this.kid);
      });
      reader.readAsArrayBuffer(files[i]);
    }

  };

  private save(){
    if(this.kid.$key)
      this.firebaseService.updateKid(this.kid);
    else {
      this.kid.arrived = false;
      this.firebaseService.addKid(this.kid,this.kindergardenId);
    }
    this.location.back();
  }
}
