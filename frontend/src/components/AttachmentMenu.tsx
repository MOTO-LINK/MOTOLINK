import { useDropzone } from 'react-dropzone';

interface AttachmentMenuProps {
  onSelect: (file: File, type: 'image' | 'document') => void;
}

export const AttachmentMenu = ({ onSelect }: AttachmentMenuProps) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg'],
      'application/*': ['.pdf', '.doc', '.docx']
    },
    onDrop: acceptedFiles => {
      if (acceptedFiles.length > 0) {
        const type = acceptedFiles[0].type.startsWith('image') ? 'image' : 'document';
        onSelect(acceptedFiles[0], type);
      }
    }
  });

  return (
    <div className="absolute bottom-16 left-16 bg-white border rounded-lg shadow-lg p-4 z-50 w-64">
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p className="text-center p-2 border-2 border-dashed rounded mb-2">
          Drag & drop files here, or click to select
        </p>
      </div>
      <button 
        onClick={() => {/* Camera implementation would go here */}}
        className="flex items-center p-2 hover:bg-gray-100 rounded w-full mt-2"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Use Camera
      </button>
    </div>
  );
};