"use client";

import { LoginForm } from "@/features/auth-by-email";
import { RegisterForm } from "@/features/register-by-email";
import { Modal } from "@/shared/ui/modal";
import { useAuthModals } from "../model/use-auth-modals";

export function AuthModals() {
  const { activeModal, close, switchToLogin, switchToRegister } =
    useAuthModals();

  return (
    <>
      <Modal
        isOpen={activeModal === "login"}
        onClose={close}
        title="Sign in"
      >
        <LoginForm
          onSwitchToRegister={switchToRegister}
          onSubmit={() => close()}
        />
      </Modal>

      <Modal
        isOpen={activeModal === "register"}
        onClose={close}
        title="Create account"
      >
        <RegisterForm
          onSwitchToLogin={switchToLogin}
          onSubmit={() => close()}
        />
      </Modal>
    </>
  );
}
