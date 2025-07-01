// src/store/slices/authSlice.ts

import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/store"; // Giả sử bạn đã định nghĩa RootState trong file store chính

// Interface cho dữ liệu người dùng
export interface UserData {
  _id: string;
  amount: number,
  email: string;
  fullName: string;
  phone: string;
  roleId: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  roleName: string;
}

export interface AuthState {
  user: UserData | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: true, // Set là true ban đầu để hiển thị loading khi checkAuth chạy lần đầu
  error: null,
};

const authSlice = createSlice({
  name: "auth", // Đổi tên thành 'auth' cho nhất quán
  initialState,
  reducers: {
    // GHI CHÚ: Reducer giờ chỉ cần cập nhật dữ liệu cốt lõi.
    setUser: (state, action: PayloadAction<UserData>) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      // Không cần set loading ở đây, trừ khi có yêu cầu đặc biệt
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateUser: (state, action: PayloadAction<Partial<UserData>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setUser,
  clearUser,
  setLoading,
  setError,
  updateUser,
  clearError,
} = authSlice.actions;

const selectAuthSlice = (state: RootState) => state.auth; // Lấy ra state của slice này

// createSelector sẽ ghi nhớ (memoize) kết quả, chỉ tính toán lại khi input thay đổi.
export const selectCurrentUser = createSelector(
  [selectAuthSlice],
  (authState) => authState.user,
);

export const selectIsAuthenticated = createSelector(
  [selectAuthSlice],
  (authState) => !!authState.user, // Suy ra 'isAuthenticated' từ 'user'
);

export const selectAuthLoading = createSelector(
  [selectAuthSlice],
  (authState) => authState.loading,
);

export const authReducer = authSlice.reducer;
export default authSlice.reducer;
