/**
 * Pipeline Logger - Console + File Logging
 * Handles all logging for the generation pipeline with run tracking
 */

import * as fs from 'fs'
import * as path from 'path'

/**
 * Generate a unique run ID for this pipeline execution
 */
export function generateRunId(): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
  const random = Math.random().toString(36).substring(2, 8)
  return `run_${timestamp}_${random}`
}

/**
 * PipelineLogger - Handles logging with optional file persistence
 */
export class PipelineLogger {
  private runId: string
  private logs: Array<{
    timestamp: string
    level: string
    stage: string
    message: string
    data?: any
  }> = []
  private logFilePath: string

  constructor(runId?: string, logsDir?: string) {
    this.runId = runId || generateRunId()
    
    // Create logs directory if needed
    const logsDirectory = logsDir || path.join(process.cwd(), 'logs')
    if (!fs.existsSync(logsDirectory)) {
      fs.mkdirSync(logsDirectory, { recursive: true })
    }
    
    this.logFilePath = path.join(logsDirectory, `${this.runId}.log`)
  }

  /**
   * Log a message at INFO level
   */
  public log(stage: string, message: string, data?: any): void {
    const entry = {
      timestamp: new Date().toISOString(),
      level: 'INFO',
      stage,
      message,
      data
    }
    
    this.logs.push(entry)
    this.writeToFile(entry)
    
    if (data) {
      console.log(`[${stage}] ${message}`, data)
    } else {
      console.log(`[${stage}] ${message}`)
    }
  }

  /**
   * Log a message at DEBUG level
   */
  public debug(stage: string, message: string, data?: any): void {
    if (process.env.DEBUG !== 'true') return
    
    const entry = {
      timestamp: new Date().toISOString(),
      level: 'DEBUG',
      stage,
      message,
      data
    }
    
    this.logs.push(entry)
    this.writeToFile(entry)
    console.debug(`[${stage}] ${message}`, data)
  }

  /**
   * Log a warning
   */
  public warn(stage: string, message: string, data?: any): void {
    const entry = {
      timestamp: new Date().toISOString(),
      level: 'WARN',
      stage,
      message,
      data
    }
    
    this.logs.push(entry)
    this.writeToFile(entry)
    console.warn(`[${stage}] ⚠️  ${message}`, data)
  }

  /**
   * Log an error
   */
  public error(stage: string, message: string, error?: Error | any): void {
    const data = error instanceof Error 
      ? {
          name: error.name,
          message: error.message,
          stack: error.stack?.split('\n').slice(0, 5).join('\n')
        }
      : error

    const entry = {
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      stage,
      message,
      data
    }
    
    this.logs.push(entry)
    this.writeToFile(entry)
    console.error(`[${stage}] ❌ ${message}`, data)
  }

  /**
   * Get all logs
   */
  public getLogs(): typeof this.logs {
    return this.logs
  }

  /**
   * Get run ID
   */
  public getRunId(): string {
    return this.runId
  }

  /**
   * Get log file path
   */
  public getLogFilePath(): string {
    return this.logFilePath
  }

  /**
   * Write log entry to file
   */
  private writeToFile(entry: any): void {
    try {
      const line = JSON.stringify(entry) + '\n'
      fs.appendFileSync(this.logFilePath, line)
    } catch (err) {
      console.error('Failed to write to log file:', err)
    }
  }

  /**
   * Get log file contents
   */
  public getLogFileContents(): string {
    try {
      return fs.readFileSync(this.logFilePath, 'utf-8')
    } catch (err) {
      return ''
    }
  }

  /**
   * Clear all logs
   */
  public clear(): void {
    this.logs = []
    try {
      fs.unlinkSync(this.logFilePath)
    } catch (err) {
      // File may not exist
    }
  }
}
