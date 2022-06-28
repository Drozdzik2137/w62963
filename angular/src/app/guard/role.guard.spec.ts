import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrService } from 'ngx-toastr';

import { RoleGuard } from './role.guard';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let http: HttpClient;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [RoleGuard, { provide: ToastrService, useValue: ToastrService }]
    });
    guard = TestBed.inject(RoleGuard);
    http = TestBed.inject(HttpClient)
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
