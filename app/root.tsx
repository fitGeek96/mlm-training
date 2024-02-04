import {
  Outlet,
  LiveReload,
  Link,
  Links,
  useLoaderData,
  Form,
} from "@remix-run/react";
import globalStylesUrl from "~/styles/global.css";
import { getUser } from "./utils/session.server";

export const links = () => [{ rel: "stylesheet", href: globalStylesUrl }];

export const loader = async ({ request }) => {
  const user = await getUser(request);
  const data = {
    user,
  };

  return data;
};

export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
}

function Document({ children, title }) {
  return (
    <html lang="en">
      <head>
        <Links />
        <title>Training</title>
      </head>
      <body>
        {children}
        {process.env.NODE_ENV === "development" ? <LiveReload /> : null}
      </body>
    </html>
  );
}

function Layout({ children }) {
  const { user } = useLoaderData();

  return (
    <>
      <nav className="navbar">
        <Link to="http://teamlegend.netlify.app" className="logo">
          <img src="/images/logo.png" alt="" title="" />
        </Link>
        <ul className="nav">
          {user ? (
            <>
              <li>
                <Link to="/training/courses">Courses</Link>
              </li>
              <li>
                <Form action="/auth/logout" method="post">
                  <button className="btn" type="submit">
                    Logout
                  </button>
                </Form>
              </li>
            </>
          ) : (
            <li>
              <Link to="/auth/login">Login</Link>
            </li>
          )}
        </ul>
      </nav>

      <div className="container">{children}</div>
    </>
  );
}
