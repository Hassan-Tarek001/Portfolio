# Senior Full-Stack Developer Portfolio

A sophisticated, animated portfolio website designed for deployment on GitHub Pages. Built with modern HTML, CSS, and vanilla JavaScript, featuring a premium dark theme and engaging animations.

## Features

- Responsive design with mobile-first approach
- Dark mode with warm accent colors
- Animated background with parallax effects
- Smooth scroll animations and transitions
- Interactive project cards and skill grid
- Integrated contact form using Formspree
- BEM methodology for CSS architecture
- No framework dependencies

## Project Structure

```
.
├── index.html              # Main HTML file
├── css/
│   ├── normalize.css       # CSS reset and normalization
│   ├── variables.css       # Custom properties and theme variables
│   ├── animations.css      # Keyframe animations and transitions
│   └── main.css           # Core styles and components
├── js/
│   └── main.js            # JavaScript for interactions and animations
└── README.md              # Project documentation
```

## Setup and Deployment

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Update the Formspree endpoint:
   - Sign up at [Formspree](https://formspree.io)
   - Create a new form and get your form ID
   - Replace `your-form-id` in `index.html` with your actual form ID

3. Deploy to GitHub Pages:
   - Push your code to GitHub
   - Go to repository Settings > Pages
   - Select your main branch as the source
   - Your site will be available at `https://<username>.github.io/<repository>`

## Customization

### Colors
Edit `css/variables.css` to modify the color scheme:
```css
:root {
    --color-background: #0a0a0f;
    --color-surface: #14141f;
    --color-primary: #ff6b4a;
    /* ... other color variables */
}
```

### Content
Update the following sections in `index.html`:
- Hero section text and call-to-action
- Skills and expertise
- Project showcases
- Career timeline
- Testimonials
- Contact information

### Animations
Modify or add animations in `css/animations.css`:
```css
@keyframes your-animation {
    /* Define your custom animation */
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimization

- Minimal JavaScript with no dependencies
- Optimized CSS with BEM methodology
- Efficient animations using CSS transforms
- Responsive images and media
- Lazy loading for better performance

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

For questions or suggestions, please open an issue in the repository. 