import { describe, it, expect, vi, beforeEach } from 'vitest'
import { successResponse, errorResponse } from '@/lib/api-auth'

describe('api-auth', () => {
  describe('successResponse', () => {
    it('should return success response with data only', () => {
      const data = { id: '1', name: 'Test' }
      const response = successResponse(data)
      
      expect(response.status).toBe(200)
      return response.json().then((body) => {
        expect(body).toEqual({
          success: true,
          data,
        })
      })
    })

    it('should return success response with meta', () => {
      const data = { items: [] }
      const meta = { total: 0, page: 1 }
      const response = successResponse(data, meta)
      
      return response.json().then((body) => {
        expect(body).toEqual({
          success: true,
          data,
          meta,
        })
      })
    })
  })

  describe('errorResponse', () => {
    it('should return error response with default status 400', () => {
      const response = errorResponse('Validation failed', 'VALIDATION_ERROR')
      
      expect(response.status).toBe(400)
      return response.json().then((body) => {
        expect(body).toEqual({
          success: false,
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
        })
      })
    })

    it('should return error response with custom status', () => {
      const response = errorResponse('Not found', 'NOT_FOUND', 404)
      
      expect(response.status).toBe(404)
      return response.json().then((body) => {
        expect(body).toEqual({
          success: false,
          error: 'Not found',
          code: 'NOT_FOUND',
        })
      })
    })
  })
})
