import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (userId) => {
    const response = await axios.get(`/api/events/notifications/${userId}`);
    return response.data;
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: { notifications: [], loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
        state.loading = false;
      });
  },
});

export default notificationSlice.reducer;
