# Cookie Authentication Troubleshooting Guide

## Issue: Login successful but not redirecting to home page

This issue occurs when cookies are not being set properly in the production environment.

## Root Causes & Solutions

### 1. **Secure Cookie Issue (Most Common)**
**Problem**: In production, cookies with `secure: true` require HTTPS, but your server runs on HTTP.

**Solution**: Updated `lib/utils.ts` to detect HTTPS automatically:
```javascript
const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
const isProduction = process.env.NODE_ENV === 'production';

Cookies.set(name, value, {
  secure: isProduction && isHttps, // Only secure if HTTPS
  sameSite: 'lax',
  path: '/',
  expires: 7,
});
```

### 2. **Missing Cookie Configuration**
**Problem**: Cookies missing essential properties like path, expiration, etc.

**Solution**: Added proper cookie configuration:
- `path: '/'` - Available on all routes
- `expires: 7` - 7 days expiration
- `sameSite: 'lax'` - CSRF protection

### 3. **Domain Issues**
**Problem**: Domain mismatch between frontend and backend.

**Solution**: Let browser handle domain automatically by not setting explicit domain.

## Debugging Steps

### 1. **Check Browser Console**
After login, open browser console and look for:
```
Cookie Debug Info:
- Protocol: http:// or https://
- Host: your-domain.com:3000
- Domain: your-domain.com
- Access Token: [token value or undefined]
- All Cookies: [all cookies]
```

### 2. **Check Network Tab**
- Look for `Set-Cookie` headers in login response
- Verify cookie is being set by server

### 3. **Check Application Tab**
- Go to Application/Storage tab in DevTools
- Check Cookies section
- Look for `tp.access-token` cookie

### 4. **Environment Variables**
Make sure your `.env.production` has:
```bash
NEXTAUTH_URL=http://your-server-ip:3000
NODE_ENV=production
```

## Quick Fixes

### Fix 1: Force HTTP Cookies (Temporary)
If you're running on HTTP, temporarily modify `lib/utils.ts`:
```javascript
export const setCookie = (name: string, value: string) => {
  Cookies.set(name, value, {
    secure: false, // Force false for HTTP
    sameSite: 'lax',
    path: '/',
    expires: 7,
  });
};
```

### Fix 2: Add Debug Logging
The updated code includes debug logging. Check browser console after login.

### Fix 3: Clear All Cookies
Sometimes old cookies cause issues:
```javascript
// In browser console
document.cookie.split(";").forEach(function(c) { 
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
});
```

## Production Deployment Checklist

1. ✅ **Environment File**: Copy `env.example` to `.env.production`
2. ✅ **NEXTAUTH_URL**: Set to your server URL
3. ✅ **HTTPS**: If using HTTPS, ensure SSL certificates are properly configured
4. ✅ **Domain**: Ensure frontend and backend are on same domain/subdomain
5. ✅ **Network**: Verify containers can communicate via `teryaq_teryaq-net`

## Testing Commands

```bash
# Check if containers are running
docker-compose ps

# Check logs for errors
docker-compose logs -f teryaq-frontend

# Test cookie setting manually
# Open browser console on your site and run:
debugCookies()
```

## Common Server Configurations

### HTTP Server (Port 3000)
```bash
NEXTAUTH_URL=http://your-server-ip:3000
NODE_ENV=production
```

### HTTPS Server (Port 443)
```bash
NEXTAUTH_URL=https://your-domain.com
NODE_ENV=production
```

### With Nginx Proxy
```bash
NEXTAUTH_URL=http://your-domain.com
NODE_ENV=production
```

## Still Having Issues?

1. **Check server logs**: `docker-compose logs -f teryaq-frontend`
2. **Verify network**: Ensure containers are on same network
3. **Test API**: Verify backend API is accessible from frontend
4. **Browser compatibility**: Test in different browsers
5. **Clear cache**: Hard refresh (Ctrl+F5) after changes

The updated code should resolve the cookie issues. The main fix is the automatic HTTPS detection for secure cookies.
