import { EventEmitter } from "events";
import { dotenv } from "../env";

/**
 * Class managing node process.
 *
 * @author Dragos Sebestin
 */
export class ProcessManager extends EventEmitter {
  /**
   * Class constructor.
   */
  constructor() {
    super();
  }

  /**
   * Initializes the service and emits the Start event.
   */
  init() {
    // set node environment
    process.env.NODE_ENV = dotenv.config;

    process.on("SIGINT", this.shutdown.bind(this));
    process.on("SIGTERM", this.shutdown.bind(this));
    process.on("SIGQUIT", this.shutdown.bind(this));

    this.emit("start");
  }

  /**
   * Emits the Stop event when the process has to close.
   */
  private shutdown() {
    this.emit("stop");
  }
}
