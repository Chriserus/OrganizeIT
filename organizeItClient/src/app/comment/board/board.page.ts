import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {takeUntil} from "rxjs/operators";
import {Project} from "../../interfaces/project.model";
import {Subject} from "rxjs";
import {CommentService} from "../comment.service";
import {Comment} from "../../interfaces/comment.model";
import {SubmitService} from "../../shared/submit.service";
import {AuthService} from "../../authentication/auth.service";
import {IonContent} from "@ionic/angular";

@Component({
  selector: 'app-board',
  templateUrl: './board.page.html',
  styleUrls: ['./board.page.scss'],
})
export class BoardPage extends SubmitService implements OnInit, OnDestroy {
  @ViewChild(IonContent) content: IonContent;
  comments: Comment[] = [];
  private unsubscribe: Subject<Project[]> = new Subject();

  constructor(private commentService: CommentService, private authService: AuthService) {
    super();
  }

  ngOnInit() {
    if (JSON.parse(localStorage.getItem("loggedIn")) === true) {
      this.getComments();
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
    // TODO: Repair scrolling, so it works as intended
    this.ScrollToBottom();
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

  ScrollToBottom(){
    this.content.scrollToBottom(1500);
  }

}
