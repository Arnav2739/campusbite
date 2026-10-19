# 🤝 CampusBite - Team Collaboration & Git Workflow Guidelines

To ensure smooth collaboration across all 6 members and avoid merge conflicts, please strictly follow these engineering practices.

---

## 1. Branch Strategy

- **`main`**: Protected branch. Contains stable, runnable code. Only merged via Pull Request.
- **Feature Branches**: Every teammate must work strictly within their own branch:
  - `feat/pushkar-menu-module` (Lead)
  - `feat/aditya-auth-security`
  - `feat/riya-auth-ui`
  - `feat/arnav-slots-checkout`
  - `feat/vedanti-orders-tracking`
  - `feat/anish-staff-dashboard`

---

## 2. Commit Message Standards (Conventional Commits)

Format: `<type>(<scope>): <short description>`

### Allowed Types:
- **`feat`**: Adding a new feature or endpoint (e.g., `feat(auth): implement JWT login endpoint`)
- **`fix`**: Fixing a bug or typo (e.g., `fix(cart): correct total price tax calculation`)
- **`docs`**: Documentation updates (e.g., `docs(api): update order status payload example`)
- **`chore`**: Setup, dependencies, configuration (e.g., `chore(deps): update lucide-react`)
- **`test`**: Adding Postman or unit tests (e.g., `test(menu): add Postman test collection`)

---

## 3. The 3 Golden Rules ⚠️

1. **NEVER modify `server/server.js` or `client/src/App.jsx`**: Pushkar has already pre-wired all endpoints and route paths. Modifying these files will create merge conflicts with other teammates.
2. **NEVER commit `.env` or `node_modules`**: `.gitignore` is already configured. Always verify with `git status` before committing.
3. **Always test locally before pushing**:
   - Backend: run `node server.js` to ensure no syntax errors.
   - Frontend: run `npm run build` in `client/` to verify Vite builds without errors.

---

## 4. Pull Request & Review Checklist

Before opening a PR to merge into `main`:
1. Pull the latest `main` branch:
   ```bash
   git checkout main
   git pull origin main
   git checkout <your-branch>
   git merge main
   ```
2. Test both frontend and backend using `start.bat`.
3. Open a GitHub Pull Request with a clear summary of which endpoints or components were built.
4. Request review from **Pushkar (Lead)** before merging.
