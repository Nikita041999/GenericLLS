import Spinner from "react-bootstrap/Spinner";

export default function Loader({ loaderClassName = "" }) {
  return (
    <Spinner
      animation="border"
      // variant="primary"
      className={`themeLoader ${loaderClassName}`}
    />
  );
}
