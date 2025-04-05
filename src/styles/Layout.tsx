import { Outlet } from "react-router-dom";
import { useIframe } from "../hooks/useIframeListener";
import { Container } from "@mui/material";


const Layout = () => {
  useIframe()
  return (
    <Container>
    {/* Add Header here */}
      <main>
        <Outlet /> {/* This is where page content will be rendered */}
      </main>
      {/* Add Footer here */}
    </Container>
  );
};

export default Layout;
