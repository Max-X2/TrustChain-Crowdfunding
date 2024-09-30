import { useEffect, useState } from 'react';

export default function RenderMessage({ message, messageType }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true); 

      if (messageType !== 'loading') {
        const timer = setTimeout(() => {
          setVisible(false);
        }, 7000);

        return () => clearTimeout(timer);
      }
    }
  }, [message, messageType]);


  if (!message || !visible) return null;

  let alertClass = "";
  switch (messageType) {
    case "success":
      alertClass = "alert alert-success";
      break;
    case "error":
      alertClass = "alert alert-danger";
      break;
    case "loading":
      alertClass = "alert alert-info";
      break;
    default:
      alertClass = "";
  }

  return (
    <div className={`${alertClass} col-6 p-3 text-center fs-6`} dangerouslySetInnerHTML={{ __html: message }}></div>
  );
};