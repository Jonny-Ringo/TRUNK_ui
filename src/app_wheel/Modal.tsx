// Modal.tsx
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
  }
  
  const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
  
    return (
      
      <div 
        className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex" 
        // onClick={onClose}
      >
        <div 
          className="relative p-8 bg-[#1A1B2D] w-full max-w-md m-auto flex-col flex rounded-lg border-8 border-[#12121C] z-10" 
          onClick={(e) => e.stopPropagation()}
        >
          <span
            className="absolute top-0 right-0 p-4 cursor-pointer"
            onClick={onClose}
          >
            &#x2715;
          </span>
          {children}
        </div>
      </div>
    );
  };
  
  export default Modal;
  