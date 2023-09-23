import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "src/features/auth/authApi";

export default function Signin() {
  console.log(`Signin`);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login, { data, isLoading, error }] = useLoginMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (data?.accessToken && data?.user) {
      navigate("/chat");
    }
  }, [data, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    login({
      email,
      password,
    })
      .unwrap()
      .then((res) => {
        console.log(`res: `, res);
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
      <div>
        <div>
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
      </div>
    </div>
  );
}
