import React, { useMemo, useReducer, createContext } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { FIREBASE_AUTH } from '../../firebase-config';


export const AuthContext = createContext();

const auth = FIREBASE_AUTH;

const initialState = {
  isLoading: true,
  user: null,
  isSignout: false,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'RESTORE_USER':
      return {
        ...state,
        user: action.user,
        isLoading: false,
        error: null,
      };
    case 'SIGN_IN':
      return {
        ...state,
        isSignout: false,
        user: action.user,
        error: null,
      };
    case 'SIGN_OUT':
      return {
        ...state,
        isSignout: true,
        user: null,
        error: null,
      };
    case 'LOADING':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    default:
      return state; 
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      dispatch({ type: 'RESTORE_USER', user });
    });
    return unsubscribe;
  }, []);

  const authContext = useMemo(() => ({

   signIn: async (email, password) => {
      dispatch({ type: 'LOADING' });
      try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        dispatch({ type: 'SIGN_IN', user: res.user });
      } catch (e) {
        console.error("Login failed:", e);
        dispatch({ type: 'ERROR', error: 'Login failed' + e.message });
        alert('Login failed: ' + e.message);
      }
    },

    signOut: () => {
      signOut(auth).then(() => {
        dispatch({ type: 'SIGN_OUT' });
      }).catch((e) => {
        console.error("Sign out failed:", e);
        dispatch({ type: 'ERROR', error: 'Sign out failed: ' + e.message });
        alert('Sign out failed: ' + e.message);
      });
    },

    signUp: async (email, password) => {
      dispatch({ type: 'LOADING' });
      try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        dispatch({ type: 'SIGN_IN', user: res.user });
        return res;
      } catch (e) {
        console.error("Sign up failed:", e);
        dispatch({ type: 'ERROR', error: 'Sign up failed: ' + e.message });
        alert('Account creation failed: ' + e.message);
        throw e;
      }
    },
    state,
  }), [state]);

  return (
    <AuthContext.Provider value={{ ...state, ...authContext }}>
      { children }
    </AuthContext.Provider>
  );
}