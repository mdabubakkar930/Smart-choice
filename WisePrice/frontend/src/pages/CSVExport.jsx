import React, { useState } from 'react'
import { Download, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { exportCSV } from '../utils/api'

const CSVExport = () => {
  const [exporting, setExporting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleExport = async () => {
    setExporting(true)
    setError('')
    setSuccess(false)

    try {
      const response = await exportCSV()
      
      // Create download link
      const blob = new Blob([response], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `smartphones_export_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Export failed. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">CSV Export</h1>
        <p className="text-gray-600 mt-2">
          Download your smartphone data as a CSV file
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Export Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="h-5 w-5 mr-2" />
              Export Smartphone Data
            </CardTitle>
            <CardDescription>
              Download all smartphone data in CSV format
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50">
              <FileText className="w-8 h-8 mb-3 text-gray-400" />
              <p className="text-sm text-gray-500 text-center">
                Click the button below to download<br />
                your smartphone database as CSV
              </p>
            </div>

            {error && (
              <div className="flex items-center p-3 bg-red-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-sm text-red-800">{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm text-green-800">
                  CSV file downloaded successfully!
                </span>
              </div>
            )}

            <Button
              onClick={handleExport}
              disabled={exporting}
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              {exporting ? 'Exporting...' : 'Export to CSV'}
            </Button>
          </CardContent>
        </Card>

        {/* Information Section */}
        <Card>
          <CardHeader>
            <CardTitle>Export Information</CardTitle>
            <CardDescription>
              What's included in your export
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Exported Data Includes:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Phone ID</li>
                <li>• Brand name</li>
                <li>• Model name</li>
                <li>• Price</li>
                <li>• RAM capacity</li>
                <li>• Storage capacity</li>
                <li>• Battery capacity</li>
                <li>• Rating</li>
                <li>• Date added</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">File Format:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• CSV (Comma-Separated Values)</li>
                <li>• UTF-8 encoding</li>
                <li>• Compatible with Excel, Google Sheets</li>
                <li>• Can be imported back into the system</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Use Cases:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Data backup</li>
                <li>• Analysis in spreadsheet software</li>
                <li>• Sharing data with team members</li>
                <li>• Migration to other systems</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CSVExport
