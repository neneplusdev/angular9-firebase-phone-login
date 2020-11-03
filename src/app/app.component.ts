import { Component } from '@angular/core';
import { WindowService } from './window.service';
import * as firebase from 'firebase';

export class PhoneNumber {
  country: string;
  area: string;
  prefix: string;
  line: string;
  get e164() {
    const num = this.country + this.area + this.prefix + this.line
    return `+${num}`
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-phone-verification';
  windowRef: any;
  phoneNumber = new PhoneNumber()
  verificationCode: string;
  user: any;
  public recaptchaVerifier: firebase.auth.RecaptchaVerifier;

  constructor(private win: WindowService) { 
    const firebaseConfig = {
      apiKey: "AIzaSyD6EnFDvEc9EyEVITUQPNZDMbFa4ZrFxz8",
      authDomain: "angular-phone-authentication.firebaseapp.com",
      databaseURL: "https://angular-phone-authentication.firebaseio.com",
      projectId: "angular-phone-authentication",
      storageBucket: "angular-phone-authentication.appspot.com",
      messagingSenderId: "636420904856",
      appId: "1:636420904856:web:f9cb9810cf99fe0d3cbded",
      measurementId: "G-V3HR912KFJ"
    };
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
  }

  ngOnInit(): void {
    this.windowRef = this.win.windowRef
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    this.windowRef.recaptchaVerifier.render()
  }

  sendLoginCode() {
    const appVerifier = this.windowRef.recaptchaVerifier;
    const num = this.phoneNumber.e164;
    firebase.auth().signInWithPhoneNumber(num, appVerifier).then(result => {
      this.windowRef.confirmationResult = result;
    })
    .catch( error => console.log(error) );
  }

  verifyLoginCode() {
    this.windowRef.confirmationResult.confirm(this.verificationCode).then( result => {
      this.user = result.user;
    })
    .catch( error => console.log(error, "Incorrect code entered?"));
  }
}
