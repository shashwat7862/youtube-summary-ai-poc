import SignInForm from "@/components/auth/SignInForm";
import PageMeta from "@/components/common/PageMeta";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Sign In | Cash Collection Bridge - GE HealthCare"
        description="Sign in to access your collections operations dashboard"
      />
      <SignInForm />
    </>
  );
}
