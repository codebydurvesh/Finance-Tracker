# Contributing to Finance Tracker

Thank you for considering contributing to Finance Tracker! This document provides guidelines for contributing to the project.

## 🤝 How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:

- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Your environment (OS, browser, Node version)

### Suggesting Features

Feature suggestions are welcome! Please:

- Check if the feature is already requested
- Provide a clear use case
- Explain the expected benefit
- Consider implementation complexity

### Pull Requests

1. **Fork the repository**

   ```bash
   git clone https://github.com/yourusername/finance-tracker.git
   cd finance-tracker
   ```

2. **Create a feature branch**

   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **Make your changes**

   - Write clean, readable code
   - Follow existing code style
   - Add comments where necessary
   - Update documentation if needed

4. **Test your changes**

   ```bash
   # Backend tests
   cd backend
   npm test

   # Frontend tests (if available)
   cd frontend
   npm test
   ```

5. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

6. **Push to your fork**

   ```bash
   git push origin feature/AmazingFeature
   ```

7. **Create Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Provide clear description of changes

## 📝 Commit Message Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Build process or auxiliary tool changes

**Examples:**

```bash
feat: add export to CSV functionality
fix: resolve OTP expiry timer issue
docs: update deployment guide
style: format user controller
refactor: optimize transaction queries
test: add user authentication tests
chore: update dependencies
```

## 🎨 Code Style Guidelines

### JavaScript/React

- Use ES6+ features
- Use functional components with hooks
- Follow ESLint rules
- Use meaningful variable names
- Keep functions small and focused
- Add JSDoc comments for complex functions

### CSS

- Use meaningful class names
- Follow BEM naming convention when applicable
- Keep styles modular
- Use CSS variables for theme colors
- Maintain responsive design

### File Structure

- One component per file
- Group related files together
- Use descriptive file names
- Follow existing folder structure

## 🧪 Testing

- Write tests for new features
- Ensure existing tests pass
- Test on multiple browsers
- Test responsive design on mobile
- Test edge cases

## 📚 Documentation

When adding features:

- Update README.md if needed
- Update API_TESTING.md for new endpoints
- Add comments to complex code
- Update CHANGELOG.md

## 🔒 Security

- Never commit sensitive data (.env files)
- Report security vulnerabilities privately
- Follow security best practices
- Use environment variables for secrets

## ⚖️ Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discriminatory language
- Trolling or insulting comments
- Public or private harassment
- Publishing others' private information
- Unprofessional conduct

## 📞 Questions?

If you have questions:

- Create a discussion on GitHub
- Email: durvesh.gaikwad08@gmail.com
- Check existing issues and discussions

## 🎯 Priority Areas for Contribution

We especially welcome contributions in:

1. **Testing**

   - Unit tests
   - Integration tests
   - E2E tests

2. **Documentation**

   - Improve README
   - Add code comments
   - Create tutorials

3. **Features**

   - Export to CSV/PDF
   - Recurring transactions
   - Dark mode
   - Multi-language support

4. **Performance**

   - Optimize database queries
   - Reduce bundle size
   - Improve loading times

5. **Accessibility**
   - ARIA labels
   - Keyboard navigation
   - Screen reader support

## 🙏 Recognition

Contributors will be:

- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Appreciated in the community

## 📄 License

By contributing, you agree that your contributions will be licensed under the ISC License.

---

**Thank you for making Finance Tracker better! 🎉**

**© 2025-26 Finance Tracker. All rights reserved.**
