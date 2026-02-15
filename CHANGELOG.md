# Changelog

All notable changes to Robitro will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2026-02-15

### Added
- In-memory caching system for API responses (30-second TTL)
- Optimized Prisma connection pool configuration
- Console logging for product loading debugging
- Cache utility module (`server/utils/cache.js`)

### Fixed
- **Home Page Products**: Fixed products not loading on home page
  - Added Vite proxy configuration to forward `/api` requests to backend
  - Removed `scroll-reveal` CSS class that was hiding products
  - Removed non-existent `featured` filter from product queries
- **My Courses Page**: Fixed React key prop warning in course list rendering
- **Orders Page**: Enhanced to display detailed product information inline
- **Profile Page**: Added new profile management page at `/lms/profile`
- **Navbar**: Corrected profile link destination

### Performance
- **Products API**: Reduced response time from 6s to 1.1s (cached requests)
- **Optimized Database Queries**: Removed unnecessary JOIN operations
- **Connection Pool**: Increased max connections to 20 with optimized timeouts

### Changed
- Updated `getAllProducts` to make partner/category includes optional
- Modified product controller to skip cache for admin panel requests
- Updated courses API with caching support
- Improved error handling and logging across API endpoints

## [1.2.0] - Previous Release

### Features
- Initial release with core functionality
- User authentication and authorization
- Course management system
- Product shop with cart functionality
- Order management
- Community features
- Admin panel

---

## Release Notes

### Version 1.3.0 Highlights

This release focuses on **bug fixes** and **performance optimization**:

1. **Fixed Critical UI Issues**
   - Home page products now load correctly from database
   - Resolved proxy configuration issues
   - Fixed CSS rendering problems

2. **5x Performance Improvement**
   - Implemented smart caching strategy
   - Optimized database connection pooling
   - Reduced API response times significantly

3. **Enhanced User Experience**
   - Better error handling
   - Improved loading states
   - Fixed navigation issues

### Upgrade Notes

- No database migrations required
- Server restart recommended to apply connection pool changes
- Cache will automatically warm up on first requests

