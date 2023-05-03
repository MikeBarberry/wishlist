import { useContext } from 'react';
import { WishlistContext } from '..';

export default function useWishlist() {
  const state = useContext(WishlistContext);
  return { user: state.user, add: state.add, page: state.page, useForm };
}
