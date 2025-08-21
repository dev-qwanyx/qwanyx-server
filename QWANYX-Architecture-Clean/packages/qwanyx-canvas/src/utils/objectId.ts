import { ObjectId } from 'bson'

/**
 * Generate a new MongoDB ObjectId as a string
 */
export const generateObjectId = (): string => {
  return new ObjectId().toHexString()
}

/**
 * Check if a string is a valid MongoDB ObjectId
 */
export const isValidObjectId = (id: string): boolean => {
  return ObjectId.isValid(id)
}

/**
 * Create an ObjectId from a string (if valid)
 */
export const createObjectId = (id?: string): string => {
  if (id && isValidObjectId(id)) {
    return id
  }
  return generateObjectId()
}