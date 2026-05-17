/**
 * features/auth/pages/index.js
 * Barrel export for all auth pages.
 *
 * The actual page files live in src/pages/auth/ (existing).
 * Re-export them here so feature imports stay self-contained:
 *
 *   export { default as LoginPage }         from '../../../pages/auth/Login.jsx';
 *   export { default as RegisterPage }      from '../../../pages/auth/Register.jsx';
 *   export { default as ForgotPasswordPage} from '../../../pages/auth/ForgotPassword.jsx';
 *   export { default as ResetPasswordPage } from '../../../pages/auth/ResetPassword.jsx';
 */

export { default as LoginPage }          from './Login.jsx';
export { default as RegisterPage }       from './Register.jsx';
export { default as ForgotPasswordPage } from './ForgotPassword.jsx';
export { default as ResetPasswordPage }  from './ResetPassword.jsx';
