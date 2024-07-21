import { styled, ThemeProvider } from "styled-components";

import { Outlet } from "react-router-dom";

const Wrapper = styled.div`
  width: 100vw;
  background-color: white;
`;

const Layout = () => {
  return (
    <>
      <Wrapper>
        <Outlet />
      </Wrapper>
    </>
  );
};

function App() {
  return (
    <>
      <Layout />
    </>
  );
}

export default App;
