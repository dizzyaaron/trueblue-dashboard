import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon, ArrowLeftRight } from 'lucide-react';
import { useLogoStore } from '../../store/logoStore';

export default function LogoSettings() {
  const { logo, setLogo, collapsedLogo, setCollapsedLogo, showText, setShowText } = useLogoStore();
  const [dragActive, setDragActive] = useState(false);
  const [activeUpload, setActiveUpload] = useState<'main' | 'collapsed' | null>(null);

  const handleDrag = (e: React.DragEvent, uploadType: 'main' | 'collapsed') => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
      setActiveUpload(uploadType);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent, uploadType: 'main' | 'collapsed') => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0], uploadType);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, uploadType: 'main' | 'collapsed') => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0], uploadType);
    }
  };

  const handleFile = (file: File, uploadType: 'main' | 'collapsed') => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (uploadType === 'collapsed') {
        setCollapsedLogo(reader.result as string);
      } else {
        setLogo(reader.result as string);
      }
      setActiveUpload(null);
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = (type: 'main' | 'collapsed') => {
    if (type === 'collapsed') {
      setCollapsedLogo(null);
    } else {
      setLogo(null);
    }
  };

  return (
    <div className="bg-surface dark:bg-dark-surface rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4 dark:text-dark-text">Logo Settings</h2>
      
      <div className="space-y-6">
        {/* Main Logo */}
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showText}
              onChange={(e) => setShowText(e.target.checked)}
              className="form-checkbox"
            />
            <span className="dark:text-dark-text">Show text with logo</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 dark:text-dark-text">Company Logo</label>
          
          {logo ? (
            <div className="relative w-64 h-32 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              <img 
                src={logo} 
                alt="Company Logo" 
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => removeLogo('main')}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onDragEnter={(e) => handleDrag(e, 'main')}
              onDragLeave={(e) => handleDrag(e, 'main')}
              onDragOver={(e) => handleDrag(e, 'main')}
              onDrop={(e) => handleDrop(e, 'main')}
              className={`w-64 h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
                dragActive 
                  ? 'border-primary bg-primary/10' 
                  : 'border-gray-300 dark:border-gray-700 hover:border-primary'
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleChange(e, 'main')}
                className="hidden"
                id="logo-upload"
              />
              <label htmlFor="logo-upload" className="cursor-pointer text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Drop your logo here or click to upload
                </span>
              </label>
            </div>
          )}
          
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Recommended size: 400x200 pixels
          </p>
        </div>
        {/* Collapsed Logo */}
        <div>
          <label className="block text-sm font-medium mb-2 dark:text-dark-text">
            Collapsed Menu Logo
            <span className="text-xs text-gray-500 ml-2">(Optional)</span>
          </label>
          
          {collapsedLogo ? (
            <div className="relative w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              <img 
                src={collapsedLogo} 
                alt="Collapsed Logo" 
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => removeLogo('collapsed')}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div
              onDragEnter={(e) => handleDrag(e, 'collapsed')}
              onDragLeave={(e) => handleDrag(e, 'collapsed')}
              onDragOver={(e) => handleDrag(e, 'collapsed')}
              onDrop={(e) => handleDrop(e, 'collapsed')}
              className={`w-16 h-16 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
                dragActive 
                  ? 'border-primary bg-primary/10' 
                  : 'border-gray-300 dark:border-gray-700 hover:border-primary'
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleChange(e, 'collapsed')}
                className="hidden"
                id="collapsed-logo-upload"
              />
              <label htmlFor="collapsed-logo-upload" className="cursor-pointer">
              <Upload className="w-5 h-5 text-gray-400" />
              </label>
            </div>
          )}
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-medium mb-2 dark:text-dark-text">Preview</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-8">
              <div className="w-32">
                {logo && (
                  <img 
                    src={logo} 
                    alt="Logo Preview" 
                    className="w-full h-auto object-contain"
                  />
                )}
              </div>
              <ArrowLeftRight className="w-4 h-4 text-gray-400" />
              <div className="w-8">
                {collapsedLogo && (
                  <img 
                    src={collapsedLogo} 
                    alt="Collapsed Logo Preview" 
                    className="w-full h-auto object-contain"
                  />
                )}
              </div>
            </div>
            {logo && (
              <div className="w-32">
                <img 
                  src={logo} 
                  alt="Logo Preview" 
                  className="w-full h-auto object-contain"
                />
              </div>
            )}
            {showText && (
              <span className="text-xl font-bold dark:text-dark-text">
                True Blue Handyman Services
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}