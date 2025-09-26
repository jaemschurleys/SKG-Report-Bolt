import React, { useState, useEffect } from 'react';
import { Upload, MapPin, Download, Eye, Plus, Calendar, Clock, Phone, FileText, Camera, AlertTriangle } from 'lucide-react';

const SecurityReportingApp = () => {
  const [currentView, setCurrentView] = useState('report'); // 'report' or 'dashboard'
  const [reports, setReports] = useState([]);
  const [formData, setFormData] = useState({
    unit: '',
    region: '',
    category: '',
    date: '',
    time: '',
    lossEstimation: 0,
    supervisorPhone: '',
    summary: '',
    latitude: '',
    longitude: '',
    photos: []
  });

  // Configuration options
  const units = ['ABM', 'KNR', 'SDM', 'SPGM', 'LKM', 'LMD'];
  const regions = ['TWU', 'LD', 'SDK', 'BFT', 'KDT'];
  const categories = ['Pencerobohan', 'Kecurian', 'Kerosakan', 'Kebakaran', 'Sabotaj', 'Gangguan', 'Lain-lain'];

  // Load reports from localStorage on component mount
  useEffect(() => {
    const savedReports = localStorage.getItem('securityReports');
    if (savedReports) {
      setReports(JSON.parse(savedReports));
    }
  }, []);

  // Save reports to localStorage whenever reports change
  useEffect(() => {
    localStorage.setItem('securityReports', JSON.stringify(reports));
  }, [reports]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    const photoUrls = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...photoUrls]
    }));
  };

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          handleInputChange('latitude', position.coords.latitude.toFixed(6));
          handleInputChange('longitude', position.coords.longitude.toFixed(6));
        },
        (error) => {
          alert('Unable to get location: ' + error.message);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleSubmit = (e) => {
    
    // Validation
    if (!formData.unit || !formData.region || !formData.category || !formData.date || !formData.time) {
      alert('Please fill in all required fields');
      return;
    }

    const newReport = {
      id: Date.now(),
      ...formData,
      timestamp: new Date().toISOString(),
      status: 'Submitted'
    };

    setReports(prev => [newReport, ...prev]);
    
    // Reset form
    setFormData({
      unit: '',
      region: '',
      category: '',
      date: '',
      time: '',
      lossEstimation: 0,
      supervisorPhone: '',
      summary: '',
      latitude: '',
      longitude: '',
      photos: []
    });

    alert('Report submitted successfully!');
  };

  const exportToCSV = () => {
    if (reports.length === 0) {
      alert('No reports to export');
      return;
    }

    const csvHeaders = [
      'ID', 'Unit', 'Region', 'Category', 'Date', 'Time', 
      'Loss Estimation (kg)', 'Supervisor Phone', 'Summary', 
      'Latitude', 'Longitude', 'Photos Count', 'Submitted At', 'Status'
    ];

    const csvData = reports.map(report => [
      report.id,
      report.unit,
      report.region,
      report.category,
      report.date,
      report.time,
      report.lossEstimation,
      report.supervisorPhone,
      `"${report.summary.replace(/"/g, '""')}"`, // Escape quotes in summary
      report.latitude,
      report.longitude,
      report.photos.length,
      new Date(report.timestamp).toLocaleString(),
      report.status
    ]);

    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `security_reports_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const ReportForm = () => (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center mb-6">
        <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
        <h1 className="text-3xl font-bold text-gray-900">Security Incident Report</h1>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Unit Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unit *
            </label>
            <select
              value={formData.unit}
              onChange={(e) => handleInputChange('unit', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Unit</option>
              {units.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>

          {/* Region Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Region *
            </label>
            <select
              value={formData.region}
              onChange={(e) => handleInputChange('region', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Region</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline w-4 h-4 mr-1" />
              Date *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="inline w-4 h-4 mr-1" />
              Time *
            </label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => handleInputChange('time', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* Loss Estimation and Supervisor Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loss Estimation (kg)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.lossEstimation}
              onChange={(e) => handleInputChange('lossEstimation', parseFloat(e.target.value) || 0)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="inline w-4 h-4 mr-1" />
              Supervisor Phone Number
            </label>
            <input
              type="tel"
              value={formData.supervisorPhone}
              onChange={(e) => handleInputChange('supervisorPhone', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="+60x-xxxxxxx"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="inline w-4 h-4 mr-1" />
            Location Coordinates
          </label>
          <div className="flex gap-4">
            <input
              type="text"
              value={formData.latitude}
              onChange={(e) => handleInputChange('latitude', e.target.value)}
              placeholder="Latitude"
              className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="text"
              value={formData.longitude}
              onChange={(e) => handleInputChange('longitude', e.target.value)}
              placeholder="Longitude"
              className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={getCurrentLocation}
              className="px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
            >
              <MapPin className="w-4 h-4 mr-1" />
              GPS
            </div>
          </div>
        </div>

        {/* Summary */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="inline w-4 h-4 mr-1" />
            Summary / Additional Notes
          </label>
          <textarea
            value={formData.summary}
            onChange={(e) => handleInputChange('summary', e.target.value)}
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Provide detailed description of the incident..."
          />
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Camera className="inline w-4 h-4 mr-1" />
            Photos
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              id="photo-upload"
            />
            <label htmlFor="photo-upload" className="cursor-pointer">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Click to upload photos or drag and drop</p>
              <p className="text-xs text-gray-400">PNG, JPG, JPEG up to 10MB each</p>
            </label>
          </div>

          {formData.photos.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.photos.map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={photo}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-24 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center cursor-pointer"
        >
          <Plus className="w-5 h-5 mr-2" />
          Submit Report
        </button>
      </div>
    </div>
  );

  const Dashboard = () => (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Security Reports Dashboard</h1>
        <button
          onClick={exportToCSV}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-sm font-medium text-blue-800">Total Reports</h3>
          <p className="text-2xl font-bold text-blue-900">{reports.length}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h3 className="text-sm font-medium text-red-800">This Month</h3>
          <p className="text-2xl font-bold text-red-900">
            {reports.filter(r => new Date(r.timestamp).getMonth() === new Date().getMonth()).length}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="text-sm font-medium text-yellow-800">High Priority</h3>
          <p className="text-2xl font-bold text-yellow-900">
            {reports.filter(r => ['Kebakaran', 'Sabotaj', 'Pencerobohan'].includes(r.category)).length}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="text-sm font-medium text-green-800">Total Loss (kg)</h3>
          <p className="text-2xl font-bold text-green-900">
            {reports.reduce((sum, r) => sum + (r.lossEstimation || 0), 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit/Region</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loss (kg)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No reports available
                  </td>
                </tr>
              ) : (
                reports.map(report => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{report.id.toString().slice(-6)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.unit} - {report.region}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        ['Kebakaran', 'Sabotaj', 'Pencerobohan'].includes(report.category)
                          ? 'bg-red-100 text-red-800'
                          : ['Kecurian', 'Kerosakan'].includes(report.category)
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {report.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.date} {report.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.lossEstimation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
              <span className="text-xl font-bold text-gray-900">Security Reporting System</span>
            </div>
            <div className="flex space-x-4 items-center">
              <button
                onClick={() => setCurrentView('report')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  currentView === 'report'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                New Report
              </button>
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  currentView === 'dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-8">
        {currentView === 'report' ? <ReportForm /> : <Dashboard />}
      </main>
    </div>
  );
};

export default SecurityReportingApp;