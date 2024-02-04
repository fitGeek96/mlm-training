import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

export const loader = async () => {
  const data = {
    trainings: await db.training.findMany({
      take: 20,
      orderBy: {
        title: "desc",
      },
    }),
  };

  return data;
};

function TrainingCourses() {
  const { trainings } = useLoaderData();
  return (
    <>
      <div className="page-header">
        <h1>Premium Courses</h1>
        {/* <Link to="/training/new" className="btn">
          New Course
        </Link> */}
      </div>
      <ul className="posts-list">
        {trainings.map((training) => (
          <li key={training.id}>
            <Link to={`/training/${training.id}`}>
              <h3>{training.title}</h3>
              {new Date(training.createdAt).toLocaleDateString()}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export default TrainingCourses;
