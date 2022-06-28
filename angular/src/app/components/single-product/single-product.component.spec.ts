import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleProductComponent } from './single-product.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrService } from 'ngx-toastr';


describe('SingleProductComponent', () => {
  let component: SingleProductComponent;
  let fixture: ComponentFixture<SingleProductComponent>;
  let http: HttpClient;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleProductComponent ],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [SingleProductComponent, { provide: ToastrService, useValue: ToastrService }],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    http = TestBed.inject(HttpClient)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
