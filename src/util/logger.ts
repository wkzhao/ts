import * as winston from 'winston';
import * as path from 'path';

export type Logger = winston.Logger;

export class LoggerFactory {

  public static getLogger (category: string): Logger {

    if (winston.loggers.has(category)) {
      return winston.loggers.get(category);
    }

    return this.addLogger(category);
  }

  // 添加多个logger
  private static addLogger (category: string) {
      const logPath = path.join(__dirname + `../../logs/${category}.log`);
      return winston.loggers.add(category, {
      format: winston.format.combine(
        winston.format.label({ label: category }),
        winston.format.timestamp(),
        winston.format.printf((info) => {
          return `${info.timestamp} [${info.label}] ${info.level}: ${
            info.message
          }`;
        })
      ),

      transports: [
        // level设置打印的最低级别
        new winston.transports.Console({ level: 'info' }),
        new winston.transports.File({
          level: 'info',
          filename: logPath,
          maxsize: 5242880,
          maxFiles: 20
        })
      ]
    });
  }
}
