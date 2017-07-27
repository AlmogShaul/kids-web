import { Component, OnInit } from '@angular/core';
import {AuthService} from "./services/auth.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app',
    template:`<router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {
    private authenticated: boolean;
    constructor(private auth: AuthService,router:Router) {

      this.authenticated = auth.isAuthenticated();
      if(this.authenticated){
        this.auth.getProfile((err,res)=>{
          if(!res) router.navigate(['not-authorized']);
            else router.navigate(['main']);

        });

      }else {
        auth.handleAuthentication();
      }

    }

    ngOnInit() {

    }

}
