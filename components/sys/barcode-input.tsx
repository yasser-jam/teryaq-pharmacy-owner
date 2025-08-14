"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Scan } from "lucide-react"
import { cn } from "@/lib/utils"

interface BarcodeInputProps {
  barcodes: string[]
  onBarcodesChange: (barcodes: string[]) => void
  className?: string
}

export function BarcodeInput({ barcodes, onBarcodesChange, className }: BarcodeInputProps) {
  const [inputValue, setInputValue] = useState("")

  const addBarcode = () => {
    if (inputValue.trim() && !barcodes.includes(inputValue.trim())) {
      onBarcodesChange([...barcodes, inputValue.trim()])
      setInputValue("")
    }
  }

  const removeBarcode = (index: number) => {
    onBarcodesChange(barcodes.filter((_, i) => i !== index))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addBarcode()
    }
  }

  return (
    <Card className={cn("w-full shadow-none", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Scan className="h-5 w-5 text-primary" />
          Barcodes
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          You could scan the barcode for adding it instantly
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Input Section */}
        <div className="flex gap-2">
          <Input
            placeholder="Enter barcode..."
            value={inputValue}
            onChange={(e) => setInputValue(String(e))}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button
            onClick={addBarcode}
            size="icon"
            disabled={!inputValue.trim() || barcodes.includes(inputValue.trim())}
            className="shrink-0"
            type="button"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Barcodes List */}
        {barcodes.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-foreground">Added Barcodes ({barcodes?.length})</div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {barcodes?.map((barcode, index) => (
                <div key={barcode} className="flex items-center justify-between gap-2 p-2 rounded-md bg-muted/50 border">
                  <Badge variant="secondary" className="font-mono text-xs">
                    {barcode}
                  </Badge>
                  <Button
                    onClick={() => removeBarcode(index)}
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {barcodes.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <Scan className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No barcodes added yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
