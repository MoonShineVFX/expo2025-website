import { useEffect, useState } from "react";

interface Values {
  life: number;
  future: number;
  nature: number;
  updated_at: string;
}

const Status = () => {
  const [values, setValues] = useState<Values | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://urlencrypt-api.divine-wave-35ee.workers.dev/values"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        if (data.status === "success") {
          setValues(data.values);
        } else {
          throw new Error("Failed to fetch values");
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div
      className="w-full text-white flex items-center justify-center  h-[100vh] relative  flex-col gap-8"
      style={{
        background: "linear-gradient(-45deg, #73C5F3, #43ADE9, #0D90DD)",
        backgroundSize: "400% 400%",
        animation: "gradient 8s ease infinite",
      }}
    >
      <p className="flex flex-col justify-center items-center">
        <span className="text-2xl font-bold ">{values?.life}</span>
        <span>Life</span>
      </p>
      <p className="flex flex-col justify-center items-center">
        <span className="text-2xl font-bold ">{values?.nature}</span>
        <span>Nature</span>
      </p>
      <p className="flex flex-col justify-center items-center">
        <span className="text-2xl font-bold ">{values?.future}</span>
        <span>Future</span>
      </p>
      <p className="flex justify-center items-center">
        <span className="text-sm tracking-wide">
          Updated at {values?.updated_at}
        </span>{" "}
      </p>
    </div>
  );
};

export default Status;
