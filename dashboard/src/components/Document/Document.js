import React, { useState, useEffect } from 'react';
import {
    Upload,
    Download,
    Trash2,
    Edit3,
    Search,
    Filter,
    FileText,
    Calendar,
    User,
    HardDrive,
    AlertCircle,
    CheckCircle,
    X,
    Plus,
    Eye,
    RefreshCw,
    ZoomIn,
    ZoomOut,
    RotateCcw
} from 'lucide-react';

const Document = () => {

    const [showViewModal, setShowViewModal] = useState(false);
    const [viewingDocument, setViewingDocument] = useState(null);
    const [documentContent, setDocumentContent] = useState('');
    const [documentType, setDocumentType] = useState('');
    const [zoomLevel, setZoomLevel] = useState(100);

    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStaffId, setFilterStaffId] = useState('');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingDocument, setEditingDocument] = useState(null);
    const [uploadData, setUploadData] = useState({
        user_name: '',
        staff_id: '',
        document_name: '',
        document: null
    });

    const API_BASE_URL = 'https://cmti-edge.online/M2C/Backend/Document.php';

    // Fetch documents
    const fetchDocuments = async () => {
        setLoading(true);
        try {
            let url = API_BASE_URL;
            const params = new URLSearchParams();

            if (filterStaffId) params.append('staff_id', filterStaffId);
            if (searchTerm) params.append('user_name', searchTerm);

            if (params.toString()) {
                url += '?' + params.toString();
            }

            const response = await fetch(url);
            const result = await response.json();

            if (result.success) {
                setDocuments(result.data || []);
                setError('');
            } else {
                setError(result.message || 'Failed to fetch documents');
                setDocuments([]);
            }
        } catch (err) {
            setError('Network error occurred');
            setDocuments([]);
        } finally {
            setLoading(false);
        }
    };

    // Upload document
    const handleUpload = async (e) => {
        if (e) e.preventDefault();
        if (!uploadData.user_name || !uploadData.staff_id || !uploadData.document_name || !uploadData.document) {
            setError('Please fill all fields and select a file');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('user_name', uploadData.user_name);
        formData.append('staff_id', uploadData.staff_id);
        formData.append('document_name', uploadData.document_name);
        formData.append('document', uploadData.document);

        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                setSuccess('Document uploaded successfully!');
                setShowUploadModal(false);
                setUploadData({ user_name: '', staff_id: '', document_name: '', document: null });
                fetchDocuments();
            } else {
                setError(result.message || 'Upload failed');
            }
        } catch (err) {
            setError('Network error occurred during upload');
        } finally {
            setLoading(false);
        }
    };

    // Update document
    const handleUpdate = async (e) => {
        if (e) e.preventDefault();
        if (!editingDocument) return;

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}?id=${editingDocument.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_name: editingDocument.user_name,
                    staff_id: editingDocument.staff_id,
                    document_name: editingDocument.document_name
                })
            });

            const result = await response.json();

            if (result.success) {
                setSuccess('Document updated successfully!');
                setShowEditModal(false);
                setEditingDocument(null);
                fetchDocuments();
            } else {
                setError(result.message || 'Update failed');
            }
        } catch (err) {
            setError('Network error occurred during update');
        } finally {
            setLoading(false);
        }
    };

    // Delete document
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this document?')) return;

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}?id=${id}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (result.success) {
                setSuccess('Document deleted successfully!');
                fetchDocuments();
            } else {
                setError(result.message || 'Delete failed');
            }
        } catch (err) {
            setError('Network error occurred during deletion');
        } finally {
            setLoading(false);
        }
    };

    // Download document
    const handleDownload = async (id, filename) => {
        try {
            const response = await fetch(`${API_BASE_URL}?id=${id}&action=download`);

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                setSuccess('Document downloaded successfully!');
            } else {
                setError('Download failed');
            }
        } catch (err) {
            setError('Network error occurred during download');
        }
    };

    // Format file size
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Clear messages
    const clearMessages = () => {
        setError('');
        setSuccess('');
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            clearMessages();
        }, 5000);
        return () => clearTimeout(timer);
    }, [error, success]);


    const handleView = async (id, filename) => {
    setLoading(true);
    try {
        // Add action=view parameter to indicate we want to view the file
        const response = await fetch(`${API_BASE_URL}?id=${id}&action=view`);
        
        // Check if response is OK
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || 'Failed to load document for viewing');
        }

        // Get content type from response headers
        const contentType = response.headers.get('content-type');
        setDocumentType(contentType);

        // Handle different content types
        if (contentType && contentType.includes('image/')) {
            // For images, create blob URL
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setDocumentContent(url);
        } else if (contentType && contentType.includes('application/pdf')) {
            // For PDFs, create blob URL
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setDocumentContent(url);
        } else if (contentType && (contentType.includes('text/') || contentType.includes('application/json'))) {
            // For text files, read as text
            const text = await response.text();
            setDocumentContent(text);
        } else {
            // For other file types, try to download or show message
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            
            // If it's a JSON response (error case), try to parse it
            if (filename.endsWith('.json') || contentType?.includes('application/json')) {
                const text = await blob.text();
                try {
                    const jsonData = JSON.parse(text);
                    throw new Error(jsonData.message || 'Cannot display this file type. Please download it instead.');
                } catch {
                    setDocumentContent('Cannot display this file type. Please download it instead.');
                }
            } else {
                setDocumentContent(url);
            }
        }

        setViewingDocument({ id, filename });
        setShowViewModal(true);
        setZoomLevel(100);
    } catch (err) {
        setError(err.message || 'Network error occurred while loading document');
        setShowViewModal(false);
    } finally {
        setLoading(false);
    }
};

    // Add zoom control functions
    const handleZoomIn = () => {
        setZoomLevel(prev => Math.min(prev + 25, 300));
    };

    const handleZoomOut = () => {
        setZoomLevel(prev => Math.max(prev - 25, 25));
    };

    const handleZoomReset = () => {
        setZoomLevel(100);
    };

    const renderDocumentContent = () => {
        if (!documentContent) return <div className="text-gray-400">Loading...</div>;

        if (documentType && documentType.includes('image/')) {
            return (
                <img
                    src={documentContent}
                    alt={viewingDocument?.filename}
                    style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}
                    className="max-w-full h-auto"
                />
            );
        } else if (documentType && documentType.includes('application/pdf')) {
            return (
                <iframe
                    src={documentContent}
                    style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}
                    className="w-full h-96 border border-gray-700 rounded"
                    title={viewingDocument?.filename}
                />
            );
        } else {
            // For text files
            return (
                <pre
                    style={{ fontSize: `${zoomLevel}%` }}
                    className="whitespace-pre-wrap text-gray-300 bg-gray-800 p-4 rounded border border-gray-700 max-h-96 overflow-auto"
                >
                    {documentContent}
                </pre>
            );
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="bg-gray-900 border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Machine Specification and Job Drawings</h1>
                            <p className="text-gray-400 mt-1">Manage and organize your documents efficiently</p>
                        </div>
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Plus size={20} />
                            Upload Document
                        </button>
                    </div>
                </div>
            </div>

            {/* Alerts */}
            {(error || success) && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    {error && (
                        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <AlertCircle size={20} />
                                {error}
                            </div>
                            <button onClick={clearMessages} className="text-red-300 hover:text-red-100">
                                <X size={16} />
                            </button>
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-900/50 border border-green-700 text-green-300 px-4 py-3 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CheckCircle size={20} />
                                {success}
                            </div>
                            <button onClick={clearMessages} className="text-green-300 hover:text-green-100">
                                <X size={16} />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Filters */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                        <div className="flex items-center gap-2 text-gray-300">
                            <Filter size={20} />
                            <span className="font-medium">Filters</span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 flex-1">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search by user name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Filter by Staff ID..."
                                    value={filterStaffId}
                                    onChange={(e) => setFilterStaffId(e.target.value)}
                                    className="w-full sm:w-48 pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <button
                                onClick={fetchDocuments}
                                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <RefreshCw size={16} />
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Documents Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : documents.length === 0 ? (
                    <div className="text-center py-20">
                        <FileText size={64} className="mx-auto text-gray-600 mb-4" />
                        <h3 className="text-xl font-medium text-gray-300 mb-2">No documents found</h3>
                        <p className="text-gray-500">Upload your first document to get started</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {documents.map((doc) => (
                            <div key={doc.id} className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all hover:shadow-xl">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="bg-blue-600 p-3 rounded-lg">
                                        <FileText size={24} className="text-white" />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingDocument(doc);
                                                setShowEditModal(true);
                                            }}
                                            className="text-gray-400 hover:text-blue-400 transition-colors"
                                        >
                                            <Edit3 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(doc.id)}
                                            className="text-gray-400 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="font-semibold text-white mb-2 truncate" title={doc.document_name}>
                                    {doc.document_name}
                                </h3>

                                <div className="space-y-2 text-sm text-gray-400 mb-4">
                                    <div className="flex items-center gap-2">
                                        <User size={14} />
                                        <span className="truncate">{doc.user_name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Eye size={14} />
                                        <span>Staff ID: {doc.staff_id}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <HardDrive size={14} />
                                        <span>{formatFileSize(doc.file_size)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} />
                                        <span>{formatDate(doc.upload_date)}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleView(doc.id, doc.original_filename)}
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors"
                                    >
                                        <Eye size={14} />
                                        View Doc
                                    </button>
                                    <button
                                        onClick={() => handleDownload(doc.id, doc.original_filename)}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors"
                                    >
                                        <Download size={14} />
                                        Download
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-800">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">Upload Document</h3>
                            <button
                                onClick={() => setShowUploadModal(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">User Name</label>
                                <input
                                    type="text"
                                    value={uploadData.user_name}
                                    onChange={(e) => setUploadData({ ...uploadData, user_name: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Staff ID</label>
                                <input
                                    type="text"
                                    value={uploadData.staff_id}
                                    onChange={(e) => setUploadData({ ...uploadData, staff_id: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Document Name</label>
                                <input
                                    type="text"
                                    value={uploadData.document_name}
                                    onChange={(e) => setUploadData({ ...uploadData, document_name: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Document File</label>
                                <input
                                    type="file"
                                    onChange={(e) => setUploadData({ ...uploadData, document: e.target.files[0] })}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                    required
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowUploadModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleUpload}
                                    disabled={loading}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    ) : (
                                        <>
                                            <Upload size={16} />
                                            Upload
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && editingDocument && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-800">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">Edit Document</h3>
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setEditingDocument(null);
                                }}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">User Name</label>
                                <input
                                    type="text"
                                    value={editingDocument.user_name}
                                    onChange={(e) => setEditingDocument({ ...editingDocument, user_name: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Staff ID</label>
                                <input
                                    type="text"
                                    value={editingDocument.staff_id}
                                    onChange={(e) => setEditingDocument({ ...editingDocument, staff_id: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Document Name</label>
                                <input
                                    type="text"
                                    value={editingDocument.document_name}
                                    onChange={(e) => setEditingDocument({ ...editingDocument, document_name: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setEditingDocument(null);
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleUpdate}
                                    disabled={loading}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    ) : (
                                        <>
                                            <Edit3 size={16} />
                                            Update
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* View Modal */}
            {showViewModal && viewingDocument && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-900 rounded-xl w-full max-w-4xl max-h-[90vh] border border-gray-800 flex flex-col">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-6 border-b border-gray-800">
                            <div>
                                <h3 className="text-xl font-bold text-white">{viewingDocument.filename}</h3>
                                <p className="text-gray-400 text-sm">Document Viewer</p>
                            </div>

                            {/* Zoom Controls */}
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-2">
                                    <button
                                        onClick={handleZoomOut}
                                        className="text-gray-400 hover:text-white transition-colors p-1"
                                        title="Zoom Out"
                                    >
                                        <ZoomOut size={16} />
                                    </button>
                                    <span className="text-gray-300 text-sm min-w-[3rem] text-center">
                                        {zoomLevel}%
                                    </span>
                                    <button
                                        onClick={handleZoomIn}
                                        className="text-gray-400 hover:text-white transition-colors p-1"
                                        title="Zoom In"
                                    >
                                        <ZoomIn size={16} />
                                    </button>
                                    <button
                                        onClick={handleZoomReset}
                                        className="text-gray-400 hover:text-white transition-colors p-1 ml-2"
                                        title="Reset Zoom"
                                    >
                                        <RotateCcw size={16} />
                                    </button>
                                </div>

                                <button
                                    onClick={() => {
                                        setShowViewModal(false);
                                        setViewingDocument(null);
                                        setDocumentContent('');
                                        setDocumentType('');
                                        if (documentContent && documentContent.startsWith('blob:')) {
                                            URL.revokeObjectURL(documentContent);
                                        }
                                    }}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 p-6 overflow-auto">
                            <div className="flex justify-center">
                                <div className="overflow-auto max-w-full">
                                    {loading ? (
                                        <div className="flex justify-center items-center py-20">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                        </div>
                                    ) : (
                                        renderDocumentContent()
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-gray-800">
                            <div className="flex justify-between items-center">
                                <div className="text-gray-400 text-sm">
                                    Use zoom controls to adjust view size
                                </div>
                                <button
                                    onClick={() => handleDownload(viewingDocument.id, viewingDocument.filename)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
                                >
                                    <Download size={16} />
                                    Download
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Document;