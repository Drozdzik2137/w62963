import { environment } from './../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { catchError, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contactForm = new FormGroup({
    emailFormControl: new FormControl('', [Validators.required, Validators.email]),
    fnameFormControl: new FormControl('', [Validators.required]),
    lnameFormControl: new FormControl('', [Validators.required]),
    phoneFormControl: new FormControl('', [Validators.required]),
    messageFormControl: new FormControl('', [Validators.required])
  })
  apiLoaded: Observable<boolean>;
  center: google.maps.LatLngLiteral = {lat: 50.048924580103346, lng: 21.981803279444392};
  markerOptions: google.maps.MarkerOptions = {clickable: false, optimized: false, title: 'WSIiZ' };
  markerPositions: google.maps.LatLngLiteral[] = [];
  messageFormControl = new FormControl('', [Validators.required]);
  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    scrollwheel: false,
    center: {lat: 50.048924580103346, lng: 21.981803279444392},
    zoom: 17,
  }
  apiKey = environment.apiKey;
  constructor(http: HttpClient) {
    this.apiLoaded = http.jsonp(this.apiKey, 'callback')
        .pipe(
          map(() => true),
          catchError(() => of(false)),
        );
  }

  ngOnInit() {
    this.markerPositions.push(this.center);
  }


}
