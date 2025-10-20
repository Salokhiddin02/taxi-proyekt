# Taxi WebApp - Telegram WebApp

A complete Angular application designed to run inside a Telegram WebApp (WebView) for booking taxi rides.

## Features

- 🚗 **Trip Booking Form**: Responsive form with location, date, and passenger selection
- 👨‍💼 **Driver List**: Display available drivers with ratings, contact info, and ETA
- 🎨 **Telegram Integration**: Full Telegram WebApp API integration with theme support
- 📱 **Mobile-First Design**: Optimized for mobile devices and Telegram WebView
- 🎯 **Material Design**: Beautiful UI using Angular Material components

## Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Angular CLI

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd taxi-webapp
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:4200`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/taxi-webapp` directory.

## Telegram WebApp Integration

This app is designed to run inside Telegram's WebView. Key integration features:

### Telegram API Features Used:
- `window.Telegram.WebApp.ready()` - Initialize the WebApp
- `window.Telegram.WebApp.expand()` - Expand the WebApp to full screen
- `window.Telegram.WebApp.close()` - Close the WebApp
- `window.Telegram.WebApp.themeParams` - Access Telegram theme colors
- `window.Telegram.WebApp.openLink()` - Open external links (phone numbers)

### Theme Support:
The app automatically detects and applies Telegram's theme colors:
- Background color
- Text color  
- Button colors
- Hint colors

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── home/           # Trip booking form
│   │   └── drivers/        # Driver list display
│   ├── services/
│   │   └── driver.ts       # Driver data service
│   ├── app.ts             # Main app component with Telegram integration
│   ├── app.html           # App layout with header and close button
│   ├── app.config.ts      # App configuration with routing and animations
│   └── app.routes.ts      # Route definitions
├── styles.css             # Global styles and Material theme
└── index.html             # HTML template with Telegram script
```

## Deployment

### Vercel Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy to Vercel:
```bash
npx vercel --prod
```

3. Configure your Telegram bot to use the deployed URL as the WebApp URL.

### Netlify Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist/taxi-webapp` folder to Netlify

3. Configure your Telegram bot with the Netlify URL.

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Upload the contents of `dist/taxi-webapp` to your web server

3. Ensure your server serves `index.html` for all routes (SPA routing)

## Telegram Bot Setup

To use this app with a Telegram bot:

1. Create a bot using [@BotFather](https://t.me/botfather)
2. Set up a WebApp URL using the `/newapp` command
3. Configure the WebApp URL to point to your deployed application
4. Users can access the app through the bot's WebApp button

## API Integration

The app currently uses mock data for drivers. To integrate with a real API:

1. Update the `DriverService` in `src/app/services/driver.ts`
2. Replace the mock `getDrivers()` method with actual API calls
3. Add error handling and loading states as needed

## Customization

### Adding New Features
- Create new components in `src/app/components/`
- Add routes in `src/app/app.routes.ts`
- Update the navigation as needed

### Styling
- Global styles: `src/styles.css`
- Component-specific styles: `src/app/components/[component]/[component].css`
- Telegram theme variables are available as CSS custom properties

### Mock Data
- Driver data is in `src/app/services/driver.ts`
- Update the `getDrivers()` method to modify available drivers

## Browser Support

- Chrome/Chromium (recommended for Telegram WebView)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check the GitHub issues
2. Review the Telegram WebApp documentation
3. Contact the development team

---

Built with ❤️ using Angular and Angular Material for Telegram WebApps.