/**
 * Logger utility for the Brain Server
 */

import pino from 'pino'

export class Logger {
  private static instance: Logger
  private logger: pino.Logger
  
  private constructor() {
    const isDev = process.env.NODE_ENV === 'development'
    
    this.logger = pino({
      level: process.env.LOG_LEVEL || 'info',
      transport: isDev && process.env.LOG_PRETTY === 'true' ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          ignore: 'pid,hostname',
          translateTime: 'HH:MM:ss'
        }
      } : undefined
    })
  }
  
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }
  
  info(message: string, ...args: any[]): void {
    this.logger.info(args[0], message)
  }
  
  error(message: string, error?: any): void {
    this.logger.error({ err: error }, message)
  }
  
  warn(message: string, ...args: any[]): void {
    this.logger.warn(args[0], message)
  }
  
  debug(message: string, ...args: any[]): void {
    this.logger.debug(args[0], message)
  }
  
  fatal(message: string, error?: any): void {
    this.logger.fatal({ err: error }, message)
  }
}