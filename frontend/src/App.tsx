import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./views/Home";
import Write from "./views/Write";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <div> Something went wrong!</div>,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "Write",
        element: <Write />,
      },
      // {
      //   path: "test",
      //   action: todosAction,
      //   loader: todosLoader,
      //   Component: TodosList,
      //   ErrorBoundary: TodosBoundary,
      //   children: [
      //     {
      //       path: ":id",
      //       loader: todoLoader,
      //       Component: Todo,
      //     },
      //   ],
      // },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;