import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../services/types";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { styled } from "styled-components";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else if (location.pathname === "/") {
      navigate("/calendar");
    }
  }, [isLoggedIn, location.pathname, navigate]);
  if (!isLoggedIn) return <></>;
  return (
    <HomeContainer>
      <NavBar>
        <NavLink to="/calendar" $selected={location.pathname === "/calendar"}>
          Calendar
        </NavLink>
        <NavLink
          to="/appointments"
          $selected={location.pathname === "/appointments"}
        >
          Bookings
        </NavLink>
      </NavBar>
      <Outlet />
    </HomeContainer>
  );
};

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NavBar = styled.nav`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
`;

const NavLink = styled(Link)<{ $selected?: boolean }>`
  color: ${({ $selected }) => ($selected ? "#ffffff" : "#000000")};
  background-color: ${({ $selected }) => ($selected ? "#007bff" : "#f0f0f0")};
  padding: 8px 16px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    background-color: ${({ $selected }) => ($selected ? "#0056b3" : "#d9d9d9")};
  }
`;

export default Home;
