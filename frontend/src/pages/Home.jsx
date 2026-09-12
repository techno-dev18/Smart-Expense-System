import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Smart Expense System</h1>

      <p>
        Manage your income, expenses and budget in one place.
      </p>

      <div>
        <Link to="/login">Login</Link>
        {" | "}
        <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  );
};

export default Home;