import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {takeUntil} from "rxjs/operators";
import {Project} from "../../interfaces/project.model";
import {Subject} from "rxjs";
import {CommentService} from "../comment.service";
import {Comment} from "../../interfaces/comment.model";
import {SubmitService} from "../../shared/submit.service";
import {AuthService} from "../../authentication/auth.service";
import {IonContent} from "@ionic/angular";
import {User} from "../../interfaces/user.model";

@Component({
  selector: 'app-board',
  templateUrl: './board.page.html',
  styleUrls: ['./board.page.scss'],
})
export class BoardPage extends SubmitService implements OnInit, OnDestroy {
  @ViewChild(IonContent) content: IonContent;
  comments: Comment[] = [];
  private unsubscribe: Subject<Project[]> = new Subject();
  private loggedInUser: User;

  constructor(private commentService: CommentService, private authService: AuthService) {
    super();
  }

  ngOnInit() {
    if (JSON.parse(localStorage.getItem("loggedIn")) === true) {
      this.getComments();
      this.authService.getCurrentUser().subscribe(
          (user: User) => {
            this.loggedInUser = user
          }
      )
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getComments() {
    this.comments = [];
    this.commentService.getComments().pipe(takeUntil(this.unsubscribe)).subscribe(comments => {
      console.log(comments);
      this.comments = comments;
    });
  }

  registerComment(form) {
    console.log(form.value);
    if (!this.isButtonDisabled('submitButton')) {
      this.authService.getCurrentUser().subscribe(
          (user: any) => {
            this.commentService.addComment(form, user).subscribe(
                (response: any) => {
                  console.log(response);
                  form.reset();
                  if (JSON.parse(localStorage.getItem("loggedIn")) === true) {
                    this.getComments();
                  }
                })
          });
    }
  }
}
