import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BiChat, BiFile, BiX, BiDownload } from 'react-icons/bi';
import { 
  FaFileWord, FaFilePdf, FaFileExcel, FaFileImage, 
  FaFileAudio, FaFileVideo, FaFileArchive, FaFileCode,
  FaFileCsv, FaFileAlt
} from 'react-icons/fa';

const ChatModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLikeDislikeUpdate, setIsLikeDislikeUpdate] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);


  const getFileIcon = (fileType) => {
    const fileTypes = {
      'application/pdf': <FaFilePdf className="w-8 h-8 text-red-500" />,
      'application/msword': <FaFileWord className="w-8 h-8 text-blue-500" />,
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': <FaFileWord className="w-8 h-8 text-blue-500" />,
      'application/vnd.ms-excel': <FaFileExcel className="w-8 h-8 text-green-500" />,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': <FaFileExcel className="w-8 h-8 text-green-500" />,
      'text/csv': <FaFileCsv className="w-8 h-8 text-green-600" />,
      'application/json': <FaFileCode className="w-8 h-8 text-yellow-500" />,
      'text/plain': <FaFileAlt className="w-8 h-8 text-gray-500" />,
      'application/zip': <FaFileArchive className="w-8 h-8 text-yellow-600" />,
      'application/x-rar-compressed': <FaFileArchive className="w-8 h-8 text-yellow-600" />,
    };

    if (fileType.startsWith('image/')) {
      return <FaFileImage className="w-8 h-8 text-purple-500" />;
    }
    if (fileType.startsWith('video/')) {
      return <FaFileVideo className="w-8 h-8 text-blue-600" />;
    }
    if (fileType.startsWith('audio/')) {
      return <FaFileAudio className="w-8 h-8 text-pink-500" />;
    }
    if (fileType.startsWith('text/')) {
      return <FaFileCode className="w-8 h-8 text-gray-600" />;
    }

    return fileTypes[fileType] || <BiFile className="w-8 h-8 text-gray-500" />;
  };

  const getFileTypeDescription = (fileType) => {
    const typeMap = {
      'application/pdf': 'PDF Document',
      'application/msword': 'Word Document',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document',
      'application/vnd.ms-excel': 'Excel Spreadsheet',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel Spreadsheet',
      'text/csv': 'CSV File',
      'application/json': 'JSON File',
      'text/plain': 'Text File',
      'application/zip': 'ZIP Archive',
      'application/x-rar-compressed': 'RAR Archive',
      'image/jpeg': 'JPEG Image',
      'image/png': 'PNG Image',
      'image/gif': 'GIF Image',
      'image/svg+xml': 'SVG Image',
      'video/mp4': 'MP4 Video',
      'video/quicktime': 'QuickTime Video',
      'audio/mpeg': 'MP3 Audio',
      'audio/wav': 'WAV Audio',
    };

    if (fileType.startsWith('image/')) return 'Image File';
    if (fileType.startsWith('video/')) return 'Video File';
    if (fileType.startsWith('audio/')) return 'Audio File';
    if (fileType.startsWith('text/')) return 'Text File';

    return typeMap[fileType] || 'File';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    return `${month} ${day}, ${year} ${hours}:${minutes} ${ampm}`;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const downloadFile = (file) => {
    const fileBlob = file.url ? file.url : new Blob([file.data], { type: file.file_type });
    const fileName = file.name || 'downloaded_file';
    const link = document.createElement('a');
    link.href = URL.createObjectURL(fileBlob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(file);
      
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setMediaPreview({
            type: 'image',
            url: reader.result,
            name: file.name,
            size: file.size,
            fileType: file.type,
            icon: getFileIcon(file.type),
            typeDescription: getFileTypeDescription(file.type),
            lastModified: new Date(file.lastModified).toLocaleString()
          });
        };
        reader.readAsDataURL(file);
      } else if (file.type.startsWith('video/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setMediaPreview({
            type: 'video',
            url: reader.result,
            name: file.name,
            size: file.size,
            fileType: file.type,
            icon: getFileIcon(file.type),
            typeDescription: getFileTypeDescription(file.type),
            lastModified: new Date(file.lastModified).toLocaleString()
          });
        };
        reader.readAsDataURL(file);
      } else {
        setMediaPreview({
          type: 'file',
          name: file.name,
          size: file.size,
          fileType: file.type,
          icon: getFileIcon(file.type),
          typeDescription: getFileTypeDescription(file.type),
          lastModified: new Date(file.lastModified).toLocaleString()
        });
      }
    }
  };

  const removeMedia = () => {
    setMedia(null);
    setMediaPreview(null);
  };

  const MediaPreview = ({ preview }) => {
    if (!preview) return null;

    const PreviewHeader = () => (
      <div className="flex items-center justify-between p-2 bg-gray-50 border-b">
        <div className="flex items-center space-x-2">
          {preview.icon}
          <div>
            <p className="font-medium text-sm truncate max-w-xs">{preview.name}</p>
            <p className="text-xs text-gray-500">{preview.typeDescription}</p>
          </div>
        </div>
        <button
          onClick={removeMedia}
          className="p-1 hover:bg-gray-200 rounded-full"
          title="Remove file"
        >
          <BiX className="w-5 h-5" />
        </button>
      </div>
    );

    const PreviewDetails = () => (
      <div className="px-3 py-2 space-y-1">
        <p className="text-xs text-gray-600">
          Size: {formatFileSize(preview.size)}
        </p>
        <p className="text-xs text-gray-600">
          Last modified: {preview.lastModified}
        </p>
      </div>
    );

    return (
      <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
        <PreviewHeader />
        {preview.type === 'image' && (
          <div className="relative group">
            <img 
              src={preview.url}
              alt={preview.name}
              className="max-h-12 w-full object-contain bg-gray-50 p-2 overflow-hidden"
            />
          </div>
        )}
        {preview.type === 'video' && (
          <div className="relative group">
            <video 
              src={preview.url}
              controls
              className="max-h-12 w-full bg-gray-50 p-2 overflow-hidden"
            />
          </div>
        )}
        <PreviewDetails />
      </div>
    );
  };

  const FileDisplay = ({ file }) => {
    const fileIcon = getFileIcon(file.file_type);
    const typeDescription = getFileTypeDescription(file.file_type);
    const isPreviewable = file.file_type.startsWith('image/') || file.file_type.startsWith('video/');

    return (
      <div className="mt-2 border rounded-lg overflow-hidden bg-white shadow-sm">
        <div className="flex items-center justify-between p-2 bg-gray-50 border-b">
          <div className="flex items-center space-x-2">
            {fileIcon}
            <div
              style={{ maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              <p className="font-medium text-sm">{file.file_name}</p>
              <p className="text-xs text-gray-500">{typeDescription}</p>
            </div>
          </div>
          <button
            onClick={() => handleFileDownload(file)}
            className="p-1 hover:bg-gray-200 rounded-full"
            title="Download file"
          >
            <BiDownload className="w-5 h-5" />
          </button>
        </div>


        {isPreviewable && (
          <div className="p-2 bg-gray-50">
            {file.file_type.startsWith('image/') && (
              <img
                src={`data:${file.file_type};base64,${file.file_data}`}
                alt={file.file_name}
                className="max-h-48 w-full object-contain cursor-pointer"
                onClick={() => {
                  setSelectedImage(`data:${file.file_type};base64,${file.file_data}`);
                  setIsImageModalOpen(true);
                }}
              />
            )}
            {file.file_type.startsWith('video/') && (
              <video
                src={`data:${file.file_type};base64,${file.file_data}`}
                controls
                className="max-h-48 w-full"
              />
            )}
          </div>
        )}
        <div className="px-3 py-2">
          <p className="text-xs text-gray-600">
            Size: {formatFileSize(file.file_size)}
          </p>
        </div>
      </div>
    );
  };

  // Keep existing functionality
  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isLikeDislikeUpdate) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsLikeDislikeUpdate(false);
  }, [messages]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [message, isOpen]);

  const fetchMessages = async (isReactionUpdate = false) => {
    try {
      const token = localStorage.getItem('token');
      const projectId = localStorage.getItem('project_id');
      
      const response = await axios.post(
        'http://localhost:3001/comment/messages',
        { project_id: projectId },
        { headers: { Authorization: token } }
      );
      
      setMessages(response.data);
      setIsLikeDislikeUpdate(isReactionUpdate);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const ImageModal = ({ imageUrl, onClose }) => {
    if (!imageUrl) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="relative">
          <img src={imageUrl} alt="Enlarged view" className="max-w-screen-md max-h-screen-md object-contain" />
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-white bg-gray-700 rounded-full p-2"
          >
            <BiX className="w-6 h-6" />
          </button>
        </div>
      </div>
    );
  };
  

  const handleLikeDislike = async (commentId, isLike) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:3001/comment/like-dislike',
        { 
          like: isLike ? 1 : 0, 
          comment_id: commentId 
        },
        { headers: { Authorization: token } }
      );
      
      fetchMessages(true);
    } catch (error) {
      console.error('Error updating like/dislike:', error);
    }
  };

  const handleFileDownload = (file) => {
    try {
      const byteCharacters = atob(file.file_data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: file.file_type });
  
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.file_name;
      document.body.appendChild(a);
      a.click();
  
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const sendMessage = async () => {
    if (message.trim() !== '' || media) {
      try {
        const token = localStorage.getItem('token');
        const projectId = localStorage.getItem('project_id');
        const creatorId = localStorage.getItem('userName');
        
        const requestBody = {
          project_id: projectId,
          creator_id: creatorId,
          content: message.trim()
        };

        if (media) {
          const reader = new FileReader();
          reader.onload = async (e) => {
            requestBody.file = {
              fileName: media.name,
              fileType: media.type,
              fileSize: media.size,
              data: e.target.result.split(',')[1]
            };
            await sendRequestToServer(requestBody, token);
          };
          reader.readAsDataURL(media);
        } else {
          await sendRequestToServer(requestBody, token);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const sendRequestToServer = async (requestBody, token) => {
    try {
      await axios.post(
        'http://localhost:3001/comment/send-message',
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            'authorization': token
          }
        }
      );
      
      setMessage('');
      setMedia(null);
      setMediaPreview(null);
      fetchMessages();
    } catch (error) {
      console.error('Error sending message to server:', error);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(prevIsOpen => !prevIsOpen)} 
        className="bg-blue-950 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded-lg shadow-lg"
        aria-label="Toggle Chat"
        title="Toggle Chat"
      >
        <BiChat className="w-5 h-5 inline" />
      </button>

      {isOpen && (
        <div className="fixed z-10 top-20 right-5 bg-transparent">
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="bg-white rounded-2xl shadow-2xl sm:max-w-md w-full overflow-hidden border border-gray-200">
              <div className="bg-blue-950 px-4 py-4 border-b border-gray-950 shadow-md">
                <h3 className="text-lg font-bold text-white">Chat Room</h3>
              </div>
              <div
                className="px-4 py-5 h-80 overflow-y-auto space-y-3 bg-gray-50"
                ref={messagesContainerRef}
              >
                {messages.map((msg, index) => (
                  <div
                    key={msg._id}
                    className={`p-3 rounded-lg shadow-sm ${
                      msg.creator_id === localStorage.getItem('userName')
                        ? 'bg-blue-100 text-gray-800 ml-auto'
                        : 'bg-gray-100 text-gray-800 mr-auto'
                    }`}
                    style={{ maxWidth: '70%', position: 'relative' }}
                  >
                    <div className="flex justify-between items-start">
                      <p className="font-semibold text-sm text-gray-700">{msg.creator_id}</p>
                      <p className="text-xs text-gray-500 absolute bottom-1 right-4">
                        {formatDate(msg.created_at)}
                      </p>
                    </div>
                    
                    {msg.content && (
                      <p className="mt-1 text-gray-800">{msg.content}</p>
                    )}
                    
                    {msg.file_name && (
                      <FileDisplay file={msg} />
                    )}
                    
                    <div className="flex items-center space-x-4 mt-2">
                      <button 
                        onClick={() => handleLikeDislike(msg._id, true)}
                        className="text-sm flex items-center space-x-1 hover:bg-gray-200 p-1 rounded-full"
                      >
                        <span>👍</span>
                        <span>{msg.likes.length}</span>
                      </button>
                      <button 
                        onClick={() => handleLikeDislike(msg._id, false)}
                        className="text-sm flex items-center space-x-1 hover:bg-gray-200 p-1 rounded-full"
                      >
                        <span>👎</span>
                        <span>{msg.dislike.length}</span>
                      </button>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="bg-gray-200 px-4 py-4 flex flex-col border-t border-gray-300">
                {mediaPreview && (
                  <div className="mb-3">
                    <MediaPreview preview={mediaPreview} />
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-grow border border-gray-300 rounded-full p-2 px-4 text-gray-800"
                    placeholder="Type a message..."
                  />
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="file"
                      onChange={handleMediaChange}
                      className="hidden"
                      accept="*/*"
                    />
                    <span className="bg-blue-950 text-white rounded-full p-2 shadow-md hover:bg-blue-900">
                      📎
                    </span>
                  </label>
                  <button
                    onClick={sendMessage}
                    className="bg-blue-950 text-white rounded-full px-6 py-2 shadow-lg hover:bg-blue-900"
                  >
                    Send
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-600 p-2 hover:bg-gray-200 rounded-full"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isImageModalOpen && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={() => setIsImageModalOpen(false)}
        />
      )}
    </>
  );
};

export default ChatModal;