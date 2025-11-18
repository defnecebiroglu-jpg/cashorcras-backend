# Frontend-Backend API Connection Setup

## ✅ Completed Setup

### 1. Environment Configuration
- Created `.env.example` with the production API URL
- Updated `client/src/lib/api.ts` to use axios with proper configuration
- Added fallback URL: `https://cashorcras-backend.onrender.com`

### 2. Axios Configuration
- Installed axios dependency
- Created centralized API client with:
  - Base URL configuration
  - Credentials support for session management
  - Request/response interceptors for debugging
  - Error handling

### 3. Updated Login Pages
- ✅ `client/src/pages/admin-login.tsx` - Now uses axios
- ✅ `client/src/pages/team-login.tsx` - Now uses axios
- ✅ `client/src/lib/queryClient.ts` - Added axios support

### 4. API Test Component
- Created `client/src/components/ApiTest.tsx` for testing connections
- Added route `/api-test` to test API connectivity

## 🔧 Manual Setup Required

### 1. Create Environment File
Create `client/.env.local` with:
```env
VITE_API_URL=https://cashorcras-backend.onrender.com
```

### 2. CORS Configuration
Ensure your backend allows CORS for:
- Local development: `http://localhost:5173`
- Production: Your frontend domain

## 🚀 Testing the Connection

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:5173/api-test`

3. Click "Test Health Endpoint" to verify basic connectivity

4. Click "Test Login Endpoint" to verify authentication endpoints

## 📝 Remaining Fetch Calls to Update

The following files still contain `fetch()` calls that should be updated to use the new API client:

### Admin Components
- `client/src/components/admin/password-management.tsx`
- `client/src/components/admin/team-management.tsx`
- `client/src/components/admin/bulk-price-update.tsx`
- `client/src/components/admin/portfolio-overview.tsx`
- `client/src/components/admin/dividend-distribution.tsx`
- `client/src/components/admin/currency-management.tsx`
- `client/src/components/admin/company-management.tsx`
- `client/src/components/admin/financial-overview.tsx`

### Dashboard Components
- `client/src/pages/team-dashboard.tsx`
- `client/src/components/dashboard/currency-desk.tsx`
- `client/src/components/dashboard/startup-desk.tsx`
- `client/src/components/dashboard/header.tsx`

## 🔄 Migration Pattern

Replace this pattern:
```javascript
const response = await fetch("/api/endpoint", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});
const result = await response.json();
```

With this:
```javascript
import api from "@/lib/api";

const response = await api.post("/api/endpoint", data);
const result = response.data;
```

## 🛠️ Available API Methods

```javascript
import api from "@/lib/api";

// GET request
const response = await api.get("/api/endpoint");

// POST request
const response = await api.post("/api/endpoint", data);

// PUT request
const response = await api.put("/api/endpoint", data);

// DELETE request
const response = await api.delete("/api/endpoint");

// Custom request
const response = await api.request({
  method: "PATCH",
  url: "/api/endpoint",
  data: data
});
```

## 🐛 Troubleshooting

1. **CORS Errors**: Ensure backend allows your frontend domain
2. **Environment Variables**: Check that `.env.local` is created and loaded
3. **Network Issues**: Use the API test component to debug connectivity
4. **Session Issues**: Ensure `withCredentials: true` is set (already configured)

## 📋 Next Steps

1. Create the `.env.local` file
2. Test the API connection using `/api-test`
3. Gradually migrate remaining fetch calls to use the new API client
4. Remove the test component when done
