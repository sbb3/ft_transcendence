import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../features/auth/authApi";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [register, { data, isLoading, error }] =
    useRegisterMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (data?.accessToken && data?.user) {
      navigate("/chat");
    }
  }, [data, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    register({
      name,
      email,
      password,
    });
  };

  if (error) {
    console.log(`error: `, error);
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div
    >
      <div
      >
        <div
        >
          <form
            onSubmit={handleSubmit}>
            <div
            >
              <div>
                <input
                  id="name"
                  name="Name"
                  type="Name"
                  placeholder="full name"
                  value={name}
                  style={{ marginTop: "1rem", backgroundColor: "red", color: "black" }}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Email address"
                  value={email}
                  style={{ marginTop: "1rem", backgroundColor: "red", color: "black" }}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="Password"
                  value={password}
                  style={{ marginTop: "1rem", backgroundColor: "red", color: "black" }}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                disabled={isLoading}
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3"></span>
                Sign up
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
