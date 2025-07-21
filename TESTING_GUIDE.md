# 📱 BrewDash App Testing Guide

## 🔐 Authentication Flow Testing

### First Time User Flow
1. **Welcome Screen**
   - ✅ Check if welcome screen shows with brewery logo
   - ✅ Verify animation plays correctly
   - ✅ Confirm automatic navigation to login after 3 seconds

2. **Login Screen**
   - ✅ Enter phone number (10 digits)
   - ✅ Tap "Send OTP" button
   - ✅ Verify OTP input field appears
   - ✅ Enter OTP "1234"
   - ✅ Tap "Verify & Login" button
   - ✅ Confirm navigation to age verification

3. **Age Verification Screen**
   - ✅ Tap "Upload your ID" button
   - ✅ Select image from gallery
   - ✅ Verify image preview shows
   - ✅ Tap "Submit for Verification"
   - ✅ Confirm navigation to location permission

4. **Location Permission Screen**
   - ✅ Tap "Allow Location Access"
   - ✅ Grant location permission in system dialog
   - ✅ Confirm navigation to home screen

### Returning User Flow
1. **App Launch**
   - ✅ App should directly navigate to home screen
   - ✅ Skip welcome, login, and verification screens

## 🏠 Home Screen Testing

### Navigation & UI
1. **Header Section**
   - ✅ Greeting message shows correct time of day
   - ✅ Notification icon is clickable
   - ✅ Search bar accepts input
   - ✅ Search functionality works

2. **Banner Carousel**
   - ✅ Banners auto-scroll every 4 seconds
   - ✅ Pagination dots update correctly
   - ✅ Banners are clickable
   - ✅ Manual swipe navigation works

3. **Category Filters**
   - ✅ All categories (All, Lager, Ale, Stout, Wheat, IPA) are visible
   - ✅ Selecting category filters beer list
   - ✅ Active category is highlighted
   - ✅ Scroll to see all categories

4. **Beer Listings**
   - ✅ All beers display with correct information
   - ✅ Images load properly
   - ✅ Rating stars display correctly
   - ✅ Prices show correctly
   - ✅ Add to cart button works

### Interactions
1. **Beer Card Actions**
   - ✅ Tap beer card to view details
   - ✅ Tap "+" button to add to cart
   - ✅ Toast message appears on add to cart
   - ✅ Animation plays on button press

2. **Search & Filter**
   - ✅ Search by beer name
   - ✅ Search by brand name
   - ✅ Filter by category
   - ✅ Sort by name, price, rating
   - ✅ Clear search functionality

## 🛒 Cart Testing

### Cart Operations
1. **Add Items**
   - ✅ Add beer to cart from home screen
   - ✅ Add beer to cart from product details
   - ✅ Quantity updates correctly
   - ✅ Cart badge shows item count

2. **View Cart**
   - ✅ Navigate to cart screen
   - ✅ All added items display
   - ✅ Quantities are correct
   - ✅ Prices calculate correctly

3. **Update Cart**
   - ✅ Increase item quantity
   - ✅ Decrease item quantity
   - ✅ Remove item from cart
   - ✅ Clear entire cart

## 👤 Profile Testing

### Profile Management
1. **View Profile**
   - ✅ Navigate to profile screen
   - ✅ User information displays
   - ✅ Profile picture shows/placeholder

2. **Edit Profile**
   - ✅ Edit name field
   - ✅ Edit email field
   - ✅ Save changes
   - ✅ Cancel changes

3. **Settings**
   - ✅ View addresses
   - ✅ Help section
   - ✅ Logout functionality

## 🧪 Edge Cases & Error Handling

### Network Issues
1. **No Internet**
   - ✅ App handles offline state
   - ✅ Error messages appear
   - ✅ Retry functionality works

2. **Slow Network**
   - ✅ Loading states show
   - ✅ Timeout handling
   - ✅ User feedback provided

### Input Validation
1. **Phone Number**
   - ✅ Accepts only 10 digits
   - ✅ Shows error for invalid format
   - ✅ Prevents submission with invalid input

2. **OTP Validation**
   - ✅ Accepts only 4 digits
   - ✅ Shows error for incorrect OTP
   - ✅ Resend OTP functionality

### Storage & State
1. **Data Persistence**
   - ✅ User stays logged in after app restart
   - ✅ Cart items persist
   - ✅ User preferences saved

2. **State Management**
   - ✅ Authentication state updates correctly
   - ✅ Cart state synchronizes
   - ✅ User data updates properly

## 📊 Performance Testing

### Loading Times
1. **App Launch**
   - ✅ App launches within 3 seconds
   - ✅ Welcome screen appears quickly
   - ✅ Smooth transitions between screens

2. **Image Loading**
   - ✅ Beer images load efficiently
   - ✅ Banner images load quickly
   - ✅ Placeholder images while loading

### Memory Usage
1. **Navigation**
   - ✅ Smooth navigation between screens
   - ✅ No memory leaks
   - ✅ Efficient screen transitions

## 🔧 Common Issues & Solutions

### Authentication Issues
- **Problem**: OTP not working
- **Solution**: Use OTP "1234" for testing
- **Check**: Login screen OTP validation logic

### Navigation Issues
- **Problem**: Screen not navigating
- **Solution**: Check router.replace() calls
- **Check**: Ensure proper expo-router setup

### Storage Issues
- **Problem**: Data not persisting
- **Solution**: Check AsyncStorage implementation
- **Check**: Verify error handling in storage operations

### UI Issues
- **Problem**: Buttons not responding
- **Solution**: Check TouchableOpacity onPress handlers
- **Check**: Verify proper event propagation

## 📱 Testing Credentials

### Test User Accounts
- **New User**: Any 10-digit phone number
- **Existing User**: 9999999999 (skips age verification)
- **OTP**: 1234 (for all users)

### Test Data
- **Beer Categories**: All, Lager, Ale, Stout, Wheat, IPA
- **Sample Beers**: 12 different beers with varying prices
- **Banners**: 3 promotional banners with auto-scroll

## ✅ Final Checklist

Before declaring the app ready:
- [ ] Complete authentication flow works
- [ ] All screens navigate correctly
- [ ] All buttons are functional
- [ ] Search and filter work
- [ ] Cart operations work
- [ ] Profile management works
- [ ] Error handling is proper
- [ ] Data persists correctly
- [ ] Performance is acceptable
- [ ] UI is responsive

**Note**: Test on both iOS and Android devices for platform-specific issues.
