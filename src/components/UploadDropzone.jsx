import { useCallback, useState } from 'react'
import { CloudUpload, ImageIcon } from 'lucide-react'

export function UploadDropzone({ onPredict }) {
  const [dragActive, setDragActive] = useState(false)
  
  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragActive(false)
    
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleImage(file)
    }
  }, [])
  
  const handleImage = async (file) => {
    const mockGPS = { lat: 40.7128, lng: -74.006 }
    onPredict({ file, gps: mockGPS })
  }
  
  return (
    <div 
      className={`border-4 border-dashed rounded-3xl p-12 transition-all duration-300 ${
        dragActive 
          ? 'border-pasture-moss bg-pasture-moss/10' 
          : 'border-gray-300 hover:border-pasture-soil'
      }`}
      onDragEnter={() => setDragActive(true)}
      onDragLeave={() => setDragActive(false)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-pasture-moss/10 rounded-2xl flex items-center justify-center mb-6">
          <ImageIcon className="w-12 h-12 text-pasture-moss" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Drop pasture photo</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          Upload a nadir photo of your pasture (drone or phone). Get instant biomass + grazing recommendations.
        </p>
        <label className="bg-pasture-moss text-white px-8 py-4 rounded-2xl font-semibold cursor-pointer hover:bg-pasture-meadow transition-all duration-300">
          <CloudUpload className="w-5 h-5 inline mr-2" />
          Choose Photo
          <input 
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={(e) => handleImage(e.target.files[0])}
          />
        </label>
      </div>
    </div>
  )
}
