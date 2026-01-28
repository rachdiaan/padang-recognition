import React from 'react';
import {
  Brain,
  Camera,
  Database,
  Zap,
  Shield,
  Smartphone,
  Code,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Info,
  ChefHat
} from 'lucide-react';

export const Documentation: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/20">
        <div className="p-8 bg-gradient-to-br from-blue-600/80 via-purple-600/80 to-indigo-600/80 backdrop-blur-sm">
          <h1 className="text-4xl font-bold text-white mb-4">📚 Documentation</h1>
          <p className="text-blue-100 text-lg">
            Complete guide to using the Padang Food Recognition System
          </p>
        </div>
      </div>

      {/* Overview */}
      <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/20">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <Info className="text-blue-400 mr-3" size={32} />
            Overview
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            The Padang Food Recognition System is an advanced AI-powered application that uses computer vision
            and machine learning to identify traditional Padang dishes from images captured through your device's camera.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-orange-500/10 backdrop-blur-sm rounded-2xl border border-orange-400/20">
              <Brain className="mx-auto text-orange-400 mb-3" size={40} />
              <h3 className="font-bold text-white mb-2">AI-Powered</h3>
              <p className="text-gray-300 text-sm">Advanced neural networks for accurate food recognition</p>
            </div>

            <div className="text-center p-6 bg-blue-500/10 backdrop-blur-sm rounded-2xl border border-blue-400/20">
              <Camera className="mx-auto text-blue-400 mb-3" size={40} />
              <h3 className="font-bold text-white mb-2">Real-time</h3>
              <p className="text-gray-300 text-sm">Instant image capture and processing capabilities</p>
            </div>

            <div className="text-center p-6 bg-green-500/10 backdrop-blur-sm rounded-2xl border border-green-400/20">
              <Database className="mx-auto text-green-400 mb-3" size={40} />
              <h3 className="font-bold text-white mb-2">Rich Dataset</h3>
              <p className="text-gray-300 text-sm">Comprehensive Padang food database with detailed information</p>
            </div>

            <div className="text-center p-6 bg-purple-500/10 backdrop-blur-sm rounded-2xl border border-purple-400/20">
              <Smartphone className="mx-auto text-purple-400 mb-3" size={40} />
              <h3 className="font-bold text-white mb-2">Mobile-First</h3>
              <p className="text-gray-300 text-sm">Optimized for mobile devices with responsive design</p>
            </div>
          </div>
        </div>
      </div>

      {/* How to Use */}
      <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/20">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <Zap className="text-yellow-400 mr-3" size={32} />
            How to Use
          </h2>

          <div className="space-y-8">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-3">Access Camera</h3>
                <p className="text-gray-300 mb-4">
                  Click the "Start Camera" button to enable your device's camera. The application will request
                  camera permissions if not already granted.
                </p>
                <div className="bg-blue-500/10 border border-blue-400/20 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="text-blue-400" size={20} />
                    <span className="text-blue-300 font-medium">Note:</span>
                  </div>
                  <p className="text-blue-200 text-sm mt-2">
                    Ensure good lighting conditions for optimal recognition accuracy.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-3">Capture Image</h3>
                <p className="text-gray-300 mb-4">
                  Position your Padang dish within the camera frame and click the "Capture" button.
                  The system works best with clear, well-lit images of individual dishes.
                </p>
                <div className="bg-green-500/10 border border-green-400/20 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="text-green-400" size={20} />
                    <span className="text-green-300 font-medium">Tips:</span>
                  </div>
                  <ul className="text-green-200 text-sm mt-2 space-y-1">
                    <li>• Center the dish in the frame</li>
                    <li>• Avoid shadows and reflections</li>
                    <li>• Capture from a slight angle for better recognition</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-3">View Results</h3>
                <p className="text-gray-300 mb-4">
                  The AI system will analyze your image and provide predictions with confidence scores.
                  Results include dish names, descriptions, ingredients, and cultural information.
                </p>
                <div className="bg-purple-500/10 border border-purple-400/20 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="text-purple-400" size={20} />
                    <span className="text-purple-300 font-medium">Understanding Results:</span>
                  </div>
                  <p className="text-purple-200 text-sm mt-2">
                    Higher confidence scores indicate more accurate predictions. Multiple results are ranked by confidence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Specifications */}
      <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/20">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <Code className="text-indigo-400 mr-3" size={32} />
            Technical Specifications
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Frontend Technologies</h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300">React 18 with TypeScript</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300">Tailwind CSS for styling</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300">Vite for build optimization</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300">Lucide React for icons</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">AI & Machine Learning</h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">TensorFlow.js with MobileNet</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">Feature extraction & visual matching</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">Color & texture analysis</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">Client-side WebGL inference</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Browser Support */}
      <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/20">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <Shield className="text-green-400 mr-3" size={32} />
            Browser Support & Requirements
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Supported Browsers</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-xl border border-green-400/20">
                  <span className="text-gray-300">Chrome 90+</span>
                  <CheckCircle className="text-green-400" size={20} />
                </div>
                <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-xl border border-green-400/20">
                  <span className="text-gray-300">Firefox 88+</span>
                  <CheckCircle className="text-green-400" size={20} />
                </div>
                <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-xl border border-green-400/20">
                  <span className="text-gray-300">Safari 14+</span>
                  <CheckCircle className="text-green-400" size={20} />
                </div>
                <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-xl border border-green-400/20">
                  <span className="text-gray-300">Edge 90+</span>
                  <CheckCircle className="text-green-400" size={20} />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">System Requirements</h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="text-green-400" size={20} />
                  <span className="text-gray-300">Camera access permission (for live capture)</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="text-green-400" size={20} />
                  <span className="text-gray-300">File system access (for image upload)</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="text-green-400" size={20} />
                  <span className="text-gray-300">JavaScript enabled</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="text-green-400" size={20} />
                  <span className="text-gray-300">Minimum 2GB RAM</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="text-green-400" size={20} />
                  <span className="text-gray-300">Stable internet connection</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-md border-t border-white/10 rounded-3xl">
        <div className="p-8">
          <div className="text-center text-gray-300">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <ChefHat className="text-orange-400" size={24} />
              <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Padang Food Recognition
              </span>
            </div>
            <p className="text-gray-400 font-medium mb-2">
              Powered by TensorFlow.js and modern web technologies
            </p>
            <p className="text-gray-500">
              © 2025. Created with 💖 by Rachdian
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};