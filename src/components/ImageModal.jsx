import React from 'react';
import "../assets/productPage.css"; 

const ImageModal = ({ images, currentIndex, closeModal, nextImage, prevImage }) => {
  return (
    <div className="image-modal">
      <div className="image-modal-content">
        <button className="close-btn" onClick={closeModal}>
          ×
        </button>
        <div className="modal-images">
          <img src={images[currentIndex]} alt={`Image ${currentIndex + 1}`} className="modal-image" />
          <div className="modal-navigation">
            <button onClick={prevImage} className="prev-btn">
              &#10094;
            </button>
            <button onClick={nextImage} className="next-btn">
              &#10095;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
