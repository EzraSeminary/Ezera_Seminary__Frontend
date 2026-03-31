import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useState } from "react";

type GoogleAuthButtonProps = {
  onCredential: (credential: string) => Promise<void>;
  text?: "signin_with" | "signup_with" | "continue_with";
  disabled?: boolean;
};

const GoogleAuthButton = ({
  onCredential,
  text = "continue_with",
  disabled = false,
}: GoogleAuthButtonProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = async (response: CredentialResponse) => {
    if (!response.credential || disabled || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onCredential(response.credential);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isBlocked = disabled || isSubmitting;

  return (
    <div className="relative w-full">
      <div
        className={`transition-opacity ${
          isBlocked ? "pointer-events-none opacity-60" : ""
        }`}
      >
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => {
            setIsSubmitting(false);
          }}
          text={text}
          shape="pill"
          theme="outline"
          size="large"
          width="100%"
        />
      </div>
      {isBlocked ? <div className="absolute inset-0 z-10" aria-hidden="true" /> : null}
    </div>
  );
};

export default GoogleAuthButton;
