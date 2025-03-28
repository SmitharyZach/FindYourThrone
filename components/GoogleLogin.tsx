import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";

export default function () {
  const { googleAuth } = useAuth();

  GoogleSignin.configure({
    iosClientId:
      "171979094835-a9vmc2dj6scdibffj8sdb04qva0dk0i0.apps.googleusercontent.com", // Add this line
  });

  return (
    <GoogleSigninButton
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      onPress={async () => {
        try {
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
          if (userInfo?.data?.idToken) {
            const { data, error } = await googleAuth(
              userInfo.data.idToken,
              userInfo.data.user.email
            );
            console.log(error, data);
          } else {
            throw new Error("no ID token present!");
          }
        } catch (error: any) {
          console.log("Error:", error);
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // user cancelled the login flow
          } else if (error.code === statusCodes.IN_PROGRESS) {
            // operation (e.g. sign in) is in progress already
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            // play services not available or outdated
          } else {
            // some other error happened
          }
        }
      }}
    />
  );
}
