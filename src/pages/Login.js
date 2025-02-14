import { Button } from "../components/ui/button";
import { login, getUser } from "../services/auth0";

const Login = ({ setUser }) => {
  const handleLogin = async () => {
    await login();
    const user = await getUser();
    setUser(user);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Button onClick={handleLogin} className="text-xl">
        Sign in with Auth0
      </Button>
    </div>
  );
};

export default Login;
