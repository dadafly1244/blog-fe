// src/pages/SignInPage.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "@/hook/loginApi";
import useLoginStore from "@/store/loginStore";

const SignInPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();
  const navigate = useNavigate();
  const setPersist = useLoginStore((state) => state.setPersist);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(
      { user: username, pwd: password },
      {
        onSuccess: (data) => {
          // data에서 accessToken과 refreshToken을 추출
          const { accessToken } = data.data;
          // loginStore의 setCredentials 함수를 사용하여 토큰들을 저장
          useLoginStore.getState().setCredentials(accessToken);
          navigate("/blog");
        },
        onError: (error) => {
          console.error("Login failed:", error);
        },
      }
    );
  };

  return (
    <div className="sign-in-page">
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              onChange={(e) => setPersist(e.target.checked)}
            />
            Remember me
          </label>
        </div>
        <button type="submit">Sign In</button>
      </form>
      {login.isError && (
        <p className="error">Login failed. Please try again.</p>
      )}
    </div>
  );
};

export default SignInPage;
