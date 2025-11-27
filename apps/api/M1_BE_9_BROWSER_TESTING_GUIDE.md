# Browser Testing Guide - M1-BE-9 Provider Onboarding

**Date:** 2025-01-11  
**Status:** Ready for Testing

---

## 🚀 Servers Started

### API Server
- **URL:** http://localhost:3001
- **Status:** Running in background
- **Endpoints:**
  - `POST /providers` - Create provider profile
  - `GET /providers/{id}` - Get provider profile
  - `PATCH /providers/{id}` - Update provider profile
  - `POST /messages/attachments` - Upload files

### Frontend Server
- **URL:** http://localhost:3000
- **Status:** Running in background
- **Pages:**
  - `/onboarding/provider/business` - Business details form
  - `/onboarding/provider/credentials` - File upload page

---

## 🧪 Testing Steps

### 1. **Open Browser**
Navigate to: **http://localhost:3000**

### 2. **Register/Login**
- Go to `/auth/register` or `/auth/login`
- Create a new account or log in
- **Important:** Make sure to select **PROVIDER** role during registration

### 3. **Test Provider Creation**
1. Navigate to: **http://localhost:3000/onboarding/provider/business**
2. Fill out the form:
   - Business Name: "Test Provider"
   - Description: "Test description"
   - Location: "Bangkok, Thailand"
   - Languages: Select languages (e.g., English, Thai)
3. Click "Continue" or "Save"
4. **Expected:** Form submits to `POST /providers` endpoint
5. **Check:** Browser DevTools Network tab to see API call

### 4. **Test File Upload**
1. Navigate to: **http://localhost:3000/onboarding/provider/credentials**
2. Drag and drop a file OR click to select:
   - **Allowed types:** PDF, JPEG, PNG, WebP, DOCX, XLSX
   - **Size limit:** 2MB (Free plan), 25MB (Pro), etc.
3. Upload the file
4. **Expected:** File uploads to `POST /messages/attachments` endpoint
5. **Check:** Browser DevTools Network tab to see multipart/form-data request

### 5. **Test Provider Retrieval**
After creating a provider, you can test GET endpoint:
1. Open Browser DevTools Console
2. Run:
   ```javascript
   fetch('http://localhost:3001/providers/{provider-id}', {
     credentials: 'include',
     headers: { 'Content-Type': 'application/json' }
   })
   .then(r => r.json())
   .then(console.log)
   ```
   Replace `{provider-id}` with the actual provider ID from the creation response.

---

## 🔍 What to Check

### Browser DevTools Network Tab
- ✅ **POST /providers** - Should return 201 Created with provider data
- ✅ **POST /messages/attachments** - Should return 200 OK with attachment data
- ✅ **GET /providers/{id}** - Should return 200 OK with provider data
- ✅ **Error responses** - Should match OpenAPI spec (400, 401, 403, 404, 413)

### Console Logs
- ✅ **API Server:** Should show "🚀 API server running on http://localhost:3001"
- ✅ **Frontend:** Should show Next.js dev server running
- ✅ **Errors:** Check for any CORS or authentication errors

### Database
- ✅ **Provider Profile:** Check `ProviderProfile` table for created records
- ✅ **Attachment:** Check `Attachment` table for uploaded files
- ✅ **Audit Log:** Check `AuditLog` table for logged events

---

## 🐛 Troubleshooting

### CORS Errors
- **Issue:** Frontend can't connect to API
- **Fix:** CORS is enabled in `main.ts` - check that API server is running

### Authentication Errors (401)
- **Issue:** "UNAUTHORIZED" errors
- **Fix:** Make sure you're logged in and JWT cookie is set

### File Upload Errors (413)
- **Issue:** "PAYLOAD_TOO_LARGE" error
- **Fix:** File exceeds plan limit (Free: 2MB, Pro: 25MB, etc.)

### Database Connection Errors
- **Issue:** API can't connect to database
- **Fix:** Check `.env` file has correct `DATABASE_URL`

---

## 📊 Expected Results

### Provider Creation
```json
{
  "id": "uuid",
  "userId": "uuid",
  "businessName": "Test Provider",
  "description": "Test description",
  "location": "Bangkok, Thailand",
  "languages": ["en", "th"],
  "createdAt": "2025-01-11T..."
}
```

### File Upload
```json
{
  "id": "uuid",
  "ownerUserId": "uuid",
  "key": "attachments/uuid/file.pdf",
  "mime": "application/pdf",
  "size": 123456
}
```

---

## ✅ Success Criteria

- [ ] Provider creation form submits successfully
- [ ] Provider data appears in database
- [ ] File upload works with drag-and-drop
- [ ] File appears in database and filesystem
- [ ] Audit logs are created for all operations
- [ ] Error handling works (try invalid data, large files, etc.)

---

**Happy Testing!** 🎉

