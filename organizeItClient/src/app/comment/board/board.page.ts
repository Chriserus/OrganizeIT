import {Component, OnDestroy, OnInit} from '@angular/core';
import {finalize, takeUntil} from "rxjs/operators";
import {Project} from "../../interfaces/project.model";
import {Subject} from "rxjs";
import {CommentService} from "../comment.service";
import {Comment} from "../../interfaces/comment.model";
import {SubmitService} from "../../shared/submit.service";
import {AuthService} from "../../authentication/auth.service";
import {User} from "../../interfaces/user.model";
import {AlertService} from "../../shared/alert.service";
import {DataService} from "../../shared/data.service";

@Component({
  selector: 'app-board',
  templateUrl: './board.page.html',
  styleUrls: ['./board.page.scss'],
})
export class BoardPage implements OnInit, OnDestroy {
  comments: Comment[] = [];
  private unsubscribe: Subject<Project[]> = new Subject();
  public loggedInUser: User;
  announcement: boolean;
  showCommentsSpinner: boolean;

  constructor(private commentService: CommentService, public authService: AuthService, public alertService: AlertService,
              private submitService: SubmitService, private data: DataService) {
    this.announcement = false;
    this.data.currentComments.subscribe(comments => this.comments = comments);
    this.data.currentUser.subscribe(user => this.loggedInUser = user);
    this.authService.getCurrentUser().subscribe((user: User) => this.data.changeCurrentUser(user));
  }

  ngOnInit() {
    this.data.currentComments.subscribe(comments => this.comments = comments);
    this.data.currentUser.subscribe(user => this.loggedInUser = user);
    this.getComments();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getComments() {
    this.showCommentsSpinner = true;
    this.commentService.getComments().pipe(takeUntil(this.unsubscribe))
        .pipe(finalize(async () => {
          this.showCommentsSpinner = false;
        }))
        .subscribe(comments => {
          console.log(comments);
          this.data.changeComments(comments);
        });
  }

  registerComment(form) {
    console.log(form.value);
    if (!this.submitService.isButtonDisabled('submitButton')) {
      this.commentService.addComment(form, this.loggedInUser).subscribe(
          (response: any) => {
            console.log(response);
            form.reset();
            this.getComments();
          })
    }
  }

  loggedInUserIsAuthor(comment: Comment) {
    return sessionStorage.getItem("loggedInUserEmail") === comment.author.email;
  }

  async doRefresh(event) {
    this.getComments();
    event.target.complete();
  }
}
