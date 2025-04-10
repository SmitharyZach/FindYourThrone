import * as AppleAuthentication from "expo-apple-authentication";
import { useAuth } from "@/context/AuthContext";

export function AppleLogin() {
  const { appleAuth } = useAuth();

  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={5}
      style={{ width: 305, height: 42, marginTop: 10, marginLeft: 4 }}
      onPress={async () => {
        console.log("Apple button pressed");
        try {
          console.log("Requesting Apple sign-in...");
          const credential = await AppleAuthentication.signInAsync({
            requestedScopes: [
              AppleAuthentication.AppleAuthenticationScope.EMAIL,
            ],
          });
          console.log("Credential:", credential);
          // Sign in via Supabase Auth.
          if (credential.identityToken) {
            appleAuth(credential.identityToken);
          } else {
            throw new Error("No identityToken.");
          }
        } catch (e) {
          console.log("Error:", e);
        }
      }}
    />
  );
}
