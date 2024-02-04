import {
  Form,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  redirect,
  useRouteError,
} from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { useActionData, json } from "@remix-run/react";
import { getUser } from "~/utils/session.server";

const validateTitle = (title) => {
  if (typeof title !== "string" || title.length < 3) {
    return "The Title field should be at least 3 characters long";
  }
};

const validateBody = (body) => {
  if (typeof body !== "string" || body.length < 10) {
    return "The Training details field should be at least 10 characters long";
  }
};

function badRequest(data) {
  return json(data, { status: 400 });
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const title = form.get("title");
  const body = form.get("body");
  const user = await getUser(request);

  const fields = { title, body };

  const fieldErrors = {
    title: validateTitle(title),
    body: validateBody(body),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    console.log(fieldErrors);
    return badRequest({ fieldErrors, fields });
  }

  const trainingCourse = await db.training.create({
    data: { ...fields, userId: user?.id },
  });

  return redirect(`/training/${trainingCourse.id}`);
}

function NewTraining() {
  const actionData = useActionData();

  console.log(actionData);

  return (
    <>
      <div className="page-header">
        <h1>New Training Course</h1>
        <Link to="/training/courses" className="btn">
          Back
        </Link>
      </div>
      <div className="page-content">
        <Form method="post">
          <div className="form-control">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              defaultValue={actionData?.fields?.title}
            />
            <div className="error">
              <p>
                {actionData?.fieldErrors?.title &&
                  actionData?.fieldErrors?.title}
              </p>
            </div>
          </div>
          <div className="form-control">
            <label htmlFor="body">Training Course Details</label>
            <textarea
              name="body"
              id="tcd"
              defaultValue={actionData?.fields?.body}
            />
            <div className="error">
              <p>
                {actionData?.fieldErrors?.body && actionData?.fieldErrors?.body}
              </p>
            </div>
          </div>
          <button className="btn btn-block" type="submit">
            Add Training Course
          </button>
        </Form>
      </div>
    </>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <h4>{error.message}</h4>
        <Scripts />
      </body>
    </html>
  );
}

export default NewTraining;
