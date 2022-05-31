import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '@compvid/xplat/features';

@Component({
  selector: 'compvid-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  credentials: FormGroup;

  constructor(private fb: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router,
    private authService: AuthService,
) { }

  ngOnInit() {

    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }
  loginAnon(){
    this.authService.loginAnon();
  }

  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }

  async register() {
    console.log('login/register with creds', this.credentials);
    const loading = this.loadingController.create();
    (await loading).present();

    const user = await this.authService.register(this.credentials.value);
    (await loading).dismiss();

    console.log('register got user', user);

    if(user) {
      this.router.navigateByUrl('/home', { replaceUrl: true});
    } else {
      this.showAlert('Registration failed', 'Please try again');
    }
  }

  async login() {
    console.log('login/login with creds', this.credentials);
    const loading = this.loadingController.create();
    (await loading).present();

    const user = await this.authService.login(this.credentials.value);
    (await loading).dismiss();

    console.log('login got user', user);
    if(user) {
      this.router.navigateByUrl('/home', { replaceUrl: true});
    } else {
      this.showAlert('Login failed', 'Please try again');
    }
  }

  async showAlert(header, message) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: (['OK'])
    });
    await alert.present();
  }
}
