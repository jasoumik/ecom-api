import { ZodSchema, ZodIssue } from 'zod'
import { ValidationError } from '../errors/app-error'

export function validateBody<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data)

  if (!result.success) {
    const details = result.error.issues.map((issue: ZodIssue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }))
    throw new ValidationError('Validation failed', details)
  }

  return result.data
}
