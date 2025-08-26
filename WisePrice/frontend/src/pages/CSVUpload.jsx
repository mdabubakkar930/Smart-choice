import React, { useState } from 'react'
import { Upload, FileText, CheckCircle, AlertCircle, Download } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { uploadCSV } from '../utils/api'

const CSVUpload = () => {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile)
      setError('')
      setResult(null)
    } else {
      setError('Please select a valid CSV file')
      setFile(null)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first')
      return
    }

    setUploading(true)
    setError('')
    setResult(null)

    try {
      const response = await uploadCSV(file)
      setResult(response)
      setFile(null)
      // Reset file input
      document.getElementById('csv-upload').value = ''
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const downloadSampleCSV = () => {
    const sampleData = `brand,model_name,price,ram,storage,battery,rating
Apple,iPhone 15 Pro,999.99,8,128,3274,4.5
Samsung,Galaxy S24 Ultra,1199.99,12,256,5000,4.6
Google,Pixel 8 Pro,899.99,12,128,5050,4.4`

    const blob = new Blob([sampleData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sample_smartphones.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">CSV Upload</h1>
        <p className="text-gray-600 mt-2">
          Bulk import smartphones from a CSV file
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              Upload CSV File
            </CardTitle>
            <CardDescription>
              Select a CSV file containing smartphone data to import
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label
                htmlFor="csv-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FileText className="w-8 h-8 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">CSV files only</p>
                </div>
                <input
                  id="csv-upload"
                  type="file"
                  className="hidden"
                  accept=".csv"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {file && (
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm text-blue-800 font-medium">
                  {file.name}
                </span>
              </div>
            )}

            {error && (
              <div className="flex items-center p-3 bg-red-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-sm text-red-800">{error}</span>
              </div>
            )}

            {result && (
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm text-green-800">
                  {result.message}
                </span>
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full"
            >
              {uploading ? 'Uploading...' : 'Upload CSV'}
            </Button>
          </CardContent>
        </Card>

        {/* Instructions Section */}
        <Card>
          <CardHeader>
            <CardTitle>CSV Format Requirements</CardTitle>
            <CardDescription>
              Your CSV file must follow this format
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Required Columns:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li><code className="bg-gray-100 px-1 rounded">brand</code> - Phone brand name</li>
                <li><code className="bg-gray-100 px-1 rounded">model_name</code> - Phone model name</li>
                <li><code className="bg-gray-100 px-1 rounded">price</code> - Price in USD (decimal)</li>
                <li><code className="bg-gray-100 px-1 rounded">ram</code> - RAM in GB (integer)</li>
                <li><code className="bg-gray-100 px-1 rounded">storage</code> - Storage in GB (integer)</li>
                <li><code className="bg-gray-100 px-1 rounded">battery</code> - Battery capacity in mAh (integer)</li>
                <li><code className="bg-gray-100 px-1 rounded">rating</code> - Rating out of 5 (decimal)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Notes:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Duplicate phones (same brand + model) will be skipped</li>
                <li>• Invalid rows will be ignored</li>
                <li>• Make sure your CSV uses commas as separators</li>
                <li>• Include column headers in the first row</li>
              </ul>
            </div>

            <Button
              variant="outline"
              onClick={downloadSampleCSV}
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Sample CSV
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CSVUpload
