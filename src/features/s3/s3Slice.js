import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { s3Service } from '../../services/s3Service';

// Async thunks
export const fetchObjects = createAsyncThunk(
  's3/fetchObjects',
  async (_, { rejectWithValue }) => {
    try {
      return await s3Service.listObjects();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const uploadFile = createAsyncThunk(
  's3/uploadFile',
  async ({ file, key }, { rejectWithValue }) => {
    try {
      await s3Service.uploadFile(file, key);
      return { key, size: file.size, lastModified: new Date().toISOString() };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteFile = createAsyncThunk(
  's3/deleteFile',
  async (key, { rejectWithValue }) => {
    try {
      await s3Service.deleteFile(key);
      return key;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const s3Slice = createSlice({
  name: 's3',
  initialState: {
    objects: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchObjects.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchObjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.objects = action.payload;
      })
      .addCase(fetchObjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.objects.push(action.payload);
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.objects = state.objects.filter(obj => obj.Key !== action.payload);
      });
  },
});

export default s3Slice.reducer;
