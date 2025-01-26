import { configureStore } from '@reduxjs/toolkit';
import s3Reducer from './features/s3/s3Slice';

export const store = configureStore({
  reducer: {
    s3: s3Reducer,
  },
});
