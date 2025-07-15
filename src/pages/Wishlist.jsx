import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromWishlist, clearWishlist } from '../redux/wishlistSlice';

const Wishlist = () => {
  const items = useSelector((state) => state.wishlist.items);
  const dispatch = useDispatch();

  return (
    <div className="container mt-4">
      <h2>My Wishlist</h2>
      {items.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <>
          <button className="btn btn-danger mb-3" onClick={() => dispatch(clearWishlist())}>Clear Wishlist</button>
          <div className="row">
            {items.map((item) => (
              <div className="col-md-4 mb-3" key={item.id}>
                <div className="card">
                  {item.image && <img src={item.image} className="card-img-top wishlist-img" alt={item.title} />}
                  <div className="card-body">
                    <h5 className="card-title">{item.title}</h5>
                    <p className="card-text">{item.price && `$${item.price}`}</p>
                    <button className="btn btn-outline-danger" onClick={() => dispatch(removeFromWishlist(item.id))}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Wishlist; 