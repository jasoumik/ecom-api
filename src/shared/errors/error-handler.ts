import type { MedusaRequest, MedusaResponse } from '@medusajs/framework'
import { ZodError, ZodIssue } from 'zod'
import { AppError } from './app-error'

export function errorHandler(
  error: unknown,
  _req: MedusaRequest,
  res: MedusaResponse
): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
        ...(error.details !== undefined ? { details: error.details } : {}),
      },
    })
    return
  }

  if (error instanceof ZodError) {
    res.status(422).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: (error as ZodError).issues.map((issue: ZodIssue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      },
    })
    return
  }

  const message =
    error instanceof Error ? error.message : 'An unexpected error occurred'

  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message,
    },
  })
}
