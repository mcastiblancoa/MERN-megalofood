import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import LoadingButton from "./LoadingButton";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import UserProfileForm, {
  UserFormData,
} from "@/forms/user-profile-form/UserProfileForm";
import { useGetMyUser } from "@/api/MyUserApi";

type Props = {
  onCheckout: (userFormData: UserFormData) => void;
  disabled: boolean;
  isLoading: boolean;
};

const CheckoutButton = ({ onCheckout, disabled, isLoading }: Props) => {
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
    loginWithRedirect,
  } = useAuth0();

  const { pathname } = useLocation();

  const { currentUser, isLoading: isGetUserLoading } = useGetMyUser();

  const onLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: pathname,
      },
    });
  };

  if (!isAuthenticated) {
    return (
      <Button onClick={onLogin} className="flex-1">
        Logueate para completar el checkout
      </Button>
    );
  }

  if (isAuthLoading || !currentUser || isLoading) {
    return <LoadingButton />;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={disabled} className="flex-1 font-raleway">
          Ir a pagar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[425px] md:min-w-[700px] bg-gray-50 font-raleway font-semibold">
        <UserProfileForm
          currentUser={currentUser}
          onSave={onCheckout}
          isLoading={isGetUserLoading}
          title="Confirmar detalles de entrega"
          buttonText="Continuar con el pago"
        />
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutButton;