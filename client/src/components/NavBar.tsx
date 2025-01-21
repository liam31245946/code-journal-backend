import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useUser } from './useUser';

export function NavBar() {
  const { user, handleSignOut } = useUser();
  const navigate = useNavigate();

  return (
    <>
      <header className="purple-background">
        <div className="container">
          <div className="row">
            <div className="column-full d-flex align-center">
              <h1 className="white-text">Code Journal</h1>
              {user && (
                <Link to="/" className="entries-link white-text">
                  <h3>Entries</h3>
                </Link>
              )}
              {!user && (
                <>
                  <Link to="/sign-up" className="entries-link white-text">
                    <h3>Sign Up</h3>
                  </Link>
                  <Link to="/sign-in" className="entries-link white-text">
                    <h3>Sign In</h3>
                  </Link>
                </>
              )}
              {user && (
                <button
                  className="inline-block align-middle text-center border rounded py-1 px-3 bg-blue-600 text-white"
                  onClick={() => {
                    handleSignOut();
                    navigate('/');
                  }}>
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
      <Outlet />
    </>
  );
}
