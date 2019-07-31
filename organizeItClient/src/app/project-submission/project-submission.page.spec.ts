import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSubmissionPage } from './project-submission.page';

describe('ProjectSubmissionPage', () => {
  let component: ProjectSubmissionPage;
  let fixture: ComponentFixture<ProjectSubmissionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectSubmissionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectSubmissionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
