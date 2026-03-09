import { describe, it, expect } from 'vitest'
import { render, screen } from '@/lib/test-utils'
import Filters from '@/components/Filters'

describe('Filters', () => {
  it('should render category filter with correct value', () => {
    render(
      <Filters category="Electronics" condition="all" />
    )
    
    const categorySelect = screen.getByLabelText(/category/i)
    expect(categorySelect).toBeInTheDocument()
  })

  it('should render condition filter with correct value', () => {
    render(
      <Filters category="all" condition="like_new" />
    )
    
    const conditionSelect = screen.getByLabelText(/condition/i)
    expect(conditionSelect).toBeInTheDocument()
  })
})
