import { useState, useRef, useEffect } from 'react'
import { Check, ChevronDown, X, Search } from 'lucide-react'
import { Button } from './button'
import { Input } from './input'
import { Badge } from './badge'
import { cn } from '@/lib/utils'

interface MultiSelectOption {
  value: string
  label: string
  count?: number
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  selectedValues: string[]
  onSelectionChange: (values: string[]) => void
  placeholder?: string
  label?: string
  maxDisplay?: number
  className?: string
}

export function MultiSelect({
  options,
  selectedValues,
  onSelectionChange,
  placeholder = 'Select options...',
  label,
  maxDisplay = 3,
  className
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const clearSearch = () => {
    setSearchQuery('')
  }

  const handleToggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onSelectionChange(selectedValues.filter(v => v !== value))
    } else {
      onSelectionChange([...selectedValues, value])
    }
  }

  const handleRemoveOption = (value: string) => {
    onSelectionChange(selectedValues.filter(v => v !== value))
  }

  const handleSelectAll = () => {
    if (selectedValues.length === filteredOptions.length) {
      onSelectionChange([])
    } else {
      onSelectionChange(filteredOptions.map(option => option.value))
    }
  }

  const displayedValues = selectedValues.slice(0, maxDisplay)
  const remainingCount = selectedValues.length - maxDisplay

  return (
    <div className={cn('relative', className)} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between h-auto min-h-[48px] px-3 py-2"
      >
        <div className="flex flex-wrap gap-1 items-center">
          {selectedValues.length === 0 ? (
            <span className="text-gray-500">{placeholder}</span>
          ) : (
            <>
              {displayedValues.map(value => {
                const option = options.find(opt => opt.value === value)
                return (
                  <Badge
                    key={value}
                    variant="secondary"
                    className="flex items-center gap-1 hover:bg-gray-200"
                  >
                    {option?.label || value}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveOption(value)
                      }}
                    />
                  </Badge>
                )
              })}
              {remainingCount > 0 && (
                <Badge variant="outline">
                  +{remainingCount} more
                </Badge>
              )}
            </>
          )}
        </div>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </Button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-hidden">
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-8"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          
          <div className="p-2 border-b border-gray-200 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
              className="text-sm"
            >
              {selectedValues.length === filteredOptions.length ? 'Deselect All' : 'Select All'}
            </Button>
            <span className="text-xs text-gray-500">
              {selectedValues.length} of {filteredOptions.length} selected
            </span>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-gray-500">
                No options found
              </div>
            ) : (
              filteredOptions.map(option => (
                <div
                  key={option.value}
                  className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleToggleOption(option.value)}
                >
                  <div className="flex items-center justify-center w-4 h-4 mr-3">
                    <div className={`w-4 h-4 border-2 rounded ${
                      selectedValues.includes(option.value) 
                        ? 'bg-blue-600 border-blue-600' 
                        : 'border-gray-300'
                    } flex items-center justify-center`}>
                      {selectedValues.includes(option.value) && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm">{option.label}</span>
                    {option.count && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {option.count}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
} 