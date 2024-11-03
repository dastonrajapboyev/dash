import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginComponent = ({ onLogin }) => {
  const [phoneNumber, setPhoneNumber] = useState("+998901234568");
  const [password, setPassword] = useState("12345678");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://197f-84-54-71-79.ngrok-free.app/japan/edu/api/auth/login/web",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "web-request": "true",
          },
          body: JSON.stringify({
            dateBirth: "01/01/1990",
            deviceId: "myDevice123",
            fcmToken: "sampleToken",
            firstName: "John",
            genderType: "ERKAK",
            lastName: "Doe",
            password,
            phoneNumber,
            photoId: "photo123",
            referralCode: "myRefCode",
            smsCode: 123456,
            userId: 1,
          }),
        }
      );

      const data = await response.json();

      // Log the entire response data to check the structure
      console.log("Response data:", data);

      if (response.ok) {
        // Access the token directly from the data object
        const token = data.token; // Use data.token directly here
        if (token) {
          localStorage.setItem("token", token); // Store the token
          console.log("Token stored:", token); // Log the token after storing
          navigate("/dashboard");
          onLogin(); // Proceed to GroupDashboardComponent
        } else {
          console.error("Token is undefined:", token);
          setError("Token not received. Please try again.");
        }
      } else {
        setError(data.message || "Login error");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Error connecting to the server");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Login
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Telefon raqam"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            placeholder="Parol"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginComponent;
