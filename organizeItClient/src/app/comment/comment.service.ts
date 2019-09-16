import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Comment} from "../interfaces/comment.model";
import {User} from "../interfaces/user.model";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  readonly COMMENTS_URL = '/api/comments/';

  constructor(private http: HttpClient) {
  }

  getComments() {
    return this.http.get<Comment[]>(this.COMMENTS_URL, {responseType: 'json'});
  }

  addComment(form: any, author: User) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        responseType: 'json'
      })
    };
    let jsonData = {
      'content': form.value.content,
      'author': author,
      'announcement': form.value.announcement
    };
    console.log(jsonData);
    return this.http.post(this.COMMENTS_URL, jsonData, httpOptions);
  }
}
