import { useRouter } from "next/router";
import axios from "axios";
import { useEffect, useState } from "react";
import LoginCheckLayout from "../layouts/LoginCheckLayout";

export default function Oauth() {
  const router = useRouter();
  const [loginFlag, setLoginFlag] = useState();

  const getProvider = (state) => {
    if (state.includes("naver")) {
      return "NAVER";
    }
    if (state.includes("kakao")) {
      return "KAKAO";
    }
    if (state.includes("google")) {
      return "GOOGLE";
    }
  };

  const { code, state } = router.query;
  // TODO: code 가지고 /login/token으로 요청해서 우리 서비스의 accessToken 받아오기
  const login = async () => {
    await axios
      .post(`/api/login/token`, {
        code: { code }.code,
        providerName: getProvider({ state }.state),
      })
      .then((res) => {
        setLoginFlag(true);
        const obj = {
          value: res.data.accessToken,
          expire: new Date().getTime() + 1000 * 60 * 60,
        };
        localStorage.setItem("accessToken", JSON.stringify(obj));
      })
      .catch(function (error) {
        console.log(error);
        setLoginFlag(false);
      });
  };

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    login();
  }, [router.isReady]);

  return (
    <>
      {loginFlag !== undefined ? (
        <LoginCheckLayout loginFlag={loginFlag} />
      ) : (
        ""
      )}
    </>
  );
}
