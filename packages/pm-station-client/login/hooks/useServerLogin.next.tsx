import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import type { User } from "firebase/auth";
import { LoginAction, toFormData } from "@station/shared/api";
import { toast } from "react-toastify";
import axios from "axios";

const CONTROLLER_PAGE = "/controller/app";

export const useServerLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mounted = useRef(false);

  useEffect(() => {
    router.prefetch(CONTROLLER_PAGE);
  }, [router]);

  const serverLogin = async (user: User) => {
    // grab the id token and pass it to the backend
    const token = await user.getIdToken();
    try {
      await axios.post(
        "/api/login",
        toFormData<LoginAction>({
          token,
          continueUrl: searchParams.get("continueUrl"),
        })
      );

      router.replace(CONTROLLER_PAGE);
    } catch (err) {
      console.error(err);
      toast(
        <>
          <b>ไม่สามารถเข้าสู่ระบบได้</b>
          <span>ข้อผิดพลาดจากเซิร์ฟเวอร์</span>
        </>,
        {}
      );
    }
  };

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  return serverLogin;
};
