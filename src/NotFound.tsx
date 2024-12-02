import { Link } from "react-router-dom";
/**
 * This component is rendered when the user navigates to an unknown route.
 * Currently, it does not render anything.
 * @returns {JSX.Element} The component to render.
 */
const NotFound = () => {
  return (
    <>
      <div>Not Found</div>
      <Link to="/"> Go Home</Link>
    </>
  );
};

export default NotFound;
