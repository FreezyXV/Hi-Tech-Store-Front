import React from 'react';
import { useDispatch } from 'react-redux';
import { addToWishlist } from '../features/wishlistSlice';

const WishlistButton = ({ productId }) => {
  const dispatch = useDispatch();

  const handleAddToWishlist = () => {
    dispatch(addToWishlist(productId));
    alert('Product added to wishlist');
  };

  return (
    <button onClick={handleAddToWishlist}>
      Add to Wishlist
    </button>
  );
};

export default WishlistButton;
