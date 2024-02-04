import { Form, Link, redirect, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

export const loader = async ({ request, params }) => {
  const user = await getUser(request);

  const trainingCourse = await db.training.findUnique({
    where: {
      id: params.trainingId,
    },
  });

  if (!trainingCourse) {
    throw new Error("Training not Found");
  } else {
    const data = { trainingCourse, user };

    return data;
  }
};

export const action = async ({ request, params }) => {
  const form = await request.formData();

  if (form.get("_method") === "delete") {
    const user = await getUser(request);
    const trainingCourse = await db.training.findUnique({
      where: {
        id: params.trainingId,
      },
    });

    if (!trainingCourse) {
      throw new Error("Training Course not Found");
    }

    if (user && trainingCourse.userId === user.id) {
      await db.training.delete({ where: { id: params.trainingId } });
    }

    return redirect("/training/courses");
  }
};

function TrainingCourses() {
  const { trainingCourse, user } = useLoaderData();
  return (
    <div>
      <div className="page-header">
        <h1>{trainingCourse.title} </h1>
        <Link to="/training/courses" className="btn">
          Back
        </Link>
      </div>
      <div className="page-content">{trainingCourse.body}</div>
      <div className="page-footer">
        {user?.id === trainingCourse?.userId && (
          <Form method="post">
            <input type="hidden" name="_method" value="delete" />
            <button className="btn btn-delete">Delete</button>
          </Form>
        )}
      </div>
    </div>
  );
}

export default TrainingCourses;
