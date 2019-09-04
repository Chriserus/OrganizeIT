export class SubmitService {
  
  isButtonDisabled(id: string) {
    return (document.getElementById(id) as HTMLButtonElement).disabled;
  }
}
