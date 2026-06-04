export interface ILogger {
  info(message: string, context?: Record<string, unknown>): void
  warn(message: string, context?: Record<string, unknown>): void
  error(message: string, context?: Record<string, unknown>): void
  debug(message: string, context?: Record<string, unknown>): void
}

class ModuleLogger implements ILogger {
  constructor(private readonly module: string) {}

  private format(
    level: string,
    message: string,
    context?: Record<string, unknown>
  ): string {
    const ts = new Date().toISOString()
    const base = `[${ts}] [${level.toUpperCase()}] [${this.module}] ${message}`
    return context ? `${base} ${JSON.stringify(context)}` : base
  }

  info(message: string, context?: Record<string, unknown>): void {
    console.info(this.format('info', message, context))
  }

  warn(message: string, context?: Record<string, unknown>): void {
    console.warn(this.format('warn', message, context))
  }

  error(message: string, context?: Record<string, unknown>): void {
    console.error(this.format('error', message, context))
  }

  debug(message: string, context?: Record<string, unknown>): void {
    console.debug(this.format('debug', message, context))
  }
}

export function createLogger(module: string): ILogger {
  return new ModuleLogger(module)
}
