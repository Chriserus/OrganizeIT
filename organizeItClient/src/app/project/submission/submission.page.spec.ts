import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionPage } from './submission.page';

describe('SubmissionPage', () => {
  let component: SubmissionPage;
  let fixture: ComponentFixture<SubmissionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmissionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
