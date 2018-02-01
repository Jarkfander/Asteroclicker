export class Utils {
  static secondsToHHMMSS(time: number) {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time - (hours * 3600)) / 60);
    const seconds = Math.floor(time - (hours * 3600) - (minutes * 60));

    let out = hours < 10 ? '0' + hours : '' + hours;
    out += minutes < 10 ? ':0' + minutes : ':' + minutes;
    out += seconds < 10 ? ':0' + seconds : ':' + seconds;

    return out;
  }
}
