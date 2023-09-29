import { useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import TwoFactorAccessBlocker from "src/components/Modals/TwoFactorAccessBlocker";
import { useLoginMutation } from "src/features/auth/authApi";

export default function Signin() {
  const currentUser = useSelector((state: any) => state?.user?.currentUser);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: false });

  const [login, { data, isLoading, error }] = useLoginMutation();

  const handleSubmit = (e) => {
    e.preventDefault();

    login({
      email,
      password,
    })
      .unwrap()
      .then((res) => {
        console.log(`otp_enabled: `, res?.user?.otp_enabled);
        console.log(`otp_validated: `, res?.user?.otp_validated);

        if (res?.user?.otp_enabled && !res?.user?.otp_validated) {
          onToggle();
        }
      })
      .catch((err) => {
        console.log(`err: `, err);
      });
  };

  if (error) {
    console.log(`error: `, error);
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {isOpen && (
        <TwoFactorAccessBlocker
          isOTPAccessBlockerOpen={isOpen}
          onOTPAccessBlockerToggle={onToggle}
        />
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <div>
            <input
              id="email-address"
              name="email"
              type="email"
              placeholder="Email address"
              value={email}
              style={{ marginTop: "1rem", backgroundColor: "red" }}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={password}
              style={{ marginTop: "1rem", backgroundColor: "red" }}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div>
          <button type="submit">Sign in</button>
        </div>
      </form>
    </div>
  );
}
