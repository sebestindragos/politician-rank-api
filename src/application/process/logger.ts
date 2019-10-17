import * as moment from "moment";
import { dotenv } from "../env";

/**
 * Class used for writing in log files.
 *
 * @author Dragos Sebestin
 */
export class Logger {
  private static _instance: Logger = new Logger();

  /**
   * Hide class constructor.
   */
  private constructor() {}

  /**
   * Return singleton instance.
   */
  static get(): Logger {
    return this._instance;
  }

  /**
   * Write to output stream.
   */
  write(...args: any[]) {
    /* tslint:disable */
    console.log(this.getDefaultFormat(args), ...args);
    /* tslint:enable */
  }

  /**
   * Write to error stream.
   */
  error(...args: any[]) {
    /* tslint:disable */
    console.error(this.getDefaultFormat(args), ...args);
    /* tslint:enable */
  }

  /**
   * Write to output stream only on debug.
   */
  debug(...args: any[]) {
    /* tslint:disable */
    if (dotenv.config === "debug")
      console.log(this.getDefaultFormat(args), ...args);
    /* tslint:enable */
  }

  /**
   * Return default parameters for console
   */
  private getDefaultFormat(args: any[]) {
    let format = "[" + moment.utc().format(`D/MMM/YYYY HH:mm:ss`) + "]";
    if (args.length > 0 && typeof args[0] === "string")
      format += " " + args.shift();
    return format;
  }
}
