import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../services/firebase";
import { verifyDeviceTrust } from "../../services/authService";

const PrivateRoute: React.FC = () => {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const isTrusted = await verifyDeviceTrust(user.uid);
        setAuthenticated(isTrusted);
      } else {
        setAuthenticated(false);
      }
      setChecking(false);
    });
    return () => unsubscribe();
  }, []);

  if (checking) return null;
  return authenticated ? <Outlet /> : <Navigate to="/admin" replace />;
};

export default PrivateRoute;