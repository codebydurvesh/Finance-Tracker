import React, { useEffect, useRef, useCallback, useState } from "react";

const GoogleLoginButton = ({ onGoogleLogin }) => {
  const googleButtonRef = useRef(null);
  const [buttonWidth, setButtonWidth] = useState(350);

  const handleGoogleLogin = useCallback(
    async (credentialResponse) => {
      await onGoogleLogin(credentialResponse);
    },
    [onGoogleLogin]
  );

  // Calculate responsive button width
  useEffect(() => {
    const updateButtonWidth = () => {
      if (googleButtonRef.current) {
        const containerWidth = googleButtonRef.current.offsetWidth;
        const maxWidth = Math.min(containerWidth, 400);
        const minWidth = 200;
        setButtonWidth(Math.max(minWidth, maxWidth));
      }
    };

    updateButtonWidth();
    window.addEventListener('resize', updateButtonWidth);

    return () => {
      window.removeEventListener('resize', updateButtonWidth);
    };
  }, []);

  useEffect(() => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

    if (!clientId) {
      console.error("Google Client ID not found");
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.google && googleButtonRef.current) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleLogin,
            auto_select: false,
            cancel_on_tap_outside: true,
            itp_support: true,
          });

          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: "outline",
            size: "large",
            text: "signin_with",
            width: buttonWidth,
            shape: "rectangular",
            logo_alignment: "left",
          });
        } catch (err) {
          console.error("Google Sign-In initialization error:", err);
          if (googleButtonRef.current) {
            googleButtonRef.current.innerHTML =
              '<p style="text-align: center; color: #f44336; font-size: 0.9rem;">Google Sign-In error. Check console for details.</p>';
          }
        }
      }
    };

    script.onerror = () => {
      console.error("Failed to load Google Sign-In script");
      if (googleButtonRef.current) {
        googleButtonRef.current.innerHTML =
          '<p style="text-align: center; color: #f44336; font-size: 0.9rem;">Failed to load Google Sign-In</p>';
      }
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [handleGoogleLogin, buttonWidth]);

  return <div ref={googleButtonRef} className="google-signin-wrapper"></div>;
};

export default GoogleLoginButton;
