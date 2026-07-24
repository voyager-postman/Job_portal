import GlobalLoader from "../components/GlobalLoader";

const Spinner = ({ message, overlay = false }) => {
  return <GlobalLoader message={message} overlay={overlay} />;
};

export default Spinner;
