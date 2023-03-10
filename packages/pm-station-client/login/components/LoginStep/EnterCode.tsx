import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { useState, useRef } from "react";
import type { FormEventHandler } from "react";
import { toast } from "react-toastify";

import { isFirebaseError, useFirebase } from "@station/client/firebase";
import { SubmitButton } from "@station/client/SubmitButton";
import type { PhoneLoginStepProps } from "./types";
//import { captureException } from "@sentry/browser";
import { useServerLogin } from "../../hooks/useServerLogin";

const disclosePhoneNo = (phoneNo: string) => {
  const hideLength = phoneNo.length - 4;
  return Array(hideLength).fill("X").join("") + phoneNo.slice(hideLength);
};

export function EnterCode({
  setLoginRequest,
  loginRequest,
}: PhoneLoginStepProps) {
  const serverLogin = useServerLogin();

  const [loading, setLoading] = useState(false);
  const { auth } = useFirebase();
  const codeInput = useRef<HTMLInputElement>(null);
  const submitForm: FormEventHandler = async (e) => {
    e.preventDefault();
    if (!codeInput.current || !loginRequest) return;
    try {
      setLoading(true);
      const credential = PhoneAuthProvider.credential(
        loginRequest.verificationId,
        codeInput.current.value
      );
      const { user } = await signInWithCredential(auth, credential);
      await serverLogin(user);
    } catch (err) {
      console.error(err);
      //captureException(err);
      let error = (err as Error).message;
      if (isFirebaseError(err)) {
        if (err.code.endsWith("-verification-code")) {
          error = "รหัส OTP ไม่ถูกต้อง";
        } else if (err.code === "code-expired") {
          error = "รหัส OTP หมดอายุหรือถูกใช้ไปแล้ว";
        }
      }

      toast(
        <>
          <b>ไม่สามารถเข้าสู่ระบบได้</b>
          {error && <span>{error}</span>}
        </>,
        {
          type: "error",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  if (!loginRequest) return null;
  return (
    <form className="flex flex-col gap-4" onSubmit={submitForm}>
      <label htmlFor="code-input">
        ป้อนรหัส 6 หลักที่ถูกส่งไปยังหมายเลข{" "}
        {disclosePhoneNo(loginRequest.phoneNo)}
      </label>
      <input
        name="code-input"
        autoComplete="off"
        type="text"
        required
        inputMode="numeric"
        className="pm-station-input text-center"
        pattern="[0-9]{6}"
        ref={codeInput}
        disabled={loading}
        placeholder="ป้อนตัวเลขเท่านั้น"
      />
      <SubmitButton loading={loading}>เข้าสู่ระบบ</SubmitButton>
      <button
        disabled={loading}
        className="underline disabled:cursor-not-allowed w-max self-center"
        onClick={() => setLoginRequest(undefined)}
      >
        ยกเลิก
      </button>
    </form>
  );
}
