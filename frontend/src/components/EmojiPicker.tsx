import EmojiPickerReact, { EmojiClickData } from 'emoji-picker-react';

interface CustomEmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

export const CustomEmojiPicker = ({ onSelect, onClose }: CustomEmojiPickerProps) => {
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onSelect(emojiData.emoji);
  };

  return (
    <div className="absolute bottom-16 left-4 z-50">
      <EmojiPickerReact 
        onEmojiClick={handleEmojiClick}
        width={300}
        height={400}
      />
      <button 
        onClick={onClose}
        className="text-sm text-gray-500 mt-2 hover:text-gray-700"
      >
        Close
      </button>
    </div>
  );
};