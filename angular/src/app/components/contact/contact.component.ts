import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { catchError, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  private apiLoaded: Observable<boolean>;
  private center: google.maps.LatLngLiteral = {lat: 50.048924580103346, lng: 21.981803279444392};
  private emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  private fnameFormControl = new FormControl('', [Validators.required]);
  private lnameFormControl = new FormControl('', [Validators.required]);
  private markerOptions: google.maps.MarkerOptions = {clickable: false, optimized: false, title: 'WSIiZ' };
  private markerPositions: google.maps.LatLngLiteral[] = [];
  private messageFormControl = new FormControl('', [Validators.required]);
  private options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    scrollwheel: false,
    center: {lat: 50.048924580103346, lng: 21.981803279444392},
    zoom: 17,
  }
  private phoneFormControl = new FormControl('', [Validators.required]);
  constructor(http: HttpClient) {
    this.apiLoaded = http.jsonp('https://maps.googleapis.com/maps/api/js?key=AIzaSyAPzf55-x7RnpsDjG9yMj7ZHuYXyvUXSxQ', 'callback')
        .pipe(
          map(() => true),
          catchError(() => of(false)),
        );
  }

  ngOnInit() {
    this.markerPositions.push(this.center);
  }


}
